"use client";

import { cn } from "@/lib/utils";
import Header from "./_components/Header";
import { useEffect, useState } from "react";
import fetchTokens from "@/lib/searchAssets";
import { Input } from "@/components/ui/input";
import ConnectWallet from "@/components/wallet";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/common/Wrapper";
import { useWallet } from "@solana/wallet-adapter-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FormPagination from "@/components/createBlink/formPagination";
import { Grouping, Item, ItemsResponse } from "@/types/SearchAssetsType";
import { NextImageCollection, NextImageNft } from "@/components/NextImage";

export default function CreateBlink() {
    const { publicKey, disconnecting } = useWallet();
    const [currentFormPage, setCurrentFormPage] = useState<number>(1);
    const formPage = Array.from({ length: 7 }, (_, i) => i + 1);

    const [tokens, setTokens] = useState<ItemsResponse | null>(null);
    const [collectionDetails, setCollectionDetails] = useState<Grouping[]>([]);

    const [selectedCollectionAddress, setSelectedCollectionAddress] = useState<string>("");
    const [specificCollectionDetails, setSpecificCollectionDetails] = useState<Item[] | null>(null);

    const [selectedNFTmintAddress, setSelectedNFTmintAddress] = useState<string>("");

    const [selectedMode, setSelectedMode] = useState<"SELL_NFT" | "BID_NFT" | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

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
                        <h1 className="text-5xl font-bold">Select a Collection</h1>
                        <h2 className="pt-2 text-xl font-normal text-black">Choose the collection you want to list an NFT from.</h2>
                        <ScrollArea className="pt-4 w-full h-[70vh] overflow-hidden">
                            <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-4">
                                {collectionDetails && collectionDetails.map((collection, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => {
                                            setSelectedCollectionAddress(collection.group_value);
                                            setCurrentFormPage(currentFormPage + 1)
                                        }}
                                        variant="secondary"
                                        className="h-fit border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-sm"
                                    >
                                        <div className="flex flex-col w-full h-fit gap-2 pt-2">
                                            <NextImageCollection
                                                src={collection.collection_metadata.image}
                                                alt={collection.collection_metadata.name}
                                                width={192}
                                                height={192}
                                                className="aspect-square object-contain w-full h-full rounded-sm border-blue-600 border-2"
                                            />
                                            <p className="text-sm">{collection.collection_metadata.name}</p>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                );

            case 3:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Select Your NFT!</h1>
                        <h2 className="pt-2 text-xl font-normal text-black">{`Choose the NFT you want to list from `}
                            <strong>
                                {specificCollectionDetails && specificCollectionDetails[0].grouping[0].collection_metadata.name}.
                            </strong>
                        </h2>
                        <ScrollArea className="pt-4 w-full h-[70vh] overflow-hidden">
                            <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-4">
                                {specificCollectionDetails && specificCollectionDetails.map((nft, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => {
                                            setSelectedNFTmintAddress(nft.id);
                                            setCurrentFormPage(currentFormPage + 1)
                                        }}
                                        variant="secondary"
                                        className="h-fit border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-sm"
                                    >
                                        <div className="flex flex-col w-full h-fit gap-2 pt-2">
                                            <NextImageNft
                                                src={nft.content.links.image}
                                                alt={nft.content.metadata.name}
                                                width={192}
                                                height={192}
                                                className="aspect-square object-contain w-full h-full rounded-sm border-blue-600 border-2"
                                            />
                                            <p className="text-sm">{nft.content.metadata.name}</p>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                );

            case 4:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Choose mode</h1>
                        <h2 className="pt-2 text-xl font-normal text-black"> Ready to sell? Choose between a fixed price or an auction.</h2>
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
                                    setSelectedMode("BID_NFT");
                                    setCurrentFormPage(currentFormPage + 1);
                                }}
                                variant={
                                    selectedMode === "BID_NFT"
                                        ? "default"
                                        : "secondary"
                                }
                                className={cn(
                                    "border-2 border-blue-600 focus-visible:ring-blue-800 text-sm font-Andvari",
                                    selectedMode === "BID_NFT" ? "bg-blue-400 hover:bg-blue-300" : "bg-blue-100 hover:bg-blue-200"
                                )}
                            >
                                BID NFT
                            </Button>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Set Price</h1>
                        <h2 className="pt-2 text-xl font-normal text-black">What&apos;s your asking price for this NFT?</h2>
                        <div className="pt-5 flex gap-4 items-center">
                            <Input
                                type="number"
                                placeholder="Enter Amount"
                                onChange={(e) => setSelectedPrice(parseInt(e.target.value))}
                                className="w-1/3 text-sm bg-transparent focus-visible:ring-blue-800 font-Andvari appearance-none"
                            />
                            <Button
                                onClick={() => {
                                    setCurrentFormPage(currentFormPage + 1);
                                }}
                                variant="default"
                                className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-sm"
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Review Listing</h1>
                        <h2 className="pt-2 text-xl font-normal text-black"> Please review your listing details before confirming.</h2>
                    </div>
                );

            case 7:
                return (
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Claim Your Blink</h1>
                        <h2 className="pt-2 text-xl font-normal text-black">Are you ready to claim your exclusive Blink</h2>
                    </div>
                );

            default:
                return null;
        }
    }

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
            fetchTokens(walletAddress).then((data) => {
                setTokens((data as unknown) as ItemsResponse);
            }).catch(console.error);
        }
        else {
            setTokens(null);
        }
    }, [publicKey])

    useEffect(() => {
        const collectionMap = new Map<string, Grouping>();
        if (!tokens) {
            return;
        }
        tokens?.items.items.forEach((nft) => {
            const collection = nft.grouping.find((g) => g.group_key === "collection");
            if (collection && collection.collection_metadata) {
                collectionMap.set(collection.group_value, collection);
            }
        });
        setCollectionDetails(Array.from(collectionMap.values()));
    }, [tokens]);

    useEffect(() => {
        if (selectedCollectionAddress) {
            if (tokens) {
                const collectionNFTData = tokens.items.items.filter((nft) => {
                    const collection = nft.grouping.find((g) => g.group_key === "collection");
                    return collection && collection.group_value === selectedCollectionAddress;
                });
                setSpecificCollectionDetails((collectionNFTData as unknown) as Item[]);
            }
        }
    }, [selectedCollectionAddress, tokens]);

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
                    <div className="w-full aspect-square bg-blue-100 rounded-md">
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
