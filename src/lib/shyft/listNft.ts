import axios, { AxiosResponse } from "axios";

export interface listNftType {
    success: boolean;
    message: string;
    result: Result;
}

export interface Result {
    network: string;
    marketplace_address: string;
    seller_address: string;
    price: number;
    nft_address: string;
    list_state: string;
    currency_symbol: string;
    encoded_transaction: string;
}

export default async function encTxListNFT({ nft_address, price, seller_wallet }: {
    nft_address: string,
    price: number,
    seller_wallet: string
}) {
    try {
        const response: AxiosResponse<listNftType> = await axios.post("https://api.shyft.to/sol/v1/marketplace/list",
            {
                network: "mainnet-beta",
                nft_address: nft_address,
                marketplace_address: "3mycE4xdRESBX8pchRTS2UfBChQnRgCU3GKvGTeZxLVH",
                price: price,
                seller_wallet: seller_wallet
            },
            {
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_SHYFT_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
        return response.data;
    } catch (error) {
        return console.error(error);
    }
};
