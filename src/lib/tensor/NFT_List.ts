import axios, { AxiosResponse } from "axios";

interface NFTListType {
    mint: string;
    owner: string;
    price: number;
    blockhash: string;
    makerBroker?: string;
    payer?: string;
    feePayer?: string;
    rentPayer?: string;
    currency?: string;
    expireIn?: number;
    privateTaker?: string;
    delegateSigner?: boolean;
    compute?: number;
    priorityMicroLamports?: number;
}

export interface getNFTListType {
    txs: Array<{
        tx: string | null;
        txV0: string;
        lastValidBlockHeight: number | null;
        metadata: object | null;
    }>;
    totalCost: number | null;
}

export default async function NFTList({
    mint,
    owner,
    price,
    blockhash,
    makerBroker,
    payer,
    feePayer,
    rentPayer,
    currency,
    expireIn,
    privateTaker,
    delegateSigner,
    compute,
    priorityMicroLamports
}: NFTListType) {
    const baseURL: string = "https://api.mainnet.tensordev.io/api/v1/tx/list";
    const options = {
        method: "GET",
        url: `${baseURL}?mint=${mint}&owner=${owner}&price=${price}&blockhash=${blockhash}&makerBroker=${makerBroker}&payer=${payer}&feePayer=${feePayer}&rentPayer=${rentPayer}&currency=${currency}&expireIn=${expireIn}&privateTaker=${privateTaker}&delegateSigner=${delegateSigner}&compute=${compute}&priorityMicroLamports=${priorityMicroLamports}`,
        headers: {
            accept: "application/json",
            "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY
        }
    };

    try {
        const response: AxiosResponse<getNFTListType> = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
