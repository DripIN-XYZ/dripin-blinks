import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createPostResponse,
} from "@solana/actions";

import axios from "axios";
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

async function fetchOrdersOfSingleNftBidsData(nftMintAddress: string): Promise<getOrdersOfSingleNftBidsType> {
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

export async function GET(request: Request) {
    const url = new URL(request.url);
    const nftMintAddress = getListAddress(request.url);

    if (!nftMintAddress) {
        return new Response("Invalid NFT mint address", { status: 400 });
    }

    let payload: ActionGetResponse;

    try {
        const nftData: getNFTInfoType = await fetchNFTData(nftMintAddress);
        console.log("NFT Data: ", nftData);

        const ordersOfSingleNftBidsData: getOrdersOfSingleNftBidsType = await fetchOrdersOfSingleNftBidsData(nftMintAddress);
        console.log("Orders of Single NFT Bids Data: ", ordersOfSingleNftBidsData);

        if (!ordersOfSingleNftBidsData) {
            return new Response("No NFT Bids found", { status: 404 });
        }

        const expiryTimeOfAuction = ordersOfSingleNftBidsData.bids[ordersOfSingleNftBidsData.bids.length - 1].expiry
        const highestBid = ordersOfSingleNftBidsData.bids[0].price

        console.log("Expiry Time: ", expiryTimeOfAuction)
        console.log("Highest Bid: ", highestBid)

        const currentTime = new Date()

        console.log("Current Time: ", currentTime)

        if (!nftData) {
            return new Response("NFT not found", { status: 404 });
        }

        if (expiryTimeOfAuction === currentTime) {
            payload = {
                icon: `https://image.dripin.xyz/api/resize?url=${nftData.imageUri}&width=1080&height=1080`,
                title: `${nftData.name}`,
                description: `${nftData.compressed ? "Compressed" : "Standard"} - ${nftData.tokenStandard} - Bidding Ends: ${expiryTimeOfAuction}`,
                label: `Bidding End`,
                disabled: true,
            };
            return Response.json(payload, {
                headers: ACTIONS_CORS_HEADERS,
            });
        } else {
            payload = {
                icon: `https://image.dripin.xyz/api/resize?url=${nftData.imageUri}&width=1080&height=1080`,
                title: `${nftData.name}`,
                description: `${nftData.compressed ? "Compressed" : "Standard"} - ${nftData.tokenStandard} - Bidding Ends: ${expiryTimeOfAuction}`,
                label: `Buy NFT ${parseInt(nftData.listing.price) / LAMPORTS_PER_SOL} SOL`,
                links: {
                    actions: [
                        {
                            href: `${url.href}?price={price}`,
                            label: "Place bid",
                            parameters: [
                                {
                                    name: "price",
                                    label: `Enter bid amount (Min: ${((Number(highestBid) + (Number(highestBid) * 0.10)) / LAMPORTS_PER_SOL)} SOL)`
                                }
                            ]
                        }
                    ]
                }
            };
            return Response.json(payload, {
                headers: ACTIONS_CORS_HEADERS,
            });
        }
    } catch (error) {
        return new Response("Error fetching NFT metadata 1", { status: 500 });
    }
}

export async function POST(request: Request) {
    const url = new URL(request.url);
    console.log("URL: ", request.url);
    const nftMintAddress = getListAddress(request.url);

    console.log("NFT Mint Address: ", nftMintAddress);

    const ordersOfSingleNftBidsData: getOrdersOfSingleNftBidsType = await fetchOrdersOfSingleNftBidsData(nftMintAddress);

    console.log("Orders of Single NFT Bids Data: ", ordersOfSingleNftBidsData);

    if (!ordersOfSingleNftBidsData) {
        return new Response("No NFT Bids found", { status: 404 });
    }

    const expiryTimeOfAuction = ordersOfSingleNftBidsData.bids[ordersOfSingleNftBidsData.bids.length - 1].expiry
    const highestBid = ordersOfSingleNftBidsData.bids[0].price

    const currentTime = new Date()

    const amount = Number(url.searchParams.get("price"));

    if (!amount) {
        throw new Error("Bid Amount not Found")
    }

    if (amount <= ((Number(highestBid) / LAMPORTS_PER_SOL) * 0.10)) {
        throw new Error("bid to low")
    }

    const body: ActionPostRequest = await request.json();
    if (!body.account) {
        throw new Error("Account is required");
    }

    const bidAccountAddress = body.account;
    const nftData = await fetchNFTData(nftMintAddress);

    if (!nftData) {
        return new Response("NFT not found", { status: 404 });
    }

    const connection = new Connection(process.env.NEXT_PUBLIC_SHYFT_RPC_URL!, "confirmed");
    const blockhash = await connection.getLatestBlockhash();

    console.log("Bid NFT Data: ", bidAccountAddress, nftMintAddress, nftData.owner, (amount * LAMPORTS_PER_SOL), blockhash.blockhash);

    const fee = calculateFee(parseInt(nftData.listing.price));

    try {
        const encTx = await fetchBidNFTencTx({
            owner: bidAccountAddress,
            mint: nftMintAddress,
            price: (amount * LAMPORTS_PER_SOL),
            blockhash: blockhash.blockhash
        }).then(async (data) => {
            console.log("Bid NFT Data: ", data);


            if ('message' in data) {
                throw new Error(data.message);
            }

            if (data.txs.length === 0) {
                throw new Error("No transactions returned");
            }

            const encodedTx = data.txs[0].tx.data;
            console.log("Encoded Tx: ", encodedTx);
            
            const transactionBuffer = Buffer.from(encodedTx);
            console.log("Transaction Buffer: ", transactionBuffer);

            const transaction = Transaction.from(transactionBuffer);
            console.log("Transaction: ", transaction);

            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(bidAccountAddress),
                    toPubkey: new PublicKey(FEE_RECIPIENT_ADDRESS),
                    lamports: fee
                })
            );

            console.log("Transaction: ", transaction);

            return transaction;
        });

        console.log("Enc Tx: ", encTx);

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction: encTx,
                message: `Transaction created and confirmed`,
            },
        });

        return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
    } catch (error) {
        return new Response("Error to create Buy NFT Tx", { status: 500 });
    }
}
