"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function FormPagination(
    { currentFormPage, totalFormPage }: { currentFormPage: number, totalFormPage: number }
) {
    const progressValue = (currentFormPage / totalFormPage) * 100;

    return (
        <div className="pt-8 w-full grid grid-cols-2 max-lg:grid-cols-1 gap-8">
            <div className="pt-2 flex gap-4 justify-start items-center">
                <p className="w-fit text-sm">
                    {`Step ${currentFormPage} of ${totalFormPage}`}
                </p>
                <Progress value={progressValue} className="w-[60%] h-2" />
            </div>
            <div className="pt-2 flex w-full gap-4 justify-end items-center max-lg:order-first">
                <Button
                    variant="secondary"
                    className="border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-sm font-Andvari"
                >
                    back
                </Button>
                <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-sm font-Andvari"
                >
                    next
                </Button>
            </div>
        </div>
    );
}
