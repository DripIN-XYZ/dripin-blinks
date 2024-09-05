"use client";

import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const blurImage = [
    "blur-3xl",
    "blur-2xl",
    "blur-xl",
    "blur-lg",
    "blur-md",
    "blur-sm",
    "blur-none",
];

interface NextImageProps extends Omit<ImageProps, "className" | "onLoad"> {
    alt: string;
    className?: string;
}

export function NextImageCollection({ className, alt, ...props }: NextImageProps) {
    const [blurImageProp, setBlurImageProp] = useState("blur-3xl");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new window.Image();
        img.src = props.src as string;
        img.onload = () => {
            setIsLoaded(true);
            let i = 0;
            const interval = setInterval(() => {
                setBlurImageProp(blurImage[i]);
                i++;
                if (i === blurImage.length) {
                    clearInterval(interval);
                }
            }, 75);
        };
    }, [props.src]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {!isLoaded && (
                <Skeleton className="absolute inset-0 bg-blue-50 object-contain rounded-sm border-blue-600 border-2" />
            )}
            <Image
                {...props}
                alt={alt}
                blurDataURL={props.src as string}
                className={cn(
                    className,
                    blurImageProp,
                    "transition-opacity duration-300 ease-in-out",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}

export function NextImageNft({ className, alt, ...props }: NextImageProps) {
    const [blurImageProp, setBlurImageProp] = useState("blur-3xl");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new window.Image();
        img.src = props.src as string;
        img.onload = () => {
            setIsLoaded(true);
            let i = 0;
            const interval = setInterval(() => {
                setBlurImageProp(blurImage[i]);
                i++;
                if (i === blurImage.length) {
                    clearInterval(interval);
                }
            }, 75);
        };
    }, [props.src]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {!isLoaded && (
                <Skeleton className="absolute inset-0 bg-blue-50 object-contain rounded-sm border-blue-600 border-2" />
            )}
            <Image
                {...props}
                alt={alt}
                blurDataURL={props.src as string}
                className={cn(
                    className,
                    blurImageProp,
                    "transition-opacity duration-300 ease-in-out",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}
