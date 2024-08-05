import { Helius } from "helius-sdk";
import type { DAS } from "helius-sdk";
import { createAssociatedTokenAccountInstruction, createTransferCheckedInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, clusterApiUrl } from "@solana/web3.js";
import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from "@solana/actions";

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
      icon: `https://image-cdn.solana.fm/images/?imageUrl=${response.content?.links?.image}`,
      title: `${response.content?.metadata?.name}`,
      description: `${response.content?.metadata?.description}`,
      label: `Transfer NFT ${response.id}`,
      links: {
        actions: [
          {
            label: "Transfer",
            href: `${url.href}?amount=0.001`,
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


import { SystemProgram } from "@solana/web3.js";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body: ActionPostRequest = await request.json();
  const mintAddress = request.url.split("/").pop();
  const amount = Number(url.searchParams.get("amount")) || 0.001;

  if (!mintAddress) {
    return new Response("Invalid mint address", { status: 400 });
  }

  let accountB; // This is the receiver of NFT and payer of SOL
  try {
    accountB = new PublicKey(body.account);
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: "Invalid account" } }), { status: 400 });
  }

  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  try {
    const mintPubkey = new PublicKey(mintAddress);

    // Get the current owner (ACCOUNT_A) of the NFT
    const nftInfo = await connection.getParsedAccountInfo(mintPubkey);
    if (!nftInfo.value || !nftInfo.value.data || typeof nftInfo.value.data !== 'object') {
      throw new Error("Failed to fetch NFT info");
    }
    const accountA = new PublicKey((nftInfo.value.data as any).parsed.info.owner);

    // Get ACCOUNT_A's Associated Token Account (ATA)
    const accountATA = await getAssociatedTokenAddress(mintPubkey, accountA);

    // Get or create ACCOUNT_B's Associated Token Account (ATA)
    const accountBATA = await getAssociatedTokenAddress(mintPubkey, accountB);

    const transaction = new Transaction();

    // Check if ACCOUNT_B's ATA exists, if not, add creation instruction
    const accountBATAInfo = await connection.getAccountInfo(accountBATA);
    if (!accountBATAInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          accountB, // payer
          accountBATA, // ata
          accountB, // owner
          mintPubkey // mint
        )
      );
    }

    // Add SOL transfer instruction (ACCOUNT_B to ACCOUNT_A)
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: accountB,
        toPubkey: accountA,
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    // Add the NFT transfer instruction
    transaction.add(
      createTransferCheckedInstruction(
        accountATA, // from (ACCOUNT_A's ATA)
        mintPubkey, // mint
        accountBATA, // to (ACCOUNT_B's ATA)
        accountA, // owner of the source account
        1, // amount (1 for NFT)
        0 // decimals (0 for NFT)
      )
    );

    transaction.feePayer = accountB; // ACCOUNT_B pays for the transaction
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "NFT transfer and SOL payment transaction created",
      },
    });
    return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS
    });
  } catch (error) {
    console.error("Error creating transfer transaction:", error);
    return new Response(JSON.stringify({ error: { message: "Error creating transfer transaction" } }), { status: 500 });
  }
}