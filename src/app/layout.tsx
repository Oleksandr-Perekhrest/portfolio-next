// outsource dependencies
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// local dependencies
import "./globals.scss";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Alex Perekhrest — Web Engineer",
    description: "Personal portfolio of Alex Perekhrest, web engineer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body>{children}</body>
        </html>
    );
}
