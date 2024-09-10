"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import FlickeringGrid from "@/components/magicui/flickering-grid";

function SkeletonImage() {
    return (
        // <Skeleton className="absolute inset-0 bg-blue-50 object-contain rounded-sm border-blue-600 border-2" />
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
