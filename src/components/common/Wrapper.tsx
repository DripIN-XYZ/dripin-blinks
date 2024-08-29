export default function Wrapper({
    children, header, footer
}: Readonly<{
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col w-full min-h-screen justify-between">
            <div className="flex flex-row w-full h-[8vh] justify-between border-b-2 border-blue-600">
                <div className="w-full max-w-[92vw] mx-auto border-r-2 border-l-2 border-dashed border-blue-600">
                    {header}
                </div>
            </div>
            <div className="flex flex-row justify-between w-full min-h-[84vh]">
                <div className="w-full max-w-[92vw] mx-auto border-r-2 border-l-2 border-dashed border-blue-600">
                    {children}
                </div>
            </div>
            <div className="flex flex-row w-full h-[8vh] justify-between border-t-2 border-blue-600">
                <div className="w-full max-w-[92vw] mx-auto border-r-2 border-l-2 border-dashed border-blue-600">
                    {footer}
                </div>
            </div>
        </main>
    );
}
