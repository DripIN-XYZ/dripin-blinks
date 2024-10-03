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
        tx: string | null;
        txV0: string;
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
    const baseURL: string = "https://api.mainnet.tensordev.io/api/v1/tx/edit";
    const options = {
        method: "GET",
        url: `${baseURL}?mint=${mint}&owner=${owner}&price=${price}&blockhash=${blockhash}&expireIn=${expireIn}&feePayer=${feePayer}&compute=${compute}&priorityMicroLamports=${priorityMicroLamports}`,
        headers: {
            accept: "application/json",
            "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY
        }
    };

    try {
        const response: AxiosResponse<getEditListingsType> = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
