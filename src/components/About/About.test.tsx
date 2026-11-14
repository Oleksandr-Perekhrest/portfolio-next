// outsource dependencies
import { it, expect, describe, afterEach } from "@jest/globals";
import { screen, cleanup, fireEvent } from "@testing-library/react";

// local dependencies
import About from "./About";
import { languages } from "@/content/languages";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("About", () => {
    afterEach(cleanup);

    describe("en locale", () => {
        it("renders h2 section title 'About'", () => {
            renderWithIntl(<About />);
            expect(
                screen.getByRole("heading", { level: 2, name: "About" }),
            ).toBeInTheDocument();
        });

        it("h3 contains a button whose name includes 'Long story short'", () => {
            renderWithIntl(<About />);
            const heading = screen.getByRole("heading", {
                level: 3,
                name: /Long story short/,
            });
            const button = screen.getByRole("button", {
                name: /Long story short/,
            });
            expect(heading).toContainElement(button as HTMLElement);
        });

        it("button is initially collapsed: aria-expanded='false'", () => {
            renderWithIntl(<About />);
            expect(
                screen.getByRole("button", { name: /Long story short/ }),
            ).toHaveAttribute("aria-expanded", "false");
        });

        it("renders 'From kitchen to web engineering'", () => {
            renderWithIntl(<About />);
            expect(
                screen.getByText("From kitchen to web engineering"),
            ).toBeInTheDocument();
        });

        it("intro and all 7 journey steps are in the DOM while closed (forceMount)", () => {
            renderWithIntl(<About />);
            expect(
                screen.getByText(/I came to IT in 2022/),
            ).toBeInTheDocument();
            expect(screen.getByText("Cook")).toBeInTheDocument();
            expect(screen.getByText("Head chef")).toBeInTheDocument();
            expect(screen.getByText("Logistics")).toBeInTheDocument();
            expect(screen.getByText("Head of sales")).toBeInTheDocument();
            expect(screen.getByText("Into IT")).toBeInTheDocument();
            expect(screen.getByText("Frontend developer")).toBeInTheDocument();
            expect(screen.getByText("Full-stack")).toBeInTheDocument();
        });

        it("last journey step shows 'Now'", () => {
            renderWithIntl(<About />);
            expect(screen.getByText("Now")).toBeInTheDocument();
        });

        it("clicking the trigger sets aria-expanded='true'", () => {
            renderWithIntl(<About />);
            const button = screen.getByRole("button", {
                name: /Long story short/,
            });
            fireEvent.click(button);
            expect(button).toHaveAttribute("aria-expanded", "true");
        });
    });

    describe("uk locale", () => {
        it("renders section title 'Про мене'", () => {
            renderWithIntl(<About />, { locale: "uk" });
            expect(
                screen.getByRole("heading", { level: 2, name: "Про мене" }),
            ).toBeInTheDocument();
        });

        it("button name includes 'Якщо коротко'", () => {
            renderWithIntl(<About />, { locale: "uk" });
            expect(
                screen.getByRole("button", { name: /Якщо коротко/ }),
            ).toBeInTheDocument();
        });

        it("last journey step shows 'Зараз'", () => {
            renderWithIntl(<About />, { locale: "uk" });
            expect(screen.getByText("Зараз")).toBeInTheDocument();
        });
    });

    describe("Languages section", () => {
        it("languages heading 'Languages' is visible while accordion is collapsed (en)", () => {
            renderWithIntl(<About />);
            expect(
                screen.getByRole("heading", { level: 3, name: "Languages" }),
            ).toBeInTheDocument();
        });

        it("languages heading 'Мови' is visible while accordion is collapsed (uk)", () => {
            renderWithIntl(<About />, { locale: "uk" });
            expect(
                screen.getByRole("heading", { level: 3, name: "Мови" }),
            ).toBeInTheDocument();
        });

        it("language list has one listitem per entry in languages.ts", () => {
            renderWithIntl(<About />);
            // The about card has two lists: languages and journey (inside collapsible forceMount).
            // Find the ul inside the languages section by its heading.
            const heading = screen.getByRole("heading", {
                level: 3,
                name: "Languages",
            });
            const listEl = heading.nextElementSibling;
            expect(listEl).not.toBeNull();
            const items = listEl
                ? Array.from(listEl.querySelectorAll("li"))
                : [];
            expect(items).toHaveLength(languages.length);
        });

        it("each language item text is exactly '<Name> — <level>' with single spaces (en)", () => {
            renderWithIntl(<About />);
            const heading = screen.getByRole("heading", {
                level: 3,
                name: "Languages",
            });
            const list = heading.nextElementSibling;
            expect(list).not.toBeNull();
            const texts = Array.from(list?.querySelectorAll("li") ?? []).map(
                (li) => li.textContent?.trim(),
            );
            expect(texts).toContain("Ukrainian — native");
            expect(texts).toContain("English — B2");
            expect(texts).toContain("Czech — C1");
        });

        it("each language item text is exactly '<Name> — <level>' with single spaces (uk)", () => {
            renderWithIntl(<About />, { locale: "uk" });
            const heading = screen.getByRole("heading", {
                level: 3,
                name: "Мови",
            });
            const list = heading.nextElementSibling;
            expect(list).not.toBeNull();
            const texts = Array.from(list?.querySelectorAll("li") ?? []).map(
                (li) => li.textContent?.trim(),
            );
            expect(texts).toContain("українська — рідна");
            expect(texts).toContain("англійська — B2");
            expect(texts).toContain("чеська — C1");
        });

        it("accordion trigger accessible name does not contain the language names", () => {
            renderWithIntl(<About />);
            const trigger = screen.getByRole("button", {
                name: /Long story short/,
            });
            const name =
                trigger.getAttribute("aria-label") ?? trigger.textContent ?? "";
            expect(name).not.toMatch(/Ukrainian/);
            expect(name).not.toMatch(/English/);
            expect(name).not.toMatch(/Czech/);
        });
    });
});
