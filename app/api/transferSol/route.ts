import bs58 from "bs58";
import { PublicKey, Keypair, Connection, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

export async function transferSol(request: Request) {
    try {
        const { sender, receiver, solAmmount } = await request.json();

        if (!sender || !receiver || !solAmmount) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "content-type": "application/json" } });
        }

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: Keypair.fromSecretKey(bs58.decode(sender)).publicKey,
                toPubkey: new PublicKey(receiver),
                lamports: LAMPORTS_PER_SOL * solAmmount,
            })
        );

        const signature = await sendAndConfirmTransaction(connection, transaction, [Keypair.fromSecretKey(bs58.decode(sender))]);

        return new Response(JSON.stringify({ signature }), { headers: { "content-type": "application/json" } });
    } catch (error) {
        console.error("Error processing transaction:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "content-type": "application/json" } });
    }
}
