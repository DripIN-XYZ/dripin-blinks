import Header from "./_components/Header";
import ConnectWallet from "@/components/wallet";
import Wrapper from "@/components/common/Wrapper";
import { InformationCircleIcon } from "hugeicons-react";
import FormPagination from "@/components/createBlink/formPagination";

export default function CreateBlink() {
    return (
        <Wrapper
            header={<Header />}
            footer={<></>}
        >
            <div className="p-8 h-full grid grid-cols-2 max-lg:grid-cols-1 gap-8">
                <div className="flex flex-col w-full justify-between">
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-5xl font-bold">Get Started</h1>
                        <h2 className="pt-2 text-2xl font-semibold text-blue-600">Connect to your Wallet</h2>
                        <p className="pt-4 text-xl font-normal text-black">
                            Think of connecting your wallet like logging into your favorite app. It unlocks your digital assets so you can use them on our platform.
                        </p>
                        {/* <p className="flex py-8 gap-2 items-center text-sm text-grayText-200">
                            I don&apos;t have a wallet
                            <InformationCircleIcon className="w-4 h-4" />
                        </p> */}
                        <div className="py-8">
                            <ConnectWallet />
                        </div>
                    </div>
                    <div className="w-full">
                        <FormPagination currentFormPage={1} totalFormPage={6} />
                    </div>
                </div>
                <div className="flex w-full justify-center items-center max-lg:order-first">
                    <div className="w-full aspect-square bg-blue-100 rounded-md">

                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
