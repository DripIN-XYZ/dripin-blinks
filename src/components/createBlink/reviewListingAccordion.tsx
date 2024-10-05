"use client";

import React from "react";
import { useState } from "react";
import { Collectible, Attribute } from "@/lib/phantom/searchAssets";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy01Icon, CheckmarkSquare03Icon, ProfileIcon, UserMultipleIcon, Tag01Icon, CoinsDollarIcon } from "hugeicons-react";

const CopyButtonColumn = (
    { row1, row2, flip }: { row1: JSX.Element, row2: string, flip: boolean }
) => {
    const [onCopy, setOnCopy] = useState(false);
    const [onSuccess, setSuccess] = useState(false);

    const handleCopy = async () => {
        let text = row2.toString();
        try {
            await navigator.clipboard.writeText(text!);
            setOnCopy(true);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <div className={`flex  ${flip ? "flex-row" : "flex-row-reverse"} justify-between items-center`}>
            <div>
                {row1}
            </div>
            <div
                className="flex items-center gap-1 cursor-pointer group hover:underline hover:text-blue-600"
                onClick={handleCopy}
            >
                <p>{row2}</p>
                <div
                    className="hover:scale-105 relative cursor-pointer"
                    onClick={handleCopy}
                >
                    <CheckmarkSquare03Icon
                        className={`" cursor-pointer transition-all w-5 h-5 text-green-500 ${onSuccess ? "scale-90" : "scale-0"}`}
                        onTransitionEnd={() => {
                            setTimeout(() => {
                                setSuccess(false);
                                setOnCopy(false);
                            }, 500);
                        }}
                    />

                    <div className="h-full w-full absolute top-0 left-0 flex items-center justify-center">
                        <Copy01Icon
                            className={`" transition-all ${onCopy ? "scale-0" : "scale-100"}`}
                            onTransitionEnd={() => {
                                if (onCopy) {
                                    setSuccess(true);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const AttributeColumn = (
    { attribute }: { attribute: Attribute }
) => {
    return (
        <div className="p-2 flex flex-col gap-1 border-2 rounded-md">
            <p className="uppercase font-normal text-blue-600">{attribute.trait_type}</p>
            <p className="uppercase font-normal">{attribute.value}</p>
        </div>
    );
}

export default function ReviewListingAccordion(
    { nftDetails, sellingPrice, selectedMode, auctionDuration }: { nftDetails: Collectible, sellingPrice: number, selectedMode: "SELL_NFT" | "AUCTION_NFT" | null, auctionDuration?: number | null }
) {
    let attributes: Attribute[] | null;

    if (nftDetails.attributes === null) {
        attributes = null
    } else {
        attributes = nftDetails.attributes
    }

    return (
        <>
            <Accordion
                type="multiple"
                defaultValue={
                    ["details", "tokenDetails", "attributes"]
                }
            >
                <AccordionItem value="details">
                    <AccordionTrigger>
                        <div className="flex gap-2 items-center">
                            <ProfileIcon className="w-5 h-5" />
                            NFT Details
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col w-full gap-1">
                        <div className="flex items-center justify-between">
                            <p className="uppercase font-normal text-blue-600">Selling Price</p>
                            <p className="uppercase font-normal">{sellingPrice} SOL</p>
                        </div>
                        {
                            selectedMode === "AUCTION_NFT" ? (
                                <div className="flex items-center justify-between">
                                    <p className="uppercase font-normal text-blue-600">Auction Duration</p>
                                    <p className="uppercase font-normal">{auctionDuration} hour</p>
                                </div>
                            ) : null
                        }
                        <div className="flex items-center justify-between">
                            <p className="uppercase font-normal text-blue-600">Selling Option</p>
                            <p className="uppercase font-normal">{selectedMode}</p>
                        </div>
                        <CopyButtonColumn
                            flip={true}
                            row1={<p className="uppercase font-normal text-blue-600">owner</p>}
                            row2={nftDetails.owner}
                        />
                        <CopyButtonColumn
                            flip={true}
                            row1={<p className="uppercase font-normal text-blue-600">mint address</p>}
                            row2={nftDetails.chainData.mint}
                        />
                        {
                            nftDetails.collection.isValidCollectionId ? (
                                <div className="flex flex-col w-full gap-y-1">
                                    <CopyButtonColumn
                                        flip={true}
                                        row1={<p className="uppercase font-normal text-blue-600">collection address</p>}
                                        row2={nftDetails.collection.id}
                                    />
                                </div>
                            ) : null
                        }
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tokenDetails">
                    <AccordionTrigger>
                        <div className="flex gap-2 items-center">
                            <CoinsDollarIcon className="w-5 h-5" />
                            Token Details
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col w-full gap-1">
                        <CopyButtonColumn
                            flip={true}
                            row1={<p className="uppercase font-normal text-blue-600">Token Standard</p>}
                            row2={nftDetails.chainData.standard}
                        />
                        <CopyButtonColumn
                            flip={true}
                            row1={<p className="uppercase font-normal text-blue-600">Unique Holders</p>}
                            row2={`${nftDetails.collection.ownerCount}`}
                        />
                        <CopyButtonColumn
                            flip={true}
                            row1={<p className="uppercase font-normal text-blue-600">Total Count</p>}
                            row2={`${nftDetails.collection.totalCount}`}
                        />
                        <CopyButtonColumn
                            flip={true}
                            row1={<p className="uppercase font-normal text-blue-600">floor price</p>}
                            row2={`${(nftDetails.collection.floorPrice?.price! / Math.pow(10, nftDetails.collection.floorPrice?.token.decimals!))} ${nftDetails.collection.floorPrice?.token.symbol}`}
                        />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="attributes">
                    <AccordionTrigger>
                        <div className="flex gap-2 items-center">
                            <Tag01Icon className="w-5 h-5" />
                            Attributes
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-2 w-full gap-1">
                        {
                            attributes && attributes.length > 0 ? attributes.map((attribute, index) => {
                                return (
                                    <AttributeColumn
                                        key={index}
                                        attribute={attribute}
                                    />
                                )
                            }) : ("No Attributes Found")
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion >
        </>
    );
}
