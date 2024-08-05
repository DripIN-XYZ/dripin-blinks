import { Helius } from "helius-sdk";
import type { DAS } from "helius-sdk";
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, clusterApiUrl, SystemProgram } from "@solana/web3.js";
import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from "@solana/actions";
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";

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
    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    return new Response("Error fetching NFT metadata", { status: 500 });
  }
}


export const OPTIONS = GET;


export async function POST(request: Request) {
  const url = new URL(request.url);
  const mintAddress = request.url.split("/").pop();
  const body: ActionPostRequest = await request.json();
  const amount = Number(url.searchParams.get("amount")) || 0.001;

  if (!mintAddress) {
    return new Response("Invalid mint address", { status: 400 });
  }

  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  let ACCOUNT_A: PublicKey;
  let ACCOUNT_B: PublicKey;

  try {
    const response: DAS.GetAssetResponse = await helius.rpc.getAsset({
      id: mintAddress,
      displayOptions: {
        showCollectionMetadata: true,
      },
    });
    ACCOUNT_A = new PublicKey(response.ownership.owner);
  } catch (error) {
    return new Response("Error fetching NFT metadata", { status: 500 });
  }

  try {
    ACCOUNT_B = new PublicKey(body.account);
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

  const nftMintAddress = new PublicKey(mintAddress);
  const paymentAmount = amount * LAMPORTS_PER_SOL;

  try {
    const transaction = new Transaction();

    const fromTokenAccount = await getAssociatedTokenAddress(
      nftMintAddress,
      ACCOUNT_A
    );
    const toTokenAccount = await getAssociatedTokenAddress(
      nftMintAddress,
      ACCOUNT_B
    );

    const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);

    if (!toTokenAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          ACCOUNT_B,
          toTokenAccount,
          ACCOUNT_B,
          nftMintAddress
        )
      );
    }

    transaction.add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        ACCOUNT_A,
        1
      )
    );

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: ACCOUNT_B,
        toPubkey: ACCOUNT_A,
        lamports: paymentAmount,
      })
    );
    const { blockhash } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = ACCOUNT_B;

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    const transactionObject = Transaction.from(serializedTransaction);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: transactionObject,
        message: "Transaction created",
      },
    });

    return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return Response.json(
      {
        error: {
          message: "Error creating transaction",
        },
      },
      {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
}
