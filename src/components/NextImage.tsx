"use client";

import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import React, { useState } from "react";
import FlickeringGrid from "@/components/magicui/flickering-grid";

function SkeletonImage() {
    return (
        <FlickeringGrid
            className="z-0 absolute inset-0 size-full"
            squareSize={4}
            gridGap={2}
            color="#0057FF"
            maxOpacity={0.5}
            flickerChance={0.1}
            height={512}
            width={512}
        />
    );
}

interface NextImageProps extends Omit<ImageProps, "className" | "onLoad"> {
    alt: string;
    className?: string;
}

export function NextImageCollection({ className, alt, ...props }: NextImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {!isLoaded && <SkeletonImage />}
            <Image
                {...props}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                className={cn(
                    className,
                    "transition-opacity duration-300 ease-in-out",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}

export function NextImageNft({ className, alt, ...props }: NextImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {!isLoaded && <SkeletonImage />}
            <Image
                {...props}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                className={cn(
                    className,
                    "transition-opacity duration-300 ease-in-out",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}
