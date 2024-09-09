"use client";

import { useState } from "react";
import { Item, Attribute } from "@/types/SearchAssetsType";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy01Icon, CheckmarkSquare03Icon, ProfileIcon, UserMultipleIcon, Ticket02Icon, Tag01Icon } from "hugeicons-react";

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
        <div
            className={`flex  ${flip ? "flex-row" : "flex-row-reverse"} justify-between items-center`}
            onClick={handleCopy}
        >
            <div>
                {row1}
            </div>
            <div className="flex items-center gap-1 cursor-pointer group hover:underline hover:text-blue-600">
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
    { nftDetails, sellingPrice, selectedMode }: { nftDetails: Item, sellingPrice: number, selectedMode: string }
) {
    return (
        <>
            <Accordion
                type="multiple"
                defaultValue={
                    ["details", "tokenCreators", "attributes"]
                }
            >
                <AccordionItem value="details">
                    <AccordionTrigger>
                        <div className="flex gap-2 items-center">
                            <ProfileIcon className="w-5 h-5" />
                            Details
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col w-full gap-1">
                        <div className="flex items-center justify-between">
                            <p className="uppercase font-normal text-blue-600">Selling Price</p>
                            <p className="uppercase font-normal">{sellingPrice} SOL</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="uppercase font-normal text-blue-600">Selling Option</p>
                            <p className="uppercase font-normal">{selectedMode}</p>
                        </div>
                        <CopyButtonColumn
                            flip={true}
                            row1={<p className="uppercase font-normal text-blue-600">owner</p>}
                            row2={nftDetails.ownership.owner}
                        />
                        <CopyButtonColumn
                            flip={true}
                            row1={<p className="uppercase font-normal text-blue-600">mint address</p>}
                            row2={nftDetails.id.toString()}
                        />
                        <CopyButtonColumn
                            flip={true}
                            row1={<p className="uppercase font-normal text-blue-600">collection address</p>}
                            row2={nftDetails.grouping[0].group_value}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tokenCreators">
                    <AccordionTrigger>
                        <div className="flex gap-2 items-center">
                            <UserMultipleIcon className="w-5 h-5" />
                            Token Creator
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col w-full gap-1">
                        {
                            nftDetails.creators.map((creator, index) => {
                                return (
                                    <CopyButtonColumn
                                        flip={false}
                                        key={index}
                                        row1={
                                            <div className="flex gap-2 items-center text-blue-600">
                                                <Ticket02Icon className="w-5 h-5" />
                                                {`${creator.share}% Fees`}
                                            </div>
                                        }
                                        row2={creator.address}
                                    />
                                );
                            })
                        }
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
                            nftDetails.content.metadata.attributes.map((attribute, index) => {
                                return (
                                    <AttributeColumn
                                        key={index}
                                        attribute={attribute}
                                    />
                                );
                            })
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion >
            {/* <div className="flex flex-col w-full">
                <pre>
                    Selling Price: {sellingPrice} SOL
                </pre>
                <pre>
                    Mode: {selectedMode}
                </pre>
                <pre>
                    {JSON.stringify(nftDetails, null, 2)}
                </pre>
            </div> */}
        </>
    );
}
