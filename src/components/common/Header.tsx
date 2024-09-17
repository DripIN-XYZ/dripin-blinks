import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ConnectWallet from "@/components/wallet";

export default function Header() {
    return (
        <header className="px-5 w-full flex items-center justify-between">
            <Link href="/" className="flex gap-2">
                <Image
                    width={256}
                    height={256}
                    alt="Dripin Blink Logo"
                    src="/cdn/logo/favicon.webp"
                    className="w-8 h-8 object-cover"
                />
                <h1 className="text-2xl text-blue-600 font-Andvari font-normal">Dripin</h1>
            </Link>
            <ConnectWallet />
            {/* <Link href="/create">
                <Button className="bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-800 text-base font-Andvari">
                    Create Blink
                </Button>
            </Link> */}
        </header>
    );
}
