"use client";

import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import Header from "./_components/Header";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import ConnectWallet from "@/components/wallet";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/common/Wrapper";
import { useWallet } from "@solana/wallet-adapter-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Connection, Transaction } from '@solana/web3.js';
import FlickeringGrid from "@/components/magicui/flickering-grid";
import getTokens, { getTokenType } from "@/lib/MagicEden/getTokens";
import FormPagination from "@/components/createBlink/formPagination";
import { NextImageCollection, NextImageNft } from "@/components/NextImage";
import ReviewListingAccordion from "@/components/createBlink/reviewListingAccordion";

export default function CreateBlink() {
    const { publicKey, signTransaction, sendTransaction, connected, disconnecting } = useWallet();
    const [currentFormPage, setCurrentFormPage] = useState<number>(1);
    const formPage = Array.from({ length: 7 }, (_, i) => i + 1);

    const [tokens, setTokens] = useState<getTokenType[] | null>(null);

    const [selectedNFTDetails, setSelectedNFTDetails] = useState<getTokenType | null>(null);

    const [selectedMode, setSelectedMode] = useState<"SELL_NFT" | "AUCTION_NFT" | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

    const [blinkLink, setBlinkLink] = useState<string | null>(null);

    useEffect(() => {
        if (publicKey) {
            setCurrentFormPage(2);
        }
        if (disconnecting) {
            setCurrentFormPage(1);
        }
    }, [publicKey, disconnecting]);

    useEffect(() => {
        if (publicKey) {
            const walletAddress = publicKey.toString();
            getTokens(walletAddress).then((data) => {
                setTokens((data as unknown) as getTokenType[]);
            }).catch(console.error);
        }
        else {
            setTokens(null);
        }
    }, [publicKey])

    const handleConfettiClick = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    const executeTransaction = async ({ encTx }: { encTx: string }) => {
        if (!connected) {
            console.error('Wallet not connected or no transaction to execute');
            return;
        }

        try {
            const connection = new Connection('https://api.mainnet-beta.solana.com');
            const encodedTransaction = encTx;
            const transaction = Transaction.from(Buffer.from(encodedTransaction, 'base64'));

            transaction.feePayer = publicKey!;
            if (signTransaction) {
                const signedTransaction = await signTransaction(transaction);
                const signature = await sendTransaction(signedTransaction, connection);
                const confirmation = await connection.confirmTransaction(signature);
                console.log('Transaction confirmed:', confirmation);
            } else {
                console.error('signTransaction is not defined');
                return;
            }
        } catch (error) {
            console.error('Error executing transaction:', error);
        }
    };

    const handleTransectionClick = () => {
        //     encTxListNFT({
        //         nft_address: selectedNFTDetails?.id as string,
        //         price: selectedPrice as number,
        //         seller_wallet: publicKey?.toString() as string
        //     }).then((data) => {
        //         console.log("DATA", data);
        //         if (data) {
        //             const encTx = data.result.encoded_transaction;
        //             executeTransaction({ encTx });
        //             setCurrentFormPage(currentFormPage + 1);
        //             setBlinkLink(`${window.location.origin}/api/buyNFT/${data.result.list_state}`);
        //             handleConfettiClick();
        //         }
        //         else {
        //             console.error("Error in transaction");
        //         }
        //     }).catch(
        //         console.error
        //     );
    };

    const renderFormSection = (currentFormPage: number) => {
        switch (currentFormPage) {
            case 1:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Get Started</h1>
                        <h2 className="pt-2 text-2xl font-semibold text-blue-600">Connect to your Wallet</h2>
                        <p className="pt-4 text-xl font-normal text-black">
                            Think of connecting your wallet like logging into your favorite app. It unlocks your digital assets so you can use them on our platform.
                        </p>
                        <div className="py-8">
                            <ConnectWallet />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Select Your NFT!</h1>
                        <h2 className="pt-2 text-xl font-normal text-black">Choose the NFT you want to list.</h2>
                        <ScrollArea className="pt-4 w-full h-[70vh] overflow-hidden">
                            {tokens! === null ? (
                                <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-4">
                                    {new Array(8).fill(null).map((index) => (
                                        <Button
                                            key={index}
                                            variant="secondary"
                                            className="h-fit border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-sm"
                                        >
                                            <div className="flex flex-col w-full h-fit gap-2 pt-2">
                                                <div className="relative w-full h-full overflow-hidden aspect-square rounded-sm border-blue-600 border-2">
                                                    <FlickeringGrid
                                                        className="z-0 absolute inset-0 size-full"
                                                        squareSize={4}
                                                        gridGap={2}
                                                        color="#0057FF"
                                                        maxOpacity={0.5}
                                                        flickerChance={0.1}
                                                        height={256}
                                                        width={256}
                                                    />
                                                </div>
                                                <div className="relative w-full h-4 overflow-hidden rounded-sm">
                                                    <FlickeringGrid
                                                        className="z-0 absolute inset-0 size-full"
                                                        squareSize={4}
                                                        gridGap={2}
                                                        color="#0057FF"
                                                        maxOpacity={0.5}
                                                        flickerChance={0.1}
                                                        height={256}
                                                        width={256}
                                                    />
                                                </div>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            ) : tokens.length === 0 ? (
                                <div>
                                    <p className="text-lg font-normal text-black">No NFTs found in your wallet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-4">
                                    {tokens && tokens.map((token, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => {
                                                setSelectedNFTDetails(token);
                                                setCurrentFormPage(currentFormPage + 1)
                                            }}
                                            variant="secondary"
                                            className="h-fit border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-sm"
                                        >
                                            <div className="flex flex-col w-full h-fit gap-2 pt-2">
                                                <NextImageCollection
                                                    src={token.image}
                                                    alt={token.name}
                                                    width={192}
                                                    height={192}
                                                    className="aspect-square object-contain w-full h-full rounded-sm border-blue-600 border-2"
                                                />
                                                <p className="w-full text-sm truncate">{token.name}</p>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                );

            case 3:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Choose mode</h1>
                        <h2 className="pt-2 text-xl font-normal text-black"> Ready to sell? Choose between a fixed price or an auction.</h2>
                        <p className="text-lg font-normal text-blue-500">
                            <strong>
                                {selectedNFTDetails && selectedNFTDetails.name}
                            </strong>
                        </p>
                        <div className="pt-5 flex gap-4 items-center">
                            <Button
                                onClick={() => {
                                    setSelectedMode("SELL_NFT");
                                    setCurrentFormPage(currentFormPage + 1);
                                }}
                                variant={
                                    selectedMode === "SELL_NFT"
                                        ? "default"
                                        : "secondary"
                                }
                                className={cn(
                                    "border-2 border-blue-600 focus-visible:ring-blue-800 text-sm font-Andvari",
                                    selectedMode === "SELL_NFT" ? "bg-blue-400 hover:bg-blue-300" : "bg-blue-100 hover:bg-blue-200"
                                )}
                            >
                                SELL NFT
                            </Button>
                            <Button
                                onClick={() => {
                                    setSelectedMode("AUCTION_NFT");
                                    setCurrentFormPage(currentFormPage + 1);
                                }}
                                variant={
                                    selectedMode === "AUCTION_NFT"
                                        ? "default"
                                        : "secondary"
                                }
                                className={cn(
                                    "border-2 border-blue-600 focus-visible:ring-blue-800 text-sm font-Andvari",
                                    selectedMode === "AUCTION_NFT" ? "bg-blue-400 hover:bg-blue-300" : "bg-blue-100 hover:bg-blue-200"
                                )}
                            >
                                AUCTION NFT
                            </Button>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Set Price</h1>
                        <h2 className="pt-2 text-xl font-normal text-black">What&apos;s your asking price for this NFT?</h2>
                        <form className="pt-5 flex gap-4 items-center">
                            <Input
                                required
                                type="number"
                                placeholder="Enter Amount"
                                onChange={(e) => setSelectedPrice(e.target.valueAsNumber)}
                                className="w-1/3 text-sm bg-transparent focus-visible:ring-blue-800 font-Andvari appearance-none"
                            />
                            <Button
                                onClick={() => {
                                    setCurrentFormPage(currentFormPage + 1);
                                }}
                                type="submit"
                                variant="default"
                                className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-sm font-Andvari"
                            >
                                Confirm
                            </Button>
                        </form>
                    </div>
                );

            case 5:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Review Listing</h1>
                        <h2 className="pt-2 text-xl font-normal text-black"> Please review your listing details before confirming.</h2>
                        {selectedNFTDetails && selectedPrice && selectedMode ? (
                            <ScrollArea className="pt-4 w-full h-[70vh] overflow-hidden">
                                <ReviewListingAccordion
                                    selectedMode={selectedMode}
                                    sellingPrice={selectedPrice}
                                    nftDetails={selectedNFTDetails}
                                />
                            </ScrollArea>
                        ) : null}
                    </div>
                );

            case 6:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Claim Your Blink</h1>
                        <h2 className="pt-2 text-xl font-normal text-black">Are you ready to claim your exclusive Blink</h2>
                        <div className="pt-5 flex gap-4 items-center">
                            <Button
                                onClick={() => {
                                    setSelectedNFTDetails(null);
                                    setSelectedMode(null);
                                    setSelectedPrice(null);
                                    setCurrentFormPage(1);
                                }}
                                variant="secondary"
                                className="border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-sm font-Andvari"
                            >
                                clear
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => {
                                    handleTransectionClick();
                                }}
                                className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-sm font-Andvari"
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Share Your Blink!</h1>
                        <h2 className="pt-2 text-xl font-normal text-black">Spread the word about your exclusive Blink amongst everyone </h2>
                        <div className="pt-5 flex gap-4 items-center">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    navigator.clipboard.writeText(blinkLink as string);
                                }}
                                className="border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-sm font-Andvari"
                            >
                                Copy Link
                                {/* <NewTwitterIcon /> */}
                            </Button>
                            <p className="font-normal text-sm font-Andvari">share on x!</p>
                        </div>
                        <div className="pt-5 flex gap-4 items-center">
                            <Button
                                onClick={() => {
                                    setSelectedNFTDetails(null);
                                    setSelectedMode(null);
                                    setSelectedPrice(null);
                                    setBlinkLink(null);
                                    setCurrentFormPage(1);
                                }}
                                variant="secondary"
                                className="border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-sm font-Andvari"
                            >
                                Create Another
                            </Button>
                            <Button
                                variant="default"
                                className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-sm font-Andvari"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }

    const renderBlinkSection = (
        {
            nftDetails, sellingMode, defaultPrice
        }: {
            nftDetails?: {
                nftImage: string | null,
                nftName: string | null,
            };
            sellingMode?: "SELL_NFT" | "AUCTION_NFT" | null;
            defaultPrice?: number | null;
        }
    ) => {
        return (
            <div className="w-full">
                {
                    nftDetails?.nftName && nftDetails.nftImage ? (
                        <div className="p-4 flex flex-col w-full h-fit gap-2 rounded-lg border-2 border-blue-600">
                            <NextImageCollection
                                src={nftDetails.nftImage}
                                alt={nftDetails.nftName}
                                width={512}
                                height={512}
                                quality={50}
                                className="aspect-square object-contain w-full rounded-sm border-blue-600 border-2"
                            />
                            <p className="w-full text-sm text-balance">{nftDetails.nftName}</p>
                        </div>
                    ) : (
                        <></>
                    )
                }
            </div>
        )
    };

    return (
        <Wrapper
            header={<Header currentFormPage={currentFormPage} />}
            footer={<></>}
        >
            <div className="p-8 h-full grid grid-cols-2 max-lg:grid-cols-1 gap-8">
                <div className="flex flex-col w-full justify-between">
                    <div className="h-full">
                        {renderFormSection(currentFormPage)}
                    </div>
                    <div className="w-full">
                        <FormPagination
                            currentFormPage={currentFormPage}
                            totalFormPage={formPage.length}
                            nextButtonOnClick={() => setCurrentFormPage(currentFormPage + 1)}
                            backButtonOnClick={() => setCurrentFormPage(currentFormPage - 1)}
                        />
                    </div>
                </div>
                <div className="flex w-full justify-center items-center max-lg:order-first">
                    <div className="flex w-full aspect-square bg-blue-100 rounded-md justify-center items-center">
                        <div className="flex w-1/2">
                            {renderBlinkSection({
                                nftDetails: {
                                    nftImage: selectedNFTDetails && selectedNFTDetails.image,
                                    nftName: selectedNFTDetails && selectedNFTDetails.name,
                                },
                                sellingMode: selectedMode,
                                defaultPrice: selectedPrice
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
