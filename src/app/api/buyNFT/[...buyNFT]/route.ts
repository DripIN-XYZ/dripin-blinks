import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createPostResponse,
} from "@solana/actions";

import axios from "axios";
import { Connection, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";

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

interface NFTBuyType {
    buyer: string;
    mint: string;
    owner: string;
    maxPrice: number;
    blockhash: string;
    includeTotalCost?: boolean;
    payer?: string;
    feePayer?: string;
    optionalRoyaltyPct?: number;
    currency?: string;
    takerBroker?: string;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getNFTBuyType {
    txs: Array<
        {
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
        }
    >;
}


const getListAddress = (url: string): string => {
    const listAddress = url.split("/").pop();
    if (!listAddress) {
        throw new Error("Invalid list address");
    }
    return listAddress;
};

async function fetchBuyNFTencTx({
    buyer,
    mint,
    owner,
    maxPrice,
    blockhash,
    includeTotalCost,
    payer,
    feePayer,
    optionalRoyaltyPct,
    currency,
    takerBroker,
    compute,
    priorityMicroLamports
}: NFTBuyType): Promise<getNFTBuyType> {
    const params = new URLSearchParams({
        buyer,
        mint,
        owner,
        maxPrice: maxPrice.toString(),
        blockhash,
        ...(includeTotalCost !== undefined && { includeTotalCost: includeTotalCost.toString() }),
        ...(payer && { payer }),
        ...(feePayer && { feePayer }),
        ...(optionalRoyaltyPct !== undefined && { optionalRoyaltyPct: optionalRoyaltyPct.toString() }),
        ...(currency && { currency }),
        ...(takerBroker && { takerBroker }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const URL = `https://api.mainnet.tensordev.io/api/v1/tx/buy?${params}`
        console.log("++++++++ Buy NFT URL: ++++++++", URL);

        const response = await axios.get(URL, {
            headers: {
                accept: "application/json",
                "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY,
            },
        });

        console.log("++++++++ Buy NFT Data: ++++++++", response.data);
        return response.data;
    } catch (error) {
        console.error(error);
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
            throw new Error(`Error fetching NFT data: ${error.response?.data?.message || error.message}`);
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

        if (!nftData) {
            return new Response("NFT not found", { status: 404 });
        }

        if (nftData.listing.price === null) {
            payload = {
                icon: `https://image.dripin.xyz/api/resize?url=${nftData.imageUri}&width=1080&height=1080`,
                title: `${nftData.name}`,
                description: `${nftData.compressed ? "Compressed" : "Standard"} - ${nftData.tokenStandard}`,
                label: `NFT not for sale`,
            };
            return Response.json(payload, {
                headers: ACTIONS_CORS_HEADERS,
            });

        } else {
            payload = {
                icon: `https://image.dripin.xyz/api/resize?url=${nftData.imageUri}&width=1080&height=1080`,
                title: `${nftData.name}`,
                description: `${nftData.compressed ? "Compressed" : "Standard"} - ${nftData.tokenStandard}`,
                label: `Buy NFT ${parseInt(nftData.listing.price) / LAMPORTS_PER_SOL} SOL`,
                links: {
                    actions: [
                        {
                            label: `Buy NFT ${parseInt(nftData.listing.price) / LAMPORTS_PER_SOL} SOL`,
                            href: `${url.href}`,
                        },
                    ],
                },
            };
            return Response.json(payload, {
                headers: ACTIONS_CORS_HEADERS,
            });
        }
    } catch (error) {
        return new Response("Error fetching NFT metadata", { status: 500 });
    }
}

export async function POST(request: Request) {
    const nftMintAddress = getListAddress(request.url);

    const body: ActionPostRequest = await request.json();
    if (!body.account) {
        throw new Error("Account is required");
    }

    const buyerAddress = body.account;
    const nftData = await fetchNFTData(nftMintAddress);

    if (!nftData) {
        return new Response("NFT not found", { status: 404 });
    }

    const connection = new Connection(process.env.NEXT_PUBLIC_SHYFT_RPC_URL!, "confirmed");
    const blockhash = await connection.getLatestBlockhash();

    console.log("Buy NFT Data: ", buyerAddress, nftMintAddress, nftData.owner, parseInt(nftData.listing.price), blockhash.blockhash);

    try {
        const encTx = await fetchBuyNFTencTx({
            buyer: buyerAddress,
            mint: nftMintAddress,
            owner: nftData.owner,
            maxPrice: parseInt(nftData.listing.price),
            blockhash: blockhash.blockhash
        }).then(async (data) => {
            console.log("Buy NFT Data: ", data);

            const encodedTx = data.txs[0].tx.data;
            const transactionBuffer = Buffer.from(encodedTx);

            const transaction = Transaction.from(transactionBuffer);

            console.log("Buy NFT Tx: ", transaction);

            return transaction;
        });

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
