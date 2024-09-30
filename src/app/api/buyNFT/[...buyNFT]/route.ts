import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createPostResponse,
} from "@solana/actions";

import {
    Transaction,
} from "@solana/web3.js";
import axios from "axios";

import { buyNftType } from "@/types/buyNftType";
import { listDetailsType } from "@/types/list_detailsType";

const MARKETPLACE_ADDRESS = "3mycE4xdRESBX8pchRTS2UfBChQnRgCU3GKvGTeZxLVH";
const SHYFT_API_KEY = process.env.NEXT_PUBLIC_SHYFT_API_KEY;

if (!SHYFT_API_KEY) {
    throw new Error("NEXT_PUBLIC_SHYFT_API_KEY is not set in the environment variables");
}

const getListAddress = (url: string): string => {
    const listAddress = url.split("/").pop();
    if (!listAddress) {
        throw new Error("Invalid list address");
    }
    return listAddress;
};

const fetchNFTData = async (listAddress: string): Promise<listDetailsType> => {
    try {
        const response = await axios.get(`https://api.shyft.to/sol/v1/marketplace/list_details`, {
            params: {
                network: "mainnet-beta",
                marketplace_address: MARKETPLACE_ADDRESS,
                list_state: listAddress
            },
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Error fetching NFT data: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
};

const buyMarketplaceListing = async (nftData: listDetailsType, buyerAddress: string): Promise<buyNftType> => {
    try {
        const response = await axios.post("https://api.shyft.to/sol/v1/marketplace/buy",
            {
                network: nftData.result.network,
                nft_address: nftData.result.nft_address,
                marketplace_address: nftData.result.marketplace_address,
                price: nftData.result.price,
                seller_address: nftData.result.seller_address,
                buyer_wallet: buyerAddress.toString(),
            },
            {
                headers: {
                    'x-api-key': SHYFT_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.data.result?.encoded_transaction) {
            throw new Error("Encoded transaction not found in API response");
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Error for creating buying encTx: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
};

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const listAddress = getListAddress(request.url);
        const nftData = await fetchNFTData(listAddress);

        let payload: ActionGetResponse;

        const soldNft: boolean = nftData.result.purchase_receipt !== null || nftData.result.purchase_receipt !== undefined;

        if (!soldNft) {
            payload = {
                icon: `https://image.dripin.xyz/api/resize?url=${nftData.result.nft.image_uri}&width=512&height=512`,
                title: nftData.result.nft.name,
                description: nftData.result.nft.description,
                label: "Sold NFT",
                disabled: true
            };
        } else {
            payload = {
                icon: `https://image.dripin.xyz/api/resize?url=${nftData.result.nft.image_uri}&width=512&height=512`,
                title: nftData.result.nft.name,
                description: nftData.result.nft.description,
                label: `Buy NFT ${nftData.result.nft_address}`,
                links: {
                    actions: [
                        {
                            label: `Buy NFT ${nftData.result.price}`,
                            href: url.href,
                        },
                    ],
                },
            };
        }

        return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
    } catch (error) {
        console.error("GET Error:", error);
        return Response.json(
            { error: { message: error instanceof Error ? error.message : "An unknown error occurred" } },
            { status: 500, headers: ACTIONS_CORS_HEADERS }
        );
    }
}

export async function POST(request: Request) {
    try {
        const listAddress = getListAddress(request.url);
        const body: ActionPostRequest = await request.json();

        if (!body.account) {
            throw new Error("Account is required");
        }

        const buyerAddress = body.account;
        const nftData = await fetchNFTData(listAddress);

        const encTx = await buyMarketplaceListing(nftData, buyerAddress);

        const transaction = Transaction.from(Buffer.from(encTx.result.encoded_transaction, 'base64'));

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction: transaction,
                message: `Transaction created and confirmed`,
            },
        });

        return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
    } catch (error) {
        console.error("POST Error:", error);
        return Response.json(
            { error: { message: error instanceof Error ? error.message : "An unknown error occurred" } },
            { status: 400, headers: ACTIONS_CORS_HEADERS }
        );
    }
}
