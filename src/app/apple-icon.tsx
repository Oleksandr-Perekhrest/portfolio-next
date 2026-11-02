// outsource dependencies
import { ImageResponse } from "next/og";

// local dependencies
import { geistBold } from "./og-fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const monogram = "OP";

export default function AppleIcon() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0a66c2",
                fontFamily: "Geist",
                fontSize: 72,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-2px",
            }}
        >
            {monogram}
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
