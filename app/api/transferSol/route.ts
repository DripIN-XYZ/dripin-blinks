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

export async function GET(request: Request) {
    const url = new URL(request.url);
    const payload: ActionGetResponse = {
        icon: "https://pbs.twimg.com/profile_images/1809632821553819651/-ZNEJXp0_400x400.jpg", // Icon URL
        title: "Transfer to the CodeParth",
        description: "Support CodeParth by transferring SOL.",
        label: "Transfer SOL to CodeParth",
        links: {
            actions: [
                {
                    label: "Transfer 0.01 SOL",
                    href: `${url.href}?amount=0.01`,
                },
            ],
        },
    };
    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
    });
}

export const OPTIONS = GET;

export async function POST(request: Request) {
    const body: ActionPostRequest = await request.json();

    const url = new URL(request.url);

    const amount = Number(url.searchParams.get("amount")) || 0.01;

    let sender;

    try {
        sender = new PublicKey(body.account);
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

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: new PublicKey("ETVZ97k3rZv96cwp3CYpPoBC74PKkQsNQ4ex6NHx2hRx"),
            lamports: amount * LAMPORTS_PER_SOL,
        })
    );
    transaction.feePayer = sender;
    transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
    ).blockhash;
    transaction.lastValidBlockHeight = (
        await connection.getLatestBlockhash()
    ).lastValidBlockHeight;

    const payload: ActionPostResponse = await createPostResponse({
        fields: {
            transaction,
            message: "Transaction created",
        },
    });
    return new Response(JSON.stringify(payload), {
        headers: ACTIONS_CORS_HEADERS,
    });
}