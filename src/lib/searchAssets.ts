interface Tokens {
    items: any[];
}

const tokenType: "fungible" | "nonFungible" | "compressedNft" | "regularNft" = "regularNft";

const fetchTokens = async (walletAddress: string): Promise<Tokens> => {
    const url = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}` || "https://mainnet.helius-rpc.com";
    console.log(
        `Starting search for tokens for wallet address: ${walletAddress}`
    );
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: "my-id",
                method: "searchAssets",
                params: {
                    ownerAddress: walletAddress,
                    tokenType: tokenType,
                    displayOptions: {
                        showCollectionMetadata: true,
                    },
                },
            }),
        });
        const data = await response.json();
        console.log(
            `Data returned for wallet address ${walletAddress}:`,
            data.result
        );
        return { items: data.result };
    } catch (error) {
        console.error("Error fetching tokens:", error);
        return { items: [] };
    }
};

export default fetchTokens;
