import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function FormPagination(
    { currentFormPage, totalFormPage }: { currentFormPage: number, totalFormPage: number }
) {
    const progressValue = (currentFormPage / totalFormPage) * 100;

    return (
        <div className="pt-8 w-full grid grid-cols-2 max-lg:grid-cols-1 gap-8">
            <p className="pt-2 w-full flex gap-4 justify-start items-center">
                {`Step ${currentFormPage} of ${totalFormPage}`}
                <Progress value={progressValue} className="w-[60%] h-2" />
            </p>
            <div className="pt-2 flex w-full gap-4 justify-end items-center">
                <Button
                    variant="secondary"
                    className="border-2 border-blue-600 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-800 text-base font-Andvari"
                >
                    back
                </Button>
                <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-base font-Andvari"
                >
                    next
                </Button>
            </div>
        </div>
    );
}
