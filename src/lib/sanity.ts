import { createClient } from "@sanity/client";

export interface walletSignInProps {
    _type: string;
    publicKey: string;
    lastEventTrigger: string;
};

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: "production",
    useCdn: true,
    apiVersion: "2022-03-07",
    perspective: "published",
    token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN
})

export async function createWalletSignIn(walletData: walletSignInProps) {
    try {
        const result = client.create(walletData);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
