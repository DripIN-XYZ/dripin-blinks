import axios from "axios";
import { Connection, Keypair, VersionedTransaction, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createPostResponse,
} from "@solana/actions";

interface QuoteResponse {
    // Define the structure of the quote response based on the Jupiter API documentation
}

interface SwapResponse {
    swapTransaction: string;
}

async function convertUsdcToSol(usdcAmount: number, slippageBps: number) {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

    const wallet = new PublicKey("7KFerXQA71zx5nLGiqFz6mcDTWBzYAoAWXf9EkRbGx8u");
    const usdcMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC mint address
    const solMint = "So11111111111111111111111111111111111111112"; // SOL mint address

    try {
        const quoteResponse = await axios.get<QuoteResponse>(
            `https://quote-api.jup.ag/v6/quote`, {
            params: {
                inputMint: usdcMint,
                outputMint: solMint,
                amount: usdcAmount,
                slippageBps: slippageBps
            }
        }
        );

        console.log("Quote Response:", quoteResponse.data);

        const swapResponse = await axios.post<SwapResponse>(
            "https://quote-api.jup.ag/v6/swap", {
            quoteResponse: quoteResponse.data,
            userPublicKey: wallet.toString(),
            wrapAndUnwrapSol: true,
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        }
        );

        console.log("Swap Response:", swapResponse.data);

        const swapTransactionBuf = Buffer.from(swapResponse.data.swapTransaction, "base64");
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        transaction.sign([Keypair.fromSecretKey(wallet.toBuffer())]);

        const latestBlockHash = await connection.getLatestBlockhash();
        const rawTransaction = transaction.serialize();
        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
        });
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid
        });

        console.log(`Transaction successful: https://solscan.io/tx/${txid}`);
    } catch (error) {
        console.error("Error during swap:", error);
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);

        const payload: ActionGetResponse = {
            title: "Convert USDC to SOL",
            icon: new URL("/usdcToSolana.jpeg", url.origin).toString(),
            description: "Convert USDC to SOL",
            label: "Transfer",
            links: {
                actions: [
                    {
                        label: "Convert USDC to SOL",
                        href: ``,
                        parameters: [
                            {
                                name: "walletAddress",
                                label: "Wallet Address",
                                required: true,
                            },
                            {
                                name: "amountInUSDC",
                                label: "USDC",
                                required: true,
                            },
                        ],
                    },
                ],
            },
        };
        return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS,
        });
    } catch (err) {
        console.log(err);
        let message = "An unknown error occurred";
        if (typeof err == "string") message = err;
        return new Response(message, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
};


// const usdcAmount = 1000000;
// const slippageBps = 50;

// convertUsdcToSol(usdcAmount, slippageBps);