// outsource dependencies
import { ImageResponse } from "next/og";

// local dependencies
import { geistBold } from "./og-fonts";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const monogram = "OP";

export default function Icon() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0a66c2",
                borderRadius: "20%",
                fontFamily: "Geist",
                fontSize: 16,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.5px",
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
