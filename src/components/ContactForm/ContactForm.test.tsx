// outsource dependencies
import { screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
import {
    it,
    jest,
    expect,
    describe,
    afterEach,
    beforeEach,
} from "@jest/globals";

// local dependencies
import Contact from "../Contact/Contact";
import { renderWithIntl } from "@/test/renderWithIntl";
import { sendContactMessage } from "@/lib/contact/actions";

describe("ContactForm", () => {
    beforeEach(() => {
        jest.mocked(sendContactMessage).mockReset();
    });

    afterEach(() => {
        cleanup();
    });

    describe("en locale", () => {
        it("clicking 'Email me' opens a dialog titled 'Email me'", async () => {
            renderWithIntl(<Contact />);
            fireEvent.click(screen.getByRole("button", { name: "Email me" }));
            await waitFor(() => {
                expect(
                    screen.getByRole("dialog", { name: "Email me" }),
                ).toBeInTheDocument();
            });
        });

        it("submitting empty form shows all three errors, sets aria attributes, does not call sendContactMessage, and focuses name", async () => {
            renderWithIntl(<Contact />);
            fireEvent.click(screen.getByRole("button", { name: "Email me" }));
            await waitFor(() => screen.getByRole("dialog"));

            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );

            await waitFor(() => {
                expect(
                    screen.getByText("Enter your name (up to 100 characters)"),
                ).toBeInTheDocument();
                expect(
                    screen.getByText("Enter a valid email address"),
                ).toBeInTheDocument();
                expect(
                    screen.getByText("Message must be 10 to 2000 characters"),
                ).toBeInTheDocument();
            });

            const nameInput = screen.getByRole("textbox", { name: "Name" });
            const emailInput = screen.getByRole("textbox", { name: "Email" });
            const messageInput = screen.getByRole("textbox", {
                name: "Message",
            });

            expect(nameInput).toHaveAttribute("aria-invalid", "true");
            expect(emailInput).toHaveAttribute("aria-invalid", "true");
            expect(messageInput).toHaveAttribute("aria-invalid", "true");

            const nameErrorId = nameInput.getAttribute("aria-describedby")!;
            expect(document.getElementById(nameErrorId)).toHaveTextContent(
                "Enter your name (up to 100 characters)",
            );
            const emailErrorId = emailInput.getAttribute("aria-describedby")!;
            expect(document.getElementById(emailErrorId)).toHaveTextContent(
                "Enter a valid email address",
            );
            const messageErrorId =
                messageInput.getAttribute("aria-describedby")!;
            expect(document.getElementById(messageErrorId)).toHaveTextContent(
                "Message must be 10 to 2000 characters",
            );

            expect(jest.mocked(sendContactMessage)).not.toHaveBeenCalled();
            await waitFor(() => expect(nameInput).toHaveFocus());
        });

        it("typing a valid name after empty submit removes only the name error", async () => {
            renderWithIntl(<Contact />);
            fireEvent.click(screen.getByRole("button", { name: "Email me" }));
            await waitFor(() => screen.getByRole("dialog"));

            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );

            await waitFor(() => {
                expect(
                    screen.getByText("Enter your name (up to 100 characters)"),
                ).toBeInTheDocument();
            });

            fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
                target: { value: "Alice" },
            });

            await waitFor(() => {
                expect(
                    screen.queryByText(
                        "Enter your name (up to 100 characters)",
                    ),
                ).not.toBeInTheDocument();
            });

            expect(
                screen.getByText("Enter a valid email address"),
            ).toBeInTheDocument();
            expect(
                screen.getByText("Message must be 10 to 2000 characters"),
            ).toBeInTheDocument();
        });
    });

    describe("uk locale", () => {
        it("empty submit shows Ukrainian name error", async () => {
            renderWithIntl(<Contact />, { locale: "uk" });
            fireEvent.click(
                screen.getByRole("button", { name: "Написати мені" }),
            );
            await waitFor(() => screen.getByRole("dialog"));

            fireEvent.click(
                screen.getByRole("button", { name: "Надіслати повідомлення" }),
            );

            await waitFor(() => {
                expect(
                    screen.getByText("Вкажіть ім’я (до 100 символів)"),
                ).toBeInTheDocument();
            });
        });
    });
});
