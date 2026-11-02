// local dependencies
import { monogramImage } from "@/lib/og/monogram";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
    return monogramImage({ size, fontSize: 72, letterSpacing: "-2px" });
}
