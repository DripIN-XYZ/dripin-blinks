import Link from "next/link";
import Image from "next/image";
import ConnectWallet from "@/components/wallet";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Header(
    { currentFormPage }: { currentFormPage: number }
) {
    const { publicKey } = useWallet();

    return (
        <header className="px-5 w-full flex items-center justify-between">
            <Link href="/" className="flex gap-px items-center">
                <Image
                    width={256}
                    height={256}
                    alt="Dripin Blink Logo"
                    src="/cdn/logo/favicon.webp"
                    className="w-7 h-7 object-cover"
                />
                <h1 className="text-2xl text-blue-600 font-Andvari font-normal">ripin</h1>
            </Link>
            {currentFormPage === 1 ? <div /> : <ConnectWallet />}
        </header>
    );
}
