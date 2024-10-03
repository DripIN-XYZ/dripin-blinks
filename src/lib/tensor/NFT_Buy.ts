import axios, { AxiosResponse } from "axios";

interface NFTBuyType {
    buyer: string;
    mint: string;
    owner: string;
    maxPrice: number;
    blockhash: string;
    includeTotalCost?: boolean;
    payer?: string;
    feePayer?: string;
    optionalRoyaltyPct?: number;
    currency?: string;
    takerBroker?: string;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getNFTBuyType {
    txs: Array<{
        tx: string | null;
        txV0: string;
        lastValidBlockHeight: number | null;
        metadata: object | null;
    }>;
    totalCost: number | null;
}

export default async function NFTBuy({
    buyer,
    mint,
    owner,
    maxPrice,
    blockhash,
    includeTotalCost,
    payer,
    feePayer,
    optionalRoyaltyPct,
    currency,
    takerBroker,
    compute,
    priorityMicroLamports
}: NFTBuyType) {
    const baseURL: string = "https://api.mainnet.tensordev.io/api/v1/tx/buy";
    const options = {
        method: "GET",
        url: `${baseURL}?buyer=${buyer}&mint=${mint}&owner=${owner}&maxPrice=${maxPrice}&blockhash=${blockhash}&includeTotalCost=${includeTotalCost}&payer=${payer}&feePayer=${feePayer}&optionalRoyaltyPct=${optionalRoyaltyPct}&currency=${currency}&takerBroker=${takerBroker}&compute=${compute}&priorityMicroLamports=${priorityMicroLamports}`,
        headers: {
            accept: "application/json",
            "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY
        }
    };

    try {
        const response: AxiosResponse<getNFTBuyType> = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
