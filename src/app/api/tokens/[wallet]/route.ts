import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
    request: NextRequest,
    { params }: { params: { wallet: string } }
) {
    const wallet = params.wallet;

    try {
        const response = await axios.get(
            `https://api-mainnet.magiceden.dev/v2/wallets/${wallet}/tokens`,
            {
                headers: {
                    accept: 'application/json',
                    // authorization: `Bearer ${process.env.MAGIC_EDEN_API_KEY}`,
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Magic Eden:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching data' },
            { status: 500 }
        );
    }
}