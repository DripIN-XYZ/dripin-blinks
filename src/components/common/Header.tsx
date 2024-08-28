import ConnectWallet from "@/components/wallet";

export default function Header() {
    return (
        <header className="py-4 w-full max-w-[95vw] mx-auto flex items-center justify-between">
            <div>
                DripIN
            </div>
            <ConnectWallet />
        </header>
    );
}