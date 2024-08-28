import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="py-4 w-full max-w-[95vw] mx-auto flex items-center justify-between">
            <div>
                DripIN
            </div>
            <Link href="/create">
                <Button className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-base font-Andvari">
                    Create Blink
                </Button>
            </Link>
        </header>
    );
}
