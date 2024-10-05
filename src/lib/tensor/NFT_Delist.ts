import axios, { AxiosResponse } from "axios";

interface NFTDelistType {
    mint: string;
    owner: string;
    blockhash: string;
    feePayer?: string;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getNFTDelistType {
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

export default async function NFTDelist({
    mint,
    owner,
    blockhash,
    feePayer,
    compute,
    priorityMicroLamports
}: NFTDelistType) {
    const baseURL: string = "/api/tensor/delist";
    const params = new URLSearchParams({
        mint,
        owner,
        blockhash,
        ...(feePayer && { feePayer }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const response: AxiosResponse<getNFTDelistType> = await axios.get(`${baseURL}?${params}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}