// outsource dependencies
import { it, expect, describe } from "@jest/globals";
import { screen, fireEvent } from "@testing-library/react";

// local dependencies
import CommercialGallery from "./CommercialGallery";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("CommercialGallery", () => {
    it("initial state: label, title, role, stack; Previous is disabled", () => {
        renderWithIntl(<CommercialGallery />);
        expect(screen.getByText("Commercial · 1 / 2")).toBeInTheDocument();
        expect(screen.getByText("Healthcare platform")).toBeInTheDocument();
        expect(screen.getByText("Frontend")).toBeInTheDocument();
        expect(
            screen.getByText("React · React Native · Redux"),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    });

    it("clicking Next shows second item and disables Next", () => {
        renderWithIntl(<CommercialGallery />);
        fireEvent.click(screen.getByRole("button", { name: "Next" }));
        expect(screen.getByText("Internal HR system")).toBeInTheDocument();
        expect(screen.getByText("Full-stack")).toBeInTheDocument();
        expect(screen.getByText("Commercial · 2 / 2")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    it("clicking Previous after Next goes back to first item", () => {
        renderWithIntl(<CommercialGallery />);
        fireEvent.click(screen.getByRole("button", { name: "Next" }));
        fireEvent.click(screen.getByRole("button", { name: "Previous" }));
        expect(screen.getByText("Healthcare platform")).toBeInTheDocument();
        expect(screen.getByText("Commercial · 1 / 2")).toBeInTheDocument();
    });

    it("NDA hint text is in the document", () => {
        renderWithIntl(<CommercialGallery />);
        expect(
            screen.getByText("Under NDA: no company names or screenshots"),
        ).toBeInTheDocument();
    });

    it('uk locale shows "Комерційний досвід · 1 / 2"', () => {
        renderWithIntl(<CommercialGallery />, { locale: "uk" });
        expect(
            screen.getByText("Комерційний досвід · 1 / 2"),
        ).toBeInTheDocument();
    });
});
