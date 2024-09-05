import { Skeleton } from "@/components/ui/skeleton";

export default function NFTLoadingSuspense({ numberOfNFTs }: { numberOfNFTs: number }) {
    return (
        <>
            {new Array(numberOfNFTs).fill(null).map((index) => (
                <div key={index} className="flex flex-col w-full h-fit gap-2 pt-2">
                    <Skeleton className="aspect-square object-contain w-full h-full rounded-sm border-blue-600 border-2" />
                    <Skeleton className="w-20 h-4" />
                </div>
            ))}
        </>
    );
}