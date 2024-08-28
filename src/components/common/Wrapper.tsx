export default function Wrapper({
    children, header, footer
}: Readonly<{
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}>) {
    return (
        <main className="flex flex-row w-screen h-screen justify-between">
            <div className="flex flex-col h-full w-[4vw] justify-between border-r-2 border-dashed border-blue-600">
                <div className="w-full h-[8vh] border-b-2 border-blue-600" />
                <div className="h-full" />
                <div className="w-full h-[8vh] border-t-2 border-blue-600" />
            </div>
            <div className="flex flex-col w-full justify-between">
                <div className="w-full h-[8vh] border-b-2 border-blue-600">
                    {header}
                </div>
                <div className="h-full">
                    {children}
                </div>
                <div className="w-full h-[8vh] border-t-2 border-blue-600">
                    {footer}
                </div>
            </div>
            <div className="flex flex-col h-full w-[4vw] justify-between border-l-2 border-dashed border-blue-600">
                <div className="w-full h-[8vh] border-b-2 border-blue-600" />
                <div className="h-full" />
                <div className="w-full h-[8vh] border-t-2 border-blue-600" />
            </div>
        </main>
    );
}
