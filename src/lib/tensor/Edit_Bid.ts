import axios, { AxiosResponse } from "axios";

interface EditBidType {
    bidStateAddress: string;
    blockhash: string;
    price?: number;
    quantity?: number;
    expireIn?: number;
    privateTaker?: string;
    useSharedEscrow?: boolean;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getEditBidType {
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

export default async function EditBid({
    bidStateAddress,
    blockhash,
    price,
    quantity,
    expireIn,
    privateTaker,
    useSharedEscrow,
    compute,
    priorityMicroLamports
}: EditBidType) {
    const baseURL: string = "/api/tensor/edit_bid";
    const params = new URLSearchParams({
        bidStateAddress,
        blockhash,
        ...(price !== undefined && { price: price.toString() }),
        ...(quantity !== undefined && { quantity: quantity.toString() }),
        ...(expireIn !== undefined && { expireIn: expireIn.toString() }),
        ...(privateTaker && { privateTaker }),
        ...(useSharedEscrow !== undefined && { useSharedEscrow: useSharedEscrow.toString() }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const response: AxiosResponse<getEditBidType> = await axios.get(`${baseURL}?${params}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}