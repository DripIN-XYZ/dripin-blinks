import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createPostResponse,
} from "@solana/actions";

import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    clusterApiUrl,
} from "@solana/web3.js";
import axios from "axios";


export async function GET(request: Request) {
    const url = new URL(request.url);
    const listAddress = request.url.split("/").pop();
    const marketplace_address = "3mycE4xdRESBX8pchRTS2UfBChQnRgCU3GKvGTeZxLVH"

    if (!listAddress) {
        return new Response("Invalid list address", { status: 400 });
    }



    try {
        const response = await axios.get(`https://api.shyft.to/sol/v1/marketplace/list_details?network=mainnet-beta&marketplace_address=${marketplace_address}&list_state=${listAddress}`, {
            headers: {
                'x-api-key': process.env.NEXT_PUBLIC_SHYFT_API_KEY
            }
        });

        const payload: ActionGetResponse = {
            icon: `${response.data.result.nft.image_uri}`,
            title: `${response.data.result.nft.name}`,
            description: `${response.data.result.nft.description}`,
            label: `Buy NFT ${response.data.result.nft_address}`,
            links: {
                actions: [
                    {
                        label: `Buy NFT ${response.data.result.price}`,
                        href: `${url.href}`,
                    },
                ],
            },
        };
        return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS,
        });
    } catch (error) {
        return new Response("Error fetching NFT metadata", { status: 500 });
    }
};
