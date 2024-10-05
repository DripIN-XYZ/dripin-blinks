import axios, { AxiosResponse } from "axios";

interface CancelBidType {
    bidStateAddress: string;
    blockhash: string;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getCancelBidType {
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

export default async function CancelBid({
    bidStateAddress,
    blockhash,
    compute,
    priorityMicroLamports
}: CancelBidType) {
    const baseURL: string = "/api/tensor/edit_bid";
    const params = new URLSearchParams({
        bidStateAddress,
        blockhash,
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const response: AxiosResponse<getCancelBidType> = await axios.get(`${baseURL}?${params}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}