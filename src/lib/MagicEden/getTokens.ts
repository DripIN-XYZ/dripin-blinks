import axios, { AxiosResponse } from "axios";

export interface getTokenType {
    mintAddress: string;
    owner: string;
    supply: number;
    collection: string;
    collectionName: string;
    name: string;
    updateAuthority: string;
    primarySaleHappened: boolean;
    sellerFeeBasisPoints: number;
    image: string;
    animationUrl?: string;
    externalUrl?: string;
    attributes: Attribute[];
    properties: Properties;
    price?: number;
    listStatus: ListStatus;
    tokenAddress?: string;
    priceInfo?: PriceInfo;
    delegate?: string;
}

export interface Attribute {
    trait_type: string;
    value: number | string;
}

export enum ListStatus {
    Listed = "listed",
    Unlisted = "unlisted",
}

export interface PriceInfo {
    solPrice: SolPrice;
}

export interface SolPrice {
    rawAmount: string;
    address: string;
    decimals: number;
}

export interface Properties {
    files?: File[];
    category?: string;
    creators?: Creator[];
    maxSupply?: number;
}

export interface Creator {
    share: number;
    address: string;
}

export interface File {
    uri: string;
    type: FileType;
}

export enum FileType {
    ImageJPEG = "image/jpeg",
    ImagePNG = "image/png",
}

export default async function getTokens(wallet_address: string) {
    try {
        const response: AxiosResponse<getTokenType[]> = await axios.request(
            {
                method: "GET",
                url: `https://api-mainnet.magiceden.dev/v2/wallets/${wallet_address}/tokens`,
                headers: {
                    accept: "application/json",
                    // authorization: `Bearer ${process.env.MAGIC_EDEN_API_KEY}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
