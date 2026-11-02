// outsource dependencies
import {
    it,
    jest,
    expect,
    describe,
    afterEach,
    beforeEach,
} from "@jest/globals";
import {
    act,
    screen,
    within,
    cleanup,
    waitFor,
    fireEvent,
} from "@testing-library/react";

// local dependencies
import Contact from "../Contact/Contact";
import { contacts } from "@/content/contacts";
import { renderWithIntl } from "@/test/renderWithIntl";
import { sendContactMessage, type ContactResult } from "@/lib/contact/actions";

async function openAndFill() {
    renderWithIntl(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: "Email me" }));
    await waitFor(() => screen.getByRole("dialog"));
    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
        target: { value: "Alice" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
        target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
        target: { value: "Hello, I have a role for you." },
    });
}

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

    describe("submission", () => {
        it("valid submit calls sendContactMessage once with correct payload", async () => {
            jest.mocked(sendContactMessage).mockResolvedValueOnce({
                status: "success",
            });
            await openAndFill();

            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );

            await waitFor(() => {
                expect(jest.mocked(sendContactMessage)).toHaveBeenCalledTimes(
                    1,
                );
                expect(jest.mocked(sendContactMessage)).toHaveBeenCalledWith({
                    name: "Alice",
                    email: "alice@example.com",
                    message: "Hello, I have a role for you.",
                    website: "",
                    locale: "en",
                    startedAt: expect.any(Number),
                });
            });
        });

        it("while pending shows 'Sending…' and disables fields; resolves to success view", async () => {
            let resolve!: (value: ContactResult) => void;
            const pending = new Promise<ContactResult>((res) => {
                resolve = res;
            });
            jest.mocked(sendContactMessage).mockReturnValueOnce(pending);

            await openAndFill();
            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );

            await waitFor(() =>
                expect(
                    screen.getByRole("button", { name: "Sending…" }),
                ).toBeInTheDocument(),
            );
            expect(
                screen.getByRole("textbox", { name: "Name" }),
            ).toBeDisabled();
            expect(
                screen.getByRole("textbox", { name: "Email" }),
            ).toBeDisabled();
            expect(
                screen.getByRole("textbox", { name: "Message" }),
            ).toBeDisabled();

            act(() => resolve({ status: "success" }));

            await waitFor(() =>
                expect(screen.getByText("Message sent")).toBeInTheDocument(),
            );
            expect(
                screen.getByText("Thanks! I’ll get back to you soon."),
            ).toBeInTheDocument();
        });

        it("success: hides form fields and focuses Close button", async () => {
            jest.mocked(sendContactMessage).mockResolvedValueOnce({
                status: "success",
            });
            await openAndFill();
            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );

            await waitFor(() =>
                expect(screen.getByText("Message sent")).toBeInTheDocument(),
            );
            expect(
                screen.queryByRole("textbox", { name: "Name" }),
            ).not.toBeInTheDocument();

            await waitFor(() =>
                expect(
                    within(screen.getByRole("status")).getByRole("button", {
                        name: "Close",
                    }),
                ).toHaveFocus(),
            );
        });

        it("honeypot: sets website to the spam value before submitting", async () => {
            jest.mocked(sendContactMessage).mockResolvedValueOnce({
                status: "success",
            });
            await openAndFill();

            const websiteInput = document.querySelector(
                'input[name="website"]',
            ) as HTMLInputElement;
            websiteInput.value = "spam";

            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );

            await waitFor(() =>
                expect(jest.mocked(sendContactMessage)).toHaveBeenCalledWith(
                    expect.objectContaining({ website: "spam" }),
                ),
            );
        });
    });

    describe("errors", () => {
        it("unavailable status: alert with Telegram link, values stay, button disabled", async () => {
            jest.mocked(sendContactMessage).mockResolvedValueOnce({
                status: "unavailable",
            });
            await openAndFill();
            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );

            await waitFor(() =>
                expect(screen.getByRole("alert")).toBeInTheDocument(),
            );

            const alert = screen.getByRole("alert");
            expect(alert).toHaveTextContent(
                /The form is temporarily unavailable\. Message me on Telegram/,
            );

            const link = within(alert).getByRole("link", { name: /Telegram/ });
            expect(link).toHaveAttribute("href", contacts.telegram);
            expect(link).toHaveAttribute("target", "_blank");

            expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
                "Alice",
            );
            expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue(
                "alice@example.com",
            );
            expect(
                screen.getByRole("textbox", { name: "Message" }),
            ).toHaveValue("Hello, I have a role for you.");

            expect(
                screen.getByRole("button", { name: "Send message" }),
            ).toBeDisabled();
        });

        it("network error: shows the unavailability alert", async () => {
            jest.mocked(sendContactMessage).mockRejectedValueOnce(
                new Error("Network failure"),
            );
            await openAndFill();
            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );

            await waitFor(() =>
                expect(screen.getByRole("alert")).toBeInTheDocument(),
            );
            expect(screen.getByRole("alert")).toHaveTextContent(
                /The form is temporarily unavailable\. Message me on Telegram/,
            );
        });

        it("after unavailable, close and reopen: alert persists without extra submission", async () => {
            jest.mocked(sendContactMessage).mockResolvedValueOnce({
                status: "unavailable",
            });
            await openAndFill();
            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );
            await waitFor(() =>
                expect(screen.getByRole("alert")).toBeInTheDocument(),
            );

            fireEvent.click(screen.getByRole("button", { name: "Close" }));
            fireEvent.click(screen.getByRole("button", { name: "Email me" }));
            await waitFor(() => screen.getByRole("dialog"));

            expect(screen.getByRole("alert")).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Send message" }),
            ).toBeDisabled();
            expect(jest.mocked(sendContactMessage)).toHaveBeenCalledTimes(1);
        });

        it("server invalid email: error under field, aria-invalid and focus, no alert", async () => {
            jest.mocked(sendContactMessage).mockResolvedValueOnce({
                status: "invalid",
                fieldErrors: { email: ["emailInvalid"] },
            });
            await openAndFill();
            fireEvent.click(
                screen.getByRole("button", { name: "Send message" }),
            );

            await waitFor(() =>
                expect(
                    screen.getByText("Enter a valid email address"),
                ).toBeInTheDocument(),
            );

            const emailInput = screen.getByRole("textbox", { name: "Email" });
            expect(emailInput).toHaveAttribute("aria-invalid", "true");
            await waitFor(() => expect(emailInput).toHaveFocus());

            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });
    });
});
