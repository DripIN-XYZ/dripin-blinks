"use client";

import { useToast } from "@/hooks/use-toast";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo, useCallback } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import type { Adapter, WalletError } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { toast } = useToast();
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

    const onError = useCallback(
        (error: WalletError, adapter?: Adapter) => {
            toast({
                title: error.name,
                variant: "destructive",
                description: error.message,
                duration: 5000,
            })
            console.error(error, adapter);
        }, [toast]
    );

    const wallets = useMemo(
        () => [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                {children}
            </WalletProvider >
        </ConnectionProvider >
    );
}
