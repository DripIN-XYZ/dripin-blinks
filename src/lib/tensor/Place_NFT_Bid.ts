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
        tx: string | null;
        txV0: string;
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
    const baseURL: string = "https://api.mainnet.tensordev.io/api/v1/tx/bid";
    const options = {
        method: "GET",
        url: `${baseURL}?owner=${owner}&price=${price}&mint=${mint}&blockhash=${blockhash}&makerBroker=${makerBroker}&useSharedEscrow=${useSharedEscrow}&rentPayer=${rentPayer}&expireIn=${expireIn}&compute=${compute}&priorityMicroLamports=${priorityMicroLamports}`,
        headers: {
            accept: "application/json",
            "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY
        }
    };

    try {
        const response: AxiosResponse<getPlaceNFTBidType> = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
