import { Item } from "@/types/SearchAssetsType";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


export default function ReviewListingAccordion(
    { nftDetails, sellingPrice, selectedMode }: { nftDetails: Item, sellingPrice: number, selectedMode: string }
) {
    return (
        <>
            <div className="flex flex-col">
                <pre>
                    Selling Price: {sellingPrice} SOL
                </pre>
                <pre>
                    Mode: {selectedMode}
                </pre>
                <pre>
                    {JSON.stringify(nftDetails, null, 2)}
                </pre>
            </div>
            {/* <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
            </Accordion> */}
        </>
    );
}
