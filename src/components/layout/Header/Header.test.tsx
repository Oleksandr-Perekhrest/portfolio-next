// outsource dependencies
import { it, expect, describe, afterEach } from "@jest/globals";
import { act, render, screen, fireEvent } from "@testing-library/react";

// local dependencies
import Header from "./Header";

function setScrollY(value: number) {
    Object.defineProperty(window, "scrollY", {
        value,
        writable: true,
        configurable: true,
    });
}

describe("Header", () => {
    afterEach(() => {
        setScrollY(0);
    });

    it("brand link has accessible name and href #top", () => {
        render(<Header />);
        const brand = screen.getByRole("link", {
            name: "Oleksandr Perekhrest",
        });
        expect(brand).toHaveAttribute("href", "#top");
    });

    it("nav links have correct names and hrefs", () => {
        render(<Header />);
        expect(
            screen.getByRole("link", { name: "Experience" }),
        ).toHaveAttribute("href", "#experience");
        expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
            "href",
            "#about",
        );
        expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
            "href",
            "#contact",
        );
    });

    it("data-compact is false initially", () => {
        render(<Header />);
        expect(screen.getByRole("banner")).toHaveAttribute(
            "data-compact",
            "false",
        );
    });

    it("data-compact becomes true after scrolling past threshold", () => {
        render(<Header />);
        act(() => {
            setScrollY(100);
            fireEvent.scroll(window);
        });
        expect(screen.getByRole("banner")).toHaveAttribute(
            "data-compact",
            "true",
        );
    });

    it("data-compact returns to false when scrolled back to 0", () => {
        render(<Header />);
        act(() => {
            setScrollY(100);
            fireEvent.scroll(window);
        });
        expect(screen.getByRole("banner")).toHaveAttribute(
            "data-compact",
            "true",
        );
        act(() => {
            setScrollY(0);
            fireEvent.scroll(window);
        });
        expect(screen.getByRole("banner")).toHaveAttribute(
            "data-compact",
            "false",
        );
    });

    it("data-compact is true when page is already scrolled on mount", () => {
        setScrollY(100);
        render(<Header />);
        expect(screen.getByRole("banner")).toHaveAttribute(
            "data-compact",
            "true",
        );
    });

    it("threshold boundary: scrollY 16 is false, scrollY 17 is true", () => {
        render(<Header />);
        act(() => {
            setScrollY(16);
            fireEvent.scroll(window);
        });
        expect(screen.getByRole("banner")).toHaveAttribute(
            "data-compact",
            "false",
        );
        act(() => {
            setScrollY(17);
            fireEvent.scroll(window);
        });
        expect(screen.getByRole("banner")).toHaveAttribute(
            "data-compact",
            "true",
        );
    });
});
