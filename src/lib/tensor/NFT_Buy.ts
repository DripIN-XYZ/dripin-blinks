import axios, { AxiosResponse } from "axios";
import { promises } from "dns";

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
    txs: [
        {
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
        }
    ];
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
}: NFTBuyType): Promise<getNFTBuyType> {
    const baseURL: string = "/api/tensor/buy";
    const params = new URLSearchParams({
        buyer,
        mint,
        owner,
        maxPrice: maxPrice.toString(),
        blockhash,
        ...(includeTotalCost !== undefined && { includeTotalCost: includeTotalCost.toString() }),
        ...(payer && { payer }),
        ...(feePayer && { feePayer }),
        ...(optionalRoyaltyPct !== undefined && { optionalRoyaltyPct: optionalRoyaltyPct.toString() }),
        ...(currency && { currency }),
        ...(takerBroker && { takerBroker }),
        ...(compute && { compute: compute.toString() }),
        ...(priorityMicroLamports && { priorityMicroLamports: priorityMicroLamports.toString() })
    });

    try {
        const response = await axios.get(`${baseURL}?${params}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}