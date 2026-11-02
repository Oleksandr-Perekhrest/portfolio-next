// outsource dependencies
import { it, expect, describe, afterEach } from "@jest/globals";
import { screen, cleanup, waitFor, fireEvent } from "@testing-library/react";

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

    describe("lazy dialog", () => {
        it("dialog and form fields are absent before any interaction", () => {
            renderWithIntl(<Contact />);
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Message")).not.toBeInTheDocument();
        });

        it("clicking 'Email me' opens the dialog with form fields", async () => {
            renderWithIntl(<Contact />);
            fireEvent.click(screen.getByRole("button", { name: /email me/i }));
            await screen.findByRole("dialog", { name: /email me/i });
            expect(screen.getByLabelText("Name")).toBeInTheDocument();
            expect(screen.getByLabelText("Email")).toBeInTheDocument();
            expect(screen.getByLabelText("Message")).toBeInTheDocument();
        });

        it("closing with Escape removes dialog; reopening shows it again", async () => {
            renderWithIntl(<Contact />);
            const trigger = screen.getByRole("button", { name: /email me/i });
            fireEvent.click(trigger);
            await screen.findByRole("dialog", { name: /email me/i });

            fireEvent.keyDown(document.activeElement ?? document.body, {
                key: "Escape",
                code: "Escape",
            });
            await waitFor(() =>
                expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
            );
            // focus-return is skipped: Radix schedules it via requestAnimationFrame,
            // which jsdom does not service, so the assertion never resolves.

            fireEvent.click(trigger);
            await screen.findByRole("dialog", { name: /email me/i });
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
