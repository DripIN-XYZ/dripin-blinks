import axios, { AxiosResponse } from "axios";

interface NFTSellType {
    seller: string;
    mint: string;
    bidAddress: string;
    minPrice: number;
    blockhash: string;
    takerBroker?: string;
    feePayer?: string;
    optionalRoyaltyPct?: number;
    currency?: string;
    delegateSigner?: boolean;
    includeProof?: boolean;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getNFTSellType {
    txs: Array<{
        tx: string | null;
        txV0: string;
        lastValidBlockHeight: number | null;
        metadata: object | null;
    }>;
    totalCost: number | null;
}

export default async function NFTSell({
    seller,
    mint,
    bidAddress,
    minPrice,
    blockhash,
    takerBroker,
    feePayer,
    optionalRoyaltyPct,
    currency,
    delegateSigner,
    includeProof,
    compute,
    priorityMicroLamports
}: NFTSellType) {
    const baseURL: string = "https://api.mainnet.tensordev.io/api/v1/tx/sell";
    const options = {
        method: "GET",
        url: `${baseURL}?seller=${seller}&mint=${mint}&bidAddress=${bidAddress}&minPrice=${minPrice}&blockhash=${blockhash}&takerBroker=${takerBroker}&feePayer=${feePayer}&optionalRoyaltyPct=${optionalRoyaltyPct}&currency=${currency}&delegateSigner=${delegateSigner}&includeProof=${includeProof}&compute=${compute}&priorityMicroLamports=${priorityMicroLamports}`,
        headers: {
            accept: "application/json",
            "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY
        }
    };

    try {
        const response: AxiosResponse<getNFTSellType> = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
