"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loading03Icon } from "hugeicons-react";
import { processWalletSignin } from "@/lib/supabase/walletSign";
import { useWallet } from "@solana/wallet-adapter-react";
import type { StandardWalletAdapter } from "@solana/wallet-adapter-base";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


interface selectedWalletTypes {
    adapter: StandardWalletAdapter;
}

export default function ConnectWallet() {
    const [open, setOpen] = useState(false);
    const [selectedWalletOpen, setSelectedWalletOpen] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<selectedWalletTypes | undefined>();
    const { select, wallets, publicKey, disconnect, connecting, signIn, signMessage } = useWallet();

    async function signAndSend() {
        if (!publicKey) {
            return;
        }

        const signInMessage = `
Welcome to DripIn

The genesis for simplifying NFT trading

By signing this message you agree to the
teams and conditions

Date: 
${new Date().toISOString()}

publicKey: 
${publicKey?.toBase58()}
`;

        const message = new TextEncoder().encode(signInMessage);
        try {
            const signature = await signMessage?.(message);
            console.log(signature, publicKey);
            if (!signature) {
                disconnect();
                return;
            }
            const signIn = await processWalletSignin(publicKey.toString(), "create_or_update");
            console.log(signIn);
        } catch (error) {
            disconnect();
            console.error(error);
        }
    }

    useEffect(() => {
        signAndSend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicKey])

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={
                    (isOpen) => {
                        setOpen(isOpen);
                    }
                }
            >
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-base font-Andvari">
                        {connecting ? (
                            <span className="flex gap-2 items-center">
                                <Loading03Icon className="w-6 h-6 animate-spin" />
                                Connecting...
                            </span>
                        ) :
                            !publicKey ? "Connect Wallet" : (publicKey?.toBase58().slice(0, 4) + ".." + publicKey?.toBase58().slice(-4))
                        }
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-Andvari">Connect Your Wallet</DialogTitle>
                        <div className="w-full">
                            {
                                !publicKey ? (
                                    <div className="pt-2 w-full">
                                        {wallets.filter((wallet) => wallet.readyState === "Installed").length > 0 ? (
                                            <div className="grid grid-cols-4 gap-4">
                                                {wallets.filter((wallet) => wallet.readyState === "Installed").map((wallet) => (
                                                    <Button
                                                        variant="secondary"
                                                        key={wallet.adapter.name}
                                                        onClick={() => {
                                                            select(wallet.adapter.name);
                                                            setSelectedWallet({ adapter: wallet.adapter as StandardWalletAdapter });
                                                            setSelectedWalletOpen(true);
                                                            setOpen(false);
                                                        }}
                                                        className="flex flex-col w-full h-full aspect-square gap-2 items-center justify-center border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800"
                                                    >
                                                        <Image
                                                            src={wallet.adapter.icon}
                                                            alt={wallet.adapter.name}
                                                            width={96}
                                                            height={96}
                                                            className="w-10 h-10"
                                                        />
                                                        <p>{wallet.adapter.name}</p>
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="pt-2 w-full flex flex-col gap-2 justify-between items-center">
                                                <DialogDescription className="p-4 pt-0">
                                                    No Wallet found
                                                </DialogDescription>
                                                <Button className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-base font-Andvari" onClick={() => (window.open("https://phantom.app/", "_blank"))}>
                                                    Download Phantom Wallet
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col gap-4 justify-between items-center">
                                        <DialogDescription>
                                            Connected to {publicKey.toBase58()}
                                        </DialogDescription>
                                        <Button className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-base font-Andvari" onClick={disconnect}>
                                            Disconnect
                                        </Button>
                                    </div>
                                )
                            }
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog >
            {connecting ? (
                <Dialog
                    open={selectedWalletOpen}
                    onOpenChange={
                        (isSelectedWalletOpen) => {
                            setSelectedWalletOpen(isSelectedWalletOpen);
                        }
                    }
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-4 font-Andvari">
                                <Loading03Icon className="w-8 h-8 animate-spin" />
                                Connecting {selectedWallet?.adapter.name}
                            </DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 w-full items-center justify-center">
                            <Image
                                src={selectedWallet?.adapter.icon || ""}
                                alt={selectedWallet?.adapter.name || ""}
                                width={256}
                                height={256}
                                className="w-24 h-w-24"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            ) : null}
        </>
    );
}
