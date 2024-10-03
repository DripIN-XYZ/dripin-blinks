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
        tx: string | null;
        txV0: string;
        lastValidBlockHeight: number | null;
        metadata: object | null;
    }>;
    bidState: string | null;
};

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
    const baseURL: string = "https://api.mainnet.tensordev.io/api/v1/tx/edit_bid";
    const options = {
        method: "GET",
        url: `${baseURL}?bidStateAddress=${bidStateAddress}&blockhash=${blockhash}&price=${price}&quantity=${quantity}&expireIn=${expireIn}&privateTaker=${privateTaker}&useSharedEscrow=${useSharedEscrow}&compute=${compute}&priorityMicroLamports=${priorityMicroLamports}`,
        headers: {
            accept: "application/json",
            "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY
        }
    };

    try {
        const response: AxiosResponse<getEditBidType> = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
