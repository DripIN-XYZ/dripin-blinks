import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const TENSOR_API_BASE_URL = "https://api.mainnet.tensordev.io/api/v1/tx";

export async function GET(
    request: NextRequest,
    { params }: { params: { tensor: string[] } }
) {
    const tensorPath = params.tensor.join("/");
    console.log("======== TENSOR PATH ========", tensorPath);
    const { searchParams } = new URL(request.url);
    const apiUrl = new URL(`${TENSOR_API_BASE_URL}/${tensorPath}`);

    searchParams.forEach((value, key) => {
        apiUrl.searchParams.append(key, value);
    });

    try {
        console.log("======== API URL ========", apiUrl.toString());
        const response = await axios.get(apiUrl.toString(), {
            headers: {
                accept: "application/json",
                "x-tensor-api-key": process.env.NEXT_PUBLIC_TENSOR_API_KEY
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "An error occurred while fetching data" }, { status: 500 });
    }
}
