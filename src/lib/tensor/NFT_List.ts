import axios, { AxiosResponse } from "axios";

interface NFTListType {
    mint: string;
    owner: string;
    price: number;
    blockhash: string;
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

export default async function NFTList({
    mint,
    owner,
    price,
    blockhash,
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
}: NFTListType) {
    const baseURL: string = "/api/tensor/list";
    const params = new URLSearchParams({
        mint,
        owner,
        price: price.toString(),
        blockhash,
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

        console.log("=================",response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
