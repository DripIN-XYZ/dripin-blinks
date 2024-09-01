"use client";

import { toast } from "sonner";
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

    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

    const onError = useCallback(
        (error: WalletError, adapter?: Adapter) => {
            toast.error(error.message ? `${error.name}: ${error.message}` : error.name);
            console.error(error, adapter);
        }, []
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
