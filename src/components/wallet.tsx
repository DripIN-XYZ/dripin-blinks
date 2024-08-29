"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createWalletSignIn } from "@/lib/sanity";
import { useWallet } from "@solana/wallet-adapter-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function ConnectWallet() {
    const { select, wallets, publicKey, disconnect, signMessage } = useWallet();

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
            const data = await createWalletSignIn({
                _type: "walletSignIn",
                publicKey: publicKey.toString(),
                lastEventTrigger: new Date().toISOString(),
            });
            console.log("final", data);
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
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-base font-Andvari">
                    {!publicKey ?
                        ("Connect Wallet") : (publicKey?.toBase58().slice(0, 4) + ".." + publicKey?.toBase58().slice(-4))
                    }
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect Your Wallet</DialogTitle>
                    {
                        !publicKey ? (
                            <>
                                <div className="pt-2 flex flex-col items-center justify-center">
                                    {wallets.filter((wallet) => wallet.readyState === "Installed").length > 0 ? (
                                        <div className="grid grid-cols-4 gap-4">
                                            {wallets.filter((wallet) => wallet.readyState === "Installed").map((wallet) => (
                                                <Button
                                                    variant="outline"
                                                    key={wallet.adapter.name}
                                                    onClick={() => select(wallet.adapter.name)}
                                                    className="flex flex-col w-full aspect-square h-full gap-2 items-center justify-center"
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
                            </>
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
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}