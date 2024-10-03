import axios, { AxiosResponse } from "axios";

interface CancelBidType {
    bidStateAddress: string;
    blockhash: string;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getCancelBidType {
    txs: Array<{
        tx: string | null;
        txV0: string;
        lastValidBlockHeight: number | null;
        metadata: object | null;
    }>;
    bidState: string | null;
};

export default async function CancelBid({
    bidStateAddress,
    blockhash,
    compute,
    priorityMicroLamports
}: CancelBidType) {
    const baseURL: string = "https://api.mainnet.tensordev.io/api/v1/tx/edit_bid";
    const options = {
        method: "GET",
        url: `${baseURL}?bidStateAddress=${bidStateAddress}&blockhash=${blockhash}&compute=${compute}&priorityMicroLamports=${priorityMicroLamports}`,
        headers: {
            accept: "application/json",
            "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY
        }
    };

    try {
        const response: AxiosResponse<getCancelBidType> = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
