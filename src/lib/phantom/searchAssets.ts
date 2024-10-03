import axios, { AxiosResponse } from "axios";

export interface getSearchAssetsType {
    collectibles: Collectible[] | [];
    isTrimmed: boolean;
}

export interface Collectible {
    id: string;
    chain: Chain;
    name: string;
    symbol?: string;
    externalUrl?: string;
    collection: Collection;
    media: Media;
    attributes: Attribute[];
    balance: string;
    decimals: string;
    owner: string;
    chainData: ChainData;
    tokenCount: number;
    description?: string;
    lastSalePrice?: Price;
}

export interface Attribute {
    trait_type: string;
    value: string;
    display_type?: string;
}

export interface Chain {
    id: ID;
    name: ChainName;
    symbol: Symbol;
    imageUrl: string;
}

export enum ID {
    Solana101 = "solana:101",
}

export enum ChainName {
    Solana = "Solana",
}

export enum Symbol {
    Sol = "SOL",
}

export interface ChainData {
    balance: string;
    decimals: string;
    mint: string;
    tokenAccount: string;
    standard: Standard;
    compression?: Compression;
    isFrozen: boolean;
    programId: string;
    mintExtensions: any[];
}

export interface Compression {
    compressed: boolean;
    merkleTree: string;
    leafIndex: number;
}

export enum Standard {
    NonFungible = "NonFungible",
    NonFungibleEdition = "NonFungibleEdition",
}

export interface Collection {
    id: string;
    isValidCollectionId: boolean;
    name: string;
    imageUrl: string;
    isSpam: boolean;
    spamStatus: SpamStatus;
    ownerCount: number;
    totalCount: number;
    tokenCount: number;
    marketplaces: Marketplace[];
    description?: string;
    externalUrl?: string;
    floorPrice?: Price;
}

export interface Price {
    price: number;
    token: Token;
}

export interface Token {
    name: ChainName;
    symbol: Symbol;
    decimals: number;
}

export interface Marketplace {
    name: MarketplaceName;
    url: string;
    isVerified: boolean;
}

export enum MarketplaceName {
    MagicEden = "Magic Eden",
    Tensor = "Tensor",
}

export enum SpamStatus {
    NotVerified = "NOT_VERIFIED",
    PossibleSpam = "POSSIBLE_SPAM",
    Verified = "VERIFIED",
}

export interface Media {
    type: Type;
    image?: Image;
    previews: Previews;
    video?: Audio;
    audio?: Audio;
}

export interface Audio {
    url: string;
}

export interface Image {
    url: string;
    previews: Previews;
}

export interface Previews {
    small: string;
    medium: string;
    large: string;
    blurhash: string;
}

export enum Type {
    Audio = "audio",
    Image = "image",
    Video = "video",
}

export default async function searchAssets(wallet_address: string) {
    try {
        const response: AxiosResponse<getSearchAssetsType> = await axios.post("https://api.phantom.app/collectibles/v1", {
            "addresses": [
                {
                    "chainId": "solana:101",
                    "address": `${wallet_address}`
                }
            ]
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
