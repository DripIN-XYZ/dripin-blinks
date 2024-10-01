import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";
import Wrapper from "@/components/common/Wrapper";
import { ArrowRight02Icon } from "hugeicons-react";
import DotPattern from "@/components/magicui/dot-pattern";
import Image from "next/image";

export default function Home() {

    return (
        <Wrapper
            header={<Header />}
            footer={<></>}
        >
            <div className="flex flex-col size-full px-4 sm:px-8 lg:px-16 mb-20">
                {/* Hero Section */}
                <div className="relative size-full h-screen">
                    <div className="absolute size-full pointer-events-none">
                        <div className="size-full flex justify-center items-center overflow-hidden">
                            <DotPattern />
                        </div>
                    </div>
                    <div className="flex size-full flex-col justify-center items-center text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                            <span className="text-blue-600">Create </span>
                            and
                            <span className="text-blue-600"> Share </span>
                            Digital <br className="hidden sm:inline-block" /> Collectibles with Blinks on Solana.
                        </h1>
                        <p className="text-base sm:text-lg font-normal my-4 sm:my-6 max-w-2xl">
                            Create, showcase, and securely share your unique digital assets in the form of blinks.
                        </p>
                        <Button
                            asChild
                            variant="secondary"
                            className="border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-xs sm:text-sm font-Andvari"
                        >
                            <Link href="/create" className="flex gap-1 sm:gap-2 items-center">
                                Create Your First Blink
                                <ArrowRight02Icon />
                            </Link>
                        </Button>
                    </div>
                </div>
                {/* How DripIn Works Section */}
                <div className="flex flex-col justify-center gap-4 sm:gap-6 lg:gap-8 items-center">
                    {/* Heading */}
                    <div className="flex flex-col size-full gap-3 justify-center text-center">
                        <h1 className="font-Andvari text-blue-600 text-sm sm:text-base lg:text-lg">
                            &#91;Ship Faster&#93;
                        </h1>
                        <h2 className="text-black text-lg sm:text-3xl lg:text-4xl font-semibold">
                            Effortlessly Create Your Blink From Your Digital Collectibles
                        </h2>
                    </div>
                    <Image
                        width={1184}
                        height={564}
                        src="/cdn/homepage/Working Illustration.png"
                        alt="Working Image"
                        className="w-full"
                    />
                </div>

            </div>
        </Wrapper>
    );
}
