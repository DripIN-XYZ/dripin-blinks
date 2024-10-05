import axios, { AxiosResponse } from "axios";
import { Connection, Transaction } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

interface NFTListType {
    mint: string;
    owner: string;
    price: number;
    makerBroker?: string;
    payer?: string;
    feePayer?: string;
    rentPayer?: string;
    currency?: string;
    expireIn?: number;
    privateTaker?: string;
    delegateSigner?: boolean;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getNFTListType {
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
    totalCost: number | null;
}

export default async function NFTList(
    wallet: WalletContextState,
    {
        mint,
        owner,
        price,
        makerBroker,
        payer,
        feePayer,
        rentPayer,
        currency,
        expireIn,
        privateTaker,
        delegateSigner,
        compute,
        priorityMicroLamports
    }: NFTListType): Promise<Transaction> {
    const baseURL: string = "/api/tensor/list";

    const connection = new Connection(process.env.NEXT_PUBLIC_SHYFT_RPC_URL!, "confirmed");
    const blockhash = await connection.getLatestBlockhash();

    const params = new URLSearchParams({
        mint,
        owner,
        price: price.toString(),
        blockhash: blockhash.blockhash,
        ...(makerBroker && { makerBroker }),
        ...(payer && { payer }),
        ...(feePayer && { feePayer }),
        ...(rentPayer && { rentPayer }),
        ...(currency && { currency }),
        ...(expireIn && { expireIn: expireIn.toString() }),
        ...(privateTaker && { privateTaker }),
        ...(delegateSigner !== undefined && { delegateSigner: delegateSigner.toString() }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const response: AxiosResponse<getNFTListType> = await axios.get(`${baseURL}?${params}`);

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
