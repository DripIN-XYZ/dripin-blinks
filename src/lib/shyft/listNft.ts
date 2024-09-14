import axios from "axios";

export const encTxListNFT = async (
    {
        nft_address,
        price,
        seller_wallet
    }: {
        nft_address: string,
        price: number,
        seller_wallet: string
    }): Promise<any> => {
    try {
        const response = await axios.post("https://api.shyft.to/sol/v1/marketplace/list",
            {
                network: "mainnet-beta",    // either of [mainnet-beta, testnet, devnet]
                nft_address: nft_address,    // on-chain address of the NFT which has to be listed for sale.
                marketplace_address: "3mycE4xdRESBX8pchRTS2UfBChQnRgCU3GKvGTeZxLVH",   // the address of the marketplace.
                price: price,   // sale price of the NFT in SOL.
                seller_wallet: seller_wallet    // wallet address of the NFT owner who wants to sell the NFT.
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
