import axios, { AxiosResponse } from "axios";
import { Connection, Transaction } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

interface PlaceNFTBidType {
    owner: string;
    price: number;
    mint: string;
    makerBroker?: string;
    useSharedEscrow?: boolean;
    rentPayer?: string;
    expireIn?: number;
    compute?: number;
    priorityMicroLamports?: number;
}

interface Option1 {
    message: string;
}

interface BidState {
    txs: Array<{
        tx: {
            type: string;
            data: Uint8Array;
        };
        txV0: {
            type: string;
            data: Uint8Array;
        };
        lastValidBlockHeight: number | null;
        metadata: object | null;
    }>;
    bidState: string | null;
}

export type getPlaceNFTBidType = Option1 | BidState;

export default async function PlaceNFTBid(
    wallet: WalletContextState,
    {
        owner,
        price,
        mint,
        makerBroker,
        useSharedEscrow,
        rentPayer,
        expireIn,
        compute,
        priorityMicroLamports
    }: PlaceNFTBidType): Promise<Transaction> {
    const baseURL: string = "/api/tensor/bid";

    const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!, "confirmed");
    const blockhash = await connection.getLatestBlockhash();

    const params = new URLSearchParams({
        owner,
        price: price.toString(),
        mint,
        blockhash: blockhash.blockhash,
        ...(makerBroker && { makerBroker }),
        ...(useSharedEscrow !== undefined && { useSharedEscrow: useSharedEscrow.toString() }),
        ...(rentPayer && { rentPayer }),
        ...(expireIn && { expireIn: expireIn.toString() }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const response: AxiosResponse<getPlaceNFTBidType> = await axios.get(`${baseURL}?${params}`);
        if ('message' in response.data) {
            throw new Error(response.data.message);
        }

        if (response.data.txs.length === 0) {
            throw new Error("No transactions returned");
        }

        const transactionBuffer = Buffer.from(response.data.txs[0].tx.data);
        const transaction = Transaction.from(transactionBuffer);

        if (!wallet.signTransaction) {
            throw new Error("Wallet does not support transaction signing");
        }

        const signedTransaction = await wallet.signTransaction(transaction);

        return signedTransaction;
    } catch (error) {
        console.error(error);
        throw error;
    }
}