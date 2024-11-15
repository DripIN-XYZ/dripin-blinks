import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createPostResponse,
} from "@solana/actions";

import axios from "axios";
import { getAuctionDetail } from "@/lib/supabase/auctionDetails";
import { Connection, LAMPORTS_PER_SOL, Transaction, PublicKey, SystemProgram } from "@solana/web3.js";

export interface getNFTInfoType {
    onchainId: string;
    attributes: Attribute[];
    imageUri: string;
    lastSale: string;
    metadataFetchedAt: Date;
    metadataUri: string;
    files: File[];
    animationUri: string;
    name: string;
    sellRoyaltyFeeBPS: number;
    tokenEdition: string;
    tokenStandard: string;
    hidden: boolean;
    compressed: boolean;
    verifiedCollection: string;
    owner: string;
    inscription: string;
    tokenProgram: string;
    metadataProgram: string;
    transferHookProgram: string;
    listingNormalizedPrice: string;
    hybridAmount: string;
    listing: Listing;
    slugDisplay: string;
    collId: string;
    collName: string;
    numMints: number;
}

interface Attribute {
    value: string;
    trait_type: string;
}

interface File {
    type: string;
    uri: string;
}

interface Listing {
    price: string;
    txId: string;
    seller: string;
    source: string;
    blockNumber: string;
    priceUnit: string;
}

interface PlaceNFTBidType {
    owner: string;
    price: number;
    mint: string;
    blockhash: string;
    makerBroker?: string;
    useSharedEscrow?: boolean;
    rentPayer?: string;
    expireIn?: number;
    compute?: number;
    priorityMicroLamports?: number;
}

interface Option1 {
    message: string;
}

interface BidState {
    txs: Array<{
        tx: {
            type: string;
            data: Uint8Array;
        };
        txV0: {
            type: string;
            data: Uint8Array;
        };
        lastValidBlockHeight: number | null;
        metadata: object | null;
    }>;
    bidState: string | null;
}

export type getPlaceNFTBidType = Option1 | BidState;

export interface getOrdersOfSingleNftBidsType {
    mint: string;
    bids: Bid[];
}

export interface getAuctionDetailType {
    id: number;
    wallet_address: string;
    lamports: number;
    mint_address: string;
    expiry_time: Date;
}

export interface Bid {
    address: string;
    bidder: string;
    expiry: Date;
    margin: null;
    price: string;
    validFrom: Date;
}

const FEE_RECIPIENT_ADDRESS = process.env.NEXT_PUBLIC_DRIPIN_WALLET_KEY || "ETVZ97k3rZv96cwp3CYpPoBC74PKkQsNQ4ex6NHx2hRx";

const calculateFee = (maxPrice: number): number => {
    return Math.floor(maxPrice * 0.02);
};

const getListAddress = (url: string): string => {
    const cleanUrl = url.split("?")[0];
    const listAddress = cleanUrl.split("/").pop();

    if (!listAddress) {
        throw new Error("Invalid list address");
    }

    return listAddress; // Return the extracted address
};

async function fetchBidNFTencTx({
    owner,
    price,
    mint,
    blockhash,
    makerBroker,
    useSharedEscrow,
    rentPayer,
    expireIn,
    compute,
    priorityMicroLamports,
}: PlaceNFTBidType): Promise<getPlaceNFTBidType> {

    const params = new URLSearchParams({
        owner,
        price: price.toString(),
        mint,
        blockhash,
        ...(makerBroker && { makerBroker }),
        ...(useSharedEscrow !== undefined && { useSharedEscrow: useSharedEscrow.toString() }),
        ...(rentPayer && { rentPayer }),
        ...(expireIn && { expireIn: expireIn.toString() }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const URL = `https://api.mainnet.tensordev.io/api/v1/tx/bid?${params}`

        const response = await axios.get(URL, {
            headers: {
                accept: "application/json",
                "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY,
            },
        });

        if ('message' in response.data) {
            throw new Error(response.data.message);
        }

        if (response.data.txs.length === 0) {
            throw new Error("No transactions returned");
        }

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function fetchOrdersOfSingleNftBidsData(nftMintAddress: string): Promise<getOrdersOfSingleNftBidsType | undefined> {
    try {
        const response = await axios.get(`https://api.mainnet.tensordev.io/api/v1/collections/nft_bids?mints=${nftMintAddress}`, {
            headers: {
                accept: "application/json",
                "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY,
            },
        });
        return response.data[0];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Error fetching single NFT bids data: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
}

async function fetchNFTData(nftMintAddress: string) {
    try {
        const response = await axios.get(`https://api.mainnet.tensordev.io/api/v1/mint?mints=${nftMintAddress}`, {
            headers: {
                accept: "application/json",
                "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY,
            },
        });
        return response.data[0];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Error fetching NFT data 0: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
}

async function getCurrentBidData(nftMintAddress: string): Promise<{ highestBid: number; expiryTime: Date }> {
    try {
        const response = await axios.get(`https://api.mainnet.tensordev.io/api/v1/collections/nft_bids?mints=${nftMintAddress}`, {
            headers: {
                accept: "application/json",
                "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY,
            },
        });

        const bidData = response.data[0];
        if (!bidData || !bidData.bids || bidData.bids.length === 0) {
            return {
                highestBid: 0,
                expiryTime: new Date()
            };
        }

        return {
            highestBid: Number(bidData.bids[0].price),
            expiryTime: new Date(bidData.bids[0].expiry)
        };
    } catch (error) {
        console.error("Error fetching current bid data:", error);
        return {
            highestBid: 0,
            expiryTime: new Date()
        };
    }
}

function getTimeRemaining(currentTime: Date, endTime: Date): string {
    const timeDiff = endTime.getTime() - currentTime.getTime();

    if (timeDiff <= 0) {
        return "Ended";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days}d ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const nftMintAddress = getListAddress(request.url);

    if (!nftMintAddress) {
        return new Response("Invalid NFT mint address", { status: 400 });
    }

    try {
        // 1. Fetch NFT Data
        const nftData = await fetchNFTData(nftMintAddress);
        if (!nftData) {
            return new Response("NFT not found", { status: 404 });
        }

        // 2. Check if NFT is available for auction
        const auctionDetail = await getAuctionDetail(nftMintAddress, nftData.owner);
        if (!auctionDetail || auctionDetail.length === 0) {
            // If no auction detail exists, show NFT info without bidding option
            const payload: ActionGetResponse = {
                icon: `https://image.dripin.xyz/api/resize?url=${nftData.imageUri}&width=1080&height=1080`,
                title: `${nftData.name}`,
                description: `${nftData.compressed ? "Compressed" : "Standard"} - ${nftData.tokenStandard}`,
                label: `Not Available for Bidding`,
                disabled: true
            };
            return Response.json(payload, {
                headers: ACTIONS_CORS_HEADERS,
            });
        }

        // 3. Check auction expiry
        const currentTime = new Date();
        const auctionEndTime = new Date(auctionDetail[0].expiry_time);

        if (currentTime >= auctionEndTime) {
            // Auction has ended - show expired state
            const { highestBid } = await getCurrentBidData(nftMintAddress);
            const finalBidAmount = highestBid || auctionDetail[0].lamports;

            const payload: ActionGetResponse = {
                icon: `https://image.dripin.xyz/api/resize?url=${nftData.imageUri}&width=1080&height=1080`,
                title: `${nftData.name}`,
                description: `${nftData.compressed ? "Compressed" : "Standard"} - ${nftData.tokenStandard}`,
                label: `Auction Ended - Final Bid: ${(finalBidAmount / LAMPORTS_PER_SOL).toFixed(2)} SOL`,
                disabled: true
            };
            return Response.json(payload, {
                headers: ACTIONS_CORS_HEADERS,
            });
        }

        // 4. Auction is active - show current bid and allow new bids
        const { highestBid } = await getCurrentBidData(nftMintAddress);
        const currentBidAmount = highestBid || auctionDetail[0].lamports;
        const minNextBid = (currentBidAmount + (currentBidAmount * 0.10)) / LAMPORTS_PER_SOL;

        const timeRemaining = getTimeRemaining(currentTime, auctionEndTime);

        const payload: ActionGetResponse = {
            icon: `https://image.dripin.xyz/api/resize?url=${nftData.imageUri}&width=1080&height=1080`,
            title: `${nftData.name}`,
            description: `${nftData.compressed ? "Compressed" : "Standard"} - ${nftData.tokenStandard} - Ends in: ${timeRemaining}`,
            label: `Current Bid: ${(currentBidAmount / LAMPORTS_PER_SOL).toFixed(2)} SOL`,
            links: {
                actions: [
                    {
                        href: `${url.href}?price={price}`,
                        label: "Place bid",
                        parameters: [
                            {
                                name: "price",
                                label: `Enter bid amount (Min: ${minNextBid.toFixed(2)} SOL)`
                            }
                        ]
                    }
                ]
            }
        };

        return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS,
        });

    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        }
        return new Response("An unexpected error occurred", { status: 500 });
    }
}

export async function POST(request: Request) {
    const url = new URL(request.url);
    console.log("URL: ", request.url);
    const nftMintAddress = getListAddress(request.url);

    console.log("NFT Mint Address: ", nftMintAddress);

    try {
        // 1. Fetch NFT Data first
        const nftData = await fetchNFTData(nftMintAddress);
        if (!nftData) {
            return new Response("NFT not found", { status: 404 });
        }

        // 2. Get auction details
        const auctionDetail = await getAuctionDetail(nftMintAddress, nftData.owner);
        if (!auctionDetail || auctionDetail.length === 0) {
            return new Response("No auction found for this NFT", { status: 404 });
        }

        // 3. Get current bid data
        const { highestBid } = await getCurrentBidData(nftMintAddress);

        // 4. Determine the minimum bid amount
        const baseAmount = highestBid || auctionDetail[0].lamports;
        const minBidAmount = (baseAmount + (baseAmount * 0.10)) / LAMPORTS_PER_SOL;

        // 5. Get the requested bid amount from URL params
        const requestedAmount = Number(url.searchParams.get("price"));
        if (!requestedAmount) {
            return new Response("Bid amount not provided", { status: 400 });
        }

        // 6. Validate bid amount
        if (requestedAmount < minBidAmount) {
            return new Response(`Bid amount must be at least ${minBidAmount.toFixed(2)} SOL`, { status: 400 });
        }

        // 7. Get bidder's account
        const body: ActionPostRequest = await request.json();
        if (!body.account) {
            return new Response("Account is required", { status: 400 });
        }
        const bidAccountAddress = body.account;

        // 8. Set up connection and get blockhash
        const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!, "confirmed");
        const blockhash = await connection.getLatestBlockhash();

        // 9. Calculate platform fee
        const fee = calculateFee(requestedAmount * LAMPORTS_PER_SOL);

        // 10. Create and process the bid transaction
        const encTx = await fetchBidNFTencTx({
            owner: bidAccountAddress,
            mint: nftMintAddress,
            price: (requestedAmount * LAMPORTS_PER_SOL),
            blockhash: blockhash.blockhash
        }).then(async (data) => {
            if ('message' in data) {
                throw new Error(data.message);
            }

            if (data.txs.length === 0) {
                throw new Error("No transactions returned");
            }

            const encodedTx = data.txs[0].tx.data;
            const transactionBuffer = Buffer.from(encodedTx);
            const transaction = Transaction.from(transactionBuffer);

            // Add platform fee transfer
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(bidAccountAddress),
                    toPubkey: new PublicKey(FEE_RECIPIENT_ADDRESS),
                    lamports: fee
                })
            );

            return transaction;
        });

        // 11. Create and return response
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction: encTx,
                message: `Bid transaction created for ${requestedAmount} SOL`,
            },
        });

        return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

    } catch (error) {
        console.error("Error processing bid:", error);
        return new Response(
            error instanceof Error ? error.message : "Error creating bid transaction",
            { status: 500 }
        );
    }
}