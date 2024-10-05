import axios, { AxiosResponse } from "axios";

interface PlaceNFTBidType {
    owner: string;
    price: number;
    mint: string;
    blockhash: string;
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

export default async function PlaceNFTBid({
    owner,
    price,
    mint,
    blockhash,
    makerBroker,
    useSharedEscrow,
    rentPayer,
    expireIn,
    compute,
    priorityMicroLamports
}: PlaceNFTBidType) {
    const baseURL: string = "/api/tensor/bid";
    const params = new URLSearchParams({
        owner,
        price: price.toString(),
        mint,
        blockhash,
        ...(makerBroker && { makerBroker }),
        ...(useSharedEscrow !== undefined && { useSharedEscrow: useSharedEscrow.toString() }),
        ...(rentPayer && { rentPayer }),
        ...(expireIn && { expireIn: expireIn.toString() }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const response: AxiosResponse<getPlaceNFTBidType> = await axios.get(`${baseURL}?${params}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}