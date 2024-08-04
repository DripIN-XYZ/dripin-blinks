import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createPostResponse,
} from "@solana/actions";
import { Helius } from "helius-sdk";
import type { DAS } from "helius-sdk";

const helius = new Helius(process.env.HELIUS_API_KEY!);

export async function GET(request: Request) {
    const url = new URL(request.url);
    const mintAddress = request.url.split("/").pop();

    if (!mintAddress) {
        return new Response("Invalid mint address", { status: 400 });
    }

    try {
        const response: DAS.GetAssetResponse = await helius.rpc.getAsset({
            id: mintAddress,
            displayOptions: {
                showCollectionMetadata: true,
            },
        });

        const payload: ActionGetResponse = {
            icon: `${response.content?.links?.image}`,
            title: `${response.content?.metadata?.name}`,
            description: `${response.content?.metadata?.description}`,
            label: `Transfer NFT ${response.id}`,
            links: {
                actions: [
                    {
                        label: "Transfer",
                        href: `${url}`,
                    },
                ],
            },
        };
        return new Response(JSON.stringify(payload), {
            headers: ACTIONS_CORS_HEADERS
        });
    } catch (error) {
        return new Response("Error fetching NFT metadata", { status: 500 });
    }
}


export const OPTIONS = GET;


export async function POST(request: Request) { }
