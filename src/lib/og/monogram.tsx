// outsource dependencies
import { ImageResponse } from "next/og";

// local dependencies
import { geistBold } from "./fonts";

interface MonogramOptions {
    size: { width: number; height: number };
    borderRadius?: string;
    fontSize: number;
    letterSpacing: string;
}

export function monogramImage({
    size,
    borderRadius,
    fontSize,
    letterSpacing,
}: MonogramOptions): ImageResponse {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0a66c2",
                ...(borderRadius != null && { borderRadius }),
                fontFamily: "Geist",
                fontSize,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing,
            }}
        >
            OP
        </div>,
        {
            ...size,
            fonts: [
                {
                    name: "Geist",
                    data: geistBold,
                    style: "normal",
                    weight: 700,
                },
            ],
        },
    );
}
