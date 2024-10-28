import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const imageUrl = searchParams.get("imageUrl");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://dashboard.hackenproof.com",
      },
    });

    // Перевірка, чи статус відповіді успішний
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch image",
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get("content-type"),
        },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image")) {
      return NextResponse.json(
        {
          error: "The requested resource isn't a valid image",
          contentType,
          status: response.status,
          statusText: response.statusText,
        },
        { status: 500 }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to load image", message: error },
      { status: 500 }
    );
  }
}
