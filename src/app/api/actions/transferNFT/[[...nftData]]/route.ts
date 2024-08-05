import { Helius } from "helius-sdk";
import type { DAS } from "helius-sdk";
import { createTransferCheckedInstruction } from "@solana/spl-token";
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


export async function POST(request: Request) {
  const url = new URL(request.url);
  const body: ActionPostRequest = await request.json();
  const mintAddress = request.url.split("/").pop();
  const amount = Number(url.searchParams.get("amount")) || 0.001;

  let privousNftOwner;
  let receiverAddress;

  if (!mintAddress) {
    return new Response("Invalid mint address", { status: 400 });
  }

  try {
    receiverAddress = new PublicKey(body.account);
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: "Invalid account" } }), { status: 400 });
  }

  try {
    const response: DAS.GetAssetResponse = await helius.rpc.getAsset({
      id: mintAddress,
      displayOptions: {
        showCollectionMetadata: true,
      },
    });
    privousNftOwner = new PublicKey(response.ownership.owner);
  } catch (error) {
    return new Response("Error fetching NFT metadata", { status: 500 });
  }

  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  const transaction = new Transaction().add(
    createTransferCheckedInstruction(
      privousNftOwner,
      new PublicKey(mintAddress),
      receiverAddress,
      privousNftOwner,
      amount * LAMPORTS_PER_SOL,
      9,
      [privousNftOwner, receiverAddress],
    )
  );

  transaction.feePayer = privousNftOwner;
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
    headers: ACTIONS_CORS_HEADERS
  });
}
