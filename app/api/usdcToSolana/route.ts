import { Connection, Keypair, VersionedTransaction, PublicKey, clusterApiUrl } from "@solana/web3.js";
import axios from "axios";
import { Wallet } from "@project-serum/anchor";
import bs58 from "bs58";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode("your_base58_encoded_private_key")));


const usdcMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC mint address
const solMint = "So11111111111111111111111111111111111111112"; // SOL mint address

interface QuoteResponse {
    // Define the structure of the quote response based on the Jupiter API documentation
}

interface SwapResponse {
    swapTransaction: string;
}

async function convertUsdcToSol(usdcAmount: number, slippageBps: number) {
    try {
        // Get a quote for swapping USDC to SOL
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

        // Get serialized transaction for the swap
        const swapResponse = await axios.post<SwapResponse>(
            "https://quote-api.jup.ag/v6/swap", {
            quoteResponse: quoteResponse.data,
            userPublicKey: wallet.publicKey.toString(),
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

        // Sign the transaction
        transaction.sign([wallet.payer]);

        // Send the transaction
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

const usdcAmount = 1000000;
const slippageBps = 50;

convertUsdcToSol(usdcAmount, slippageBps);