"use client";

import Header from "./_components/Header";
import { useEffect, useState } from "react";
import ConnectWallet from "@/components/wallet";
import Wrapper from "@/components/common/Wrapper";
import { useWallet } from "@solana/wallet-adapter-react";
import FormPagination from "@/components/createBlink/formPagination";

export default function CreateBlink() {
    const { publicKey } = useWallet();
    const [currentFormPage, setCurrentFormPage] = useState(1);
    const formPage = Array.from({ length: 7 }, (_, i) => i + 1);

    useEffect(() => {
        if (publicKey) {
            setCurrentFormPage(2);
        }
    }, [publicKey]);

    return (
        <Wrapper
            header={<Header currentFormPage={currentFormPage} />}
            footer={<></>}
        >
            <div className="p-8 h-full grid grid-cols-2 max-lg:grid-cols-1 gap-8">
                <div className="flex flex-col w-full justify-between">
                    <div className="h-full">
                        {currentFormPage === 1 ? (
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
                        ) : currentFormPage === 2 ? (
                            <div className="h-full flex flex-col justify-center">
                                <h1 className="text-5xl font-bold">Select a Collection</h1>
                                <h2 className="pt-2 text-xl font-normal text-black">Choose the collection you want to list an NFT from.</h2>
                            </div>
                        ) : currentFormPage === 3 ? (
                            <div className="h-full flex flex-col justify-center">
                                <h1 className="text-5xl font-bold">Select Your NFT!</h1>
                                <h2 className="pt-2 text-xl font-normal text-black">Choose the NFT you want to list from your collection.</h2>
                            </div>
                        ) : currentFormPage === 4 ? (
                            <div className="h-full flex flex-col justify-center">
                                <h1 className="text-5xl font-bold">Choose mode</h1>
                                <h2 className="pt-2 text-xl font-normal text-black"> Ready to sell? Choose between a fixed price or an auction.</h2>
                            </div>
                        ) : currentFormPage === 5 ? (
                            <div className="h-full flex flex-col justify-center">
                                <h1 className="text-5xl font-bold">Set Price</h1>
                                <h2 className="pt-2 text-xl font-normal text-black">What&apos;s your asking price for this NFT?</h2>
                            </div>
                        ) : currentFormPage === 6 ? (
                            <div className="h-full flex flex-col justify-center">
                                <h1 className="text-5xl font-bold">Review Listing</h1>
                                <h2 className="pt-2 text-xl font-normal text-black"> Please review your listing details before confirming.</h2>
                            </div>
                        ) : currentFormPage === 7 ? (
                            <div className="h-full flex flex-col justify-center">
                                <h1 className="text-5xl font-bold">Claim Your Blink</h1>
                                <h2 className="pt-2 text-xl font-normal text-black">Are you ready to claim your exclusive Blink</h2>
                            </div>
                        ) : null}
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
