// outsource dependencies
import { it, expect, describe } from "@jest/globals";
import { screen, fireEvent } from "@testing-library/react";

// local dependencies
import en from "../../../../messages/en.json";
import CommercialGallery from "./CommercialGallery";
import { renderWithIntl } from "@/test/renderWithIntl";
import { commercial, roleLabels } from "@/content/commercial";

const total = commercial.length;
const first = commercial[0]!;
const last = commercial.at(-1)!;
const firstTitle = en.Experience.commercial.items[first.id];
const lastTitle = en.Experience.commercial.items[last.id];
const firstStack = [...first.stack].join(" · ");

describe("CommercialGallery", () => {
    it("data is non-trivial", () => {
        expect(commercial.length).toBeGreaterThan(1);
    });

    it("initial state: label, title, role, stack; Previous is disabled", () => {
        renderWithIntl(<CommercialGallery />);
        expect(
            screen.getByText(`Commercial · 1 / ${total}`),
        ).toBeInTheDocument();
        expect(screen.getByText(firstTitle)).toBeInTheDocument();
        expect(screen.getByText(roleLabels[first.role])).toBeInTheDocument();
        expect(screen.getByText(firstStack)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    });

    it("Next disables on the last item", () => {
        renderWithIntl(<CommercialGallery />);
        for (let i = 0; i < total - 1; i++) {
            fireEvent.click(screen.getByRole("button", { name: "Next" }));
        }
        expect(screen.getByText(lastTitle)).toBeInTheDocument();
        expect(
            screen.getByText(`Commercial · ${total} / ${total}`),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    it("clicking Previous after Next goes back to first item", () => {
        renderWithIntl(<CommercialGallery />);
        fireEvent.click(screen.getByRole("button", { name: "Next" }));
        fireEvent.click(screen.getByRole("button", { name: "Previous" }));
        expect(screen.getByText(firstTitle)).toBeInTheDocument();
        expect(
            screen.getByText(`Commercial · 1 / ${total}`),
        ).toBeInTheDocument();
    });

    it("NDA hint text is in the document", () => {
        renderWithIntl(<CommercialGallery />);
        expect(
            screen.getByText("Under NDA: no company names or screenshots"),
        ).toBeInTheDocument();
    });

    it(`uk locale shows "Комерційний досвід · 1 / ${total}"`, () => {
        renderWithIntl(<CommercialGallery />, { locale: "uk" });
        expect(
            screen.getByText(`Комерційний досвід · 1 / ${total}`),
        ).toBeInTheDocument();
    });
});
