// outsource dependencies
import { it, expect, describe, afterEach } from "@jest/globals";
import { act, render, screen, fireEvent } from "@testing-library/react";

// local dependencies
import ThemeSwitch from "./ThemeSwitch";
import { THEME_STORAGE_KEY } from "@/lib/theme";

describe("ThemeSwitch", () => {
    afterEach(() => {
        delete document.documentElement.dataset.theme;
        localStorage.clear();
    });

    it("unchecked when data-theme is light before render", () => {
        document.documentElement.dataset.theme = "light";
        render(<ThemeSwitch />);
        expect(screen.getByRole("switch")).toHaveAttribute(
            "aria-checked",
            "false",
        );
    });

    it("checked when data-theme is dark before render", () => {
        document.documentElement.dataset.theme = "dark";
        render(<ThemeSwitch />);
        expect(screen.getByRole("switch")).toHaveAttribute(
            "aria-checked",
            "true",
        );
    });

    it("click sets data-theme to dark, saves to localStorage, aria-checked true; click again → light", async () => {
        document.documentElement.dataset.theme = "light";
        render(<ThemeSwitch />);

        await act(async () => {
            fireEvent.click(screen.getByRole("switch"));
        });
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
        expect(screen.getByRole("switch")).toHaveAttribute(
            "aria-checked",
            "true",
        );

        await act(async () => {
            fireEvent.click(screen.getByRole("switch"));
        });
        expect(document.documentElement.dataset.theme).toBe("light");
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
        expect(screen.getByRole("switch")).toHaveAttribute(
            "aria-checked",
            "false",
        );
    });

    it("external data-theme change on <html> updates aria-checked via MutationObserver", async () => {
        document.documentElement.dataset.theme = "light";
        render(<ThemeSwitch />);
        expect(screen.getByRole("switch")).toHaveAttribute(
            "aria-checked",
            "false",
        );

        await act(async () => {
            document.documentElement.dataset.theme = "dark";
        });
        expect(screen.getByRole("switch")).toHaveAttribute(
            "aria-checked",
            "true",
        );
    });
});
