"use client";

import React from "react";
import Image from "next/image";
import { create } from "zustand";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loading03Icon } from "hugeicons-react";
import { processWalletSignin } from "@/lib/supabase/walletSign";
import { useWallet } from "@solana/wallet-adapter-react";
import type { StandardWalletAdapter } from "@solana/wallet-adapter-base";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface WalletSignInState {
    walletSignIn: boolean;
    setwalletSignIn: (walletSignIn: boolean) => void;
}

const useWalletSignInState = create<WalletSignInState>((set) => ({
    walletSignIn: false,
    setwalletSignIn: (walletSignIn) => set({ walletSignIn })
}));

interface selectedWalletTypes {
    adapter: StandardWalletAdapter;
}

export default function ConnectWallet() {
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(true);
    const { walletSignIn, setwalletSignIn } = useWalletSignInState();
    const [selectedWalletOpen, setSelectedWalletOpen] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<selectedWalletTypes | undefined>();
    const { select, wallets, publicKey, disconnect, connected, connecting, disconnecting, signMessage } = useWallet();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function signAndSend(walllet_address: string): Promise<void> {
        const signInMessage = `
Welcome to DripIn

The genesis for simplifying NFT trading

By signing this message you agree to the
teams and conditions

publicKey: 
${walllet_address}`;

        const message = new TextEncoder().encode(signInMessage);
        try {
            const signature = await signMessage?.(message);
            console.log(signature, publicKey);
            if (!signature) {
                setwalletSignIn(false);
                setOpenSignIn(true);
                disconnect();
                return;
            } else {
                const signIn = await processWalletSignin(walllet_address, "create_or_update");
                setwalletSignIn(true);
                setOpenSignIn(false);
                console.log(signIn);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        } catch (error) {
            setwalletSignIn(false);
            setOpenSignIn(true);
            disconnect();
            console.error(error);
        }
    }

    useEffect(() => {
        const handleSignAndSend = async () => {
            if (!publicKey) {
                return;
            }
            if (walletSignIn) {
                setOpenSignIn(false);
                return;
            }
            if (disconnecting) {
                return;
            }
            if (!walletSignIn) {
                await signAndSend(publicKey.toBase58());
            }
        };

        handleSignAndSend();
    }, [publicKey, disconnecting, signAndSend, walletSignIn]);

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
                                        <Button
                                            onClick={() => {
                                                setwalletSignIn(false);
                                                setOpenSignIn(true);
                                                disconnect();
                                            }}
                                            className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-base font-Andvari"
                                        >
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
                <AlertDialog
                    open={selectedWalletOpen}
                    onOpenChange={
                        (isSelectedWalletOpen) => {
                            setSelectedWalletOpen(isSelectedWalletOpen);
                        }
                    }
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-4 font-Andvari">
                                <Loading03Icon className="w-8 h-8 animate-spin" />
                                Connecting {selectedWallet?.adapter.name}
                            </AlertDialogTitle>
                            <AlertDialogDescription></AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col gap-4 w-full items-center justify-center">
                            <Image
                                src={selectedWallet?.adapter.icon || ""}
                                alt={selectedWallet?.adapter.name || ""}
                                width={256}
                                height={256}
                                className="w-24 h-w-24"
                            />
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            ) : !walletSignIn && connected ? (
                <AlertDialog
                    open={openSignIn}
                    onOpenChange={
                        (isopenSignIn) => {
                            setOpenSignIn(isopenSignIn);
                        }
                    }
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-4 font-Andvari">
                                <Loading03Icon className="w-8 h-8 animate-spin" />
                                Sign In with {selectedWallet?.adapter.name}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                sign in to {publicKey?.toBase58().slice(0, 4) + ".." + publicKey?.toBase58().slice(-4)}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col gap-4 w-full items-center justify-center">
                            <Image
                                src={selectedWallet?.adapter.icon || ""}
                                alt={selectedWallet?.adapter.name || ""}
                                width={256}
                                height={256}
                                className="w-24 h-w-24"
                            />
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            ) : null}
        </>
    );
}
