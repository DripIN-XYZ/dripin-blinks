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
        tx: string | null;
        txV0: string;
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
    const baseURL: string = "https://api.mainnet.tensordev.io/api/v1/tx/delist";
    const options = {
        method: "GET",
        url: `${baseURL}?mint=${mint}&owner=${owner}&blockhash=${blockhash}&feePayer=${feePayer}&compute=${compute}&priorityMicroLamports=${priorityMicroLamports}`,
        headers: {
            accept: "application/json",
            "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY
        }
    };

    try {
        const response: AxiosResponse<getNFTDelistType> = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
