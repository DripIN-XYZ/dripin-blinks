import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
    const payload: ActionsJson = {
        rules: [
            {
                pathPattern: "/",
                apiPath: "/api/transferSol/",
            },
            {
                pathPattern: "/",
                apiPath: "/api/buyNFT/**",
            },
            {
                pathPattern: "/",
                apiPath: "/api/bidNFT/**",
            },
        ],
    };

    return new Response(JSON.stringify(payload), {
        headers: ACTIONS_CORS_HEADERS,
    });
};

export const OPTIONS = GET;