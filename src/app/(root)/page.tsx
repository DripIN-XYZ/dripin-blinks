import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";
import Wrapper from "@/components/common/Wrapper";
import { ArrowRight02Icon } from "hugeicons-react";
import DotPattern from "@/components/magicui/dot-pattern";

export default function Home() {

    return (
        <Wrapper
            header={<Header />}
            footer={<></>}
        >
            <div className="flex size-full items-center">
                <div className="relative size-full">
                    <div className="absolute size-full pointer-events-none">
                        <div className="size-full flex justify-center items-center overflow-hidden">
                            <DotPattern />
                        </div>
                    </div>
                    <div className="flex size-full flex-col justify-center items-center text-center">
                        <h1 className="text-6xl font-bold">
                            <span className="text-blue-600">Create </span>
                            and
                            <span className="text-blue-600"> Share </span>
                            Digital <br /> Collectibles with Blinks on Solana.
                        </h1>
                        <p className="text-lg font-normal my-6">
                            Create, showcase, and securely share your unique digital assets in form of blinks.
                        </p>
                        <Button
                            asChild
                            variant="secondary"
                            className="border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-sm font-Andvari"
                        >
                            <Link
                                href="/create"
                                className="flex gap-2 items-center"
                            >
                                Create Your First Blink
                                <ArrowRight02Icon />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}