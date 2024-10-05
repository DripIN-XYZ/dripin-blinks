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
    const baseURL: string = "/api/tensor/sell";
    const params = new URLSearchParams({
        seller,
        mint,
        bidAddress,
        minPrice: minPrice.toString(),
        blockhash,
        ...(takerBroker && { takerBroker }),
        ...(feePayer && { feePayer }),
        ...(optionalRoyaltyPct !== undefined && { optionalRoyaltyPct: optionalRoyaltyPct.toString() }),
        ...(currency && { currency }),
        ...(delegateSigner !== undefined && { delegateSigner: delegateSigner.toString() }),
        ...(includeProof !== undefined && { includeProof: includeProof.toString() }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const response: AxiosResponse<getNFTSellType> = await axios.get(`${baseURL}?${params}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}