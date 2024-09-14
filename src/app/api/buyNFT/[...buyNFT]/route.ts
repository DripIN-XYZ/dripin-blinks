import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createPostResponse,
} from "@solana/actions";

import {
    Connection,
    PublicKey,
    Transaction,
} from "@solana/web3.js";
import axios from "axios";

const marketplace_address = "3mycE4xdRESBX8pchRTS2UfBChQnRgCU3GKvGTeZxLVH";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const listAddress = request.url.split("/").pop();

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
            icon: `https://image.dripin.xyz/api/resize?url=${response.data.result.nft.image_uri}&width=512`,
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

export async function POST(request: Request) {
    const url = new URL(request.url);
    const listAddress = request.url.split("/").pop();
    const body: ActionPostRequest = await request.json();

    let buyerAddress;

    try {
        buyerAddress = new PublicKey(body.account);

        const nftData = await axios.get(`https://api.shyft.to/sol/v1/marketplace/list_details?network=mainnet-beta&marketplace_address=${marketplace_address}&list_state=${listAddress}`, {
            headers: {
                'x-api-key': process.env.NEXT_PUBLIC_SHYFT_API_KEY
            }
        });

        const response = await axios.post("https://api.shyft.to/sol/v1/marketplace/list",
            {
                network: "mainnet-beta",
                nft_address: nftData.data.result.list_state,
                marketplace_address: nftData.data.result.marketplace_address,
                price: nftData.data.result.price,
                seller_address: nftData.data.result.seller_wallet,
                buyer_wallet: buyerAddress,
            },
            {
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_SHYFT_API_KEY,
                    'Content-Type': 'application/json'
                }
            });

        const encTx = response.data.result.encoded_transaction;

        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const encodedTransaction = encTx;
        const transaction = Transaction.from(Buffer.from(encodedTransaction, 'base64'));

        const signature = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: true,
        });

        await connection.confirmTransaction(signature, 'singleGossip');

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: "Transaction created",
            },
        });
        return new Response(JSON.stringify(payload), {
            headers: ACTIONS_CORS_HEADERS,
        });
    } catch (error) {
        return Response.json(
            {
                error: {
                    message: "Invalid account",
                },
            },
            {
                status: 400,
                headers: ACTIONS_CORS_HEADERS,
            }
        );
    }

}