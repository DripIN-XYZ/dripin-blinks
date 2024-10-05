import axios, { AxiosResponse } from "axios";

interface EditListingsType {
    mint: string;
    owner: string;
    price: number;
    blockhash: string;
    expireIn?: number;
    feePayer?: string;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getEditListingsType {
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

export default async function EditListings({
    mint,
    owner,
    price,
    blockhash,
    expireIn,
    feePayer,
    compute,
    priorityMicroLamports
}: EditListingsType) {
    const baseURL: string = "/api/tensor/edit";
    const params = new URLSearchParams({
        mint,
        owner,
        price: price.toString(),
        blockhash,
        ...(expireIn !== undefined && { expireIn: expireIn.toString() }),
        ...(feePayer && { feePayer }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const response: AxiosResponse<getEditListingsType> = await axios.get(`${baseURL}?${params}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}