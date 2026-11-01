// outsource dependencies
import { screen, cleanup } from "@testing-library/react";
import { it, expect, describe, afterEach } from "@jest/globals";

// local dependencies
import Contact from "./Contact";
import { contacts } from "@/content/contacts";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("Contact", () => {
    afterEach(cleanup);

    describe("en locale", () => {
        it("renders h2 section title 'Contact'", () => {
            renderWithIntl(<Contact />);
            expect(
                screen.getByRole("heading", { level: 2, name: "Contact" }),
            ).toBeInTheDocument();
        });

        it("renders h3 'Get in touch'", () => {
            renderWithIntl(<Contact />);
            expect(
                screen.getByRole("heading", {
                    level: 3,
                    name: "Get in touch",
                }),
            ).toBeInTheDocument();
        });

        it("renders the lead text", () => {
            renderWithIntl(<Contact />);
            expect(
                screen.getByText(/Open to frontend and full-stack roles/),
            ).toBeInTheDocument();
        });

        it("links appear in order Telegram, LinkedIn, GitHub with correct hrefs", () => {
            renderWithIntl(<Contact />);
            const links = screen.getAllByRole("link", {
                name: /opens in a new tab/,
            });
            expect(links).toHaveLength(3);
            expect(links[0]).toHaveAttribute("href", contacts.telegram);
            expect(links[1]).toHaveAttribute("href", contacts.linkedin);
            expect(links[2]).toHaveAttribute("href", contacts.github);
        });

        it("all links open in a new tab with rel='noopener noreferrer'", () => {
            renderWithIntl(<Contact />);
            for (const link of screen.getAllByRole("link", {
                name: /opens in a new tab/,
            })) {
                expect(link).toHaveAttribute("target", "_blank");
                expect(link).toHaveAttribute("rel", "noopener noreferrer");
            }
        });

        it("Telegram link has accessible name 'Telegram (opens in a new tab)'", () => {
            renderWithIntl(<Contact />);
            expect(
                screen.getByRole("link", {
                    name: "Telegram (opens in a new tab)",
                }),
            ).toBeInTheDocument();
        });

        it("LinkedIn link has accessible name 'LinkedIn profile (opens in a new tab)'", () => {
            renderWithIntl(<Contact />);
            expect(
                screen.getByRole("link", {
                    name: "LinkedIn profile (opens in a new tab)",
                }),
            ).toBeInTheDocument();
        });

        it("GitHub link has accessible name 'GitHub profile (opens in a new tab)'", () => {
            renderWithIntl(<Contact />);
            expect(
                screen.getByRole("link", {
                    name: "GitHub profile (opens in a new tab)",
                }),
            ).toBeInTheDocument();
        });
    });

    describe("uk locale", () => {
        it("renders section title 'Контакти'", () => {
            renderWithIntl(<Contact />, { locale: "uk" });
            expect(
                screen.getByRole("heading", { level: 2, name: "Контакти" }),
            ).toBeInTheDocument();
        });

        it("renders h3 containing 'Зв'язок'", () => {
            renderWithIntl(<Contact />, { locale: "uk" });
            expect(
                screen.getByRole("heading", { level: 3, name: /Зв’язок/ }),
            ).toBeInTheDocument();
        });
    });
});
