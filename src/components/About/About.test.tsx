// outsource dependencies
import { it, expect, describe, afterEach } from "@jest/globals";
import { screen, cleanup, fireEvent } from "@testing-library/react";

// local dependencies
import About from "./About";
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
});
