// local dependencies
import { monogramImage } from "@/lib/og/monogram";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return monogramImage({
        size,
        borderRadius: "20%",
        fontSize: 16,
        letterSpacing: "-0.5px",
    });
}
