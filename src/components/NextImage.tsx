"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

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

export default function NextImage({ className, alt, ...props }: NextImageProps) {
    const [blurImageProp, setBlurImageProp] = useState("blur-3xl");

    return (
        <div className="overflow-hidden">
            <Image
                {...props}
                alt={alt}
                blurDataURL={props.src as string}
                className={cn(className, blurImageProp)}
                onLoad={() => {
                    let i = 0;
                    const interval = setInterval(() => {
                        setBlurImageProp(blurImage[i]);
                        i++;
                        if (i === blurImage.length) {
                            clearInterval(interval);
                        }
                    }, 75);
                }}
            />
        </div>
    );
}
