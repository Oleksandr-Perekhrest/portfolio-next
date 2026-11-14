// outsource dependencies
import { screen } from "@testing-library/react";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import Experience from "./Experience";
import en from "../../../../messages/en.json";
import { projects } from "@/content/projects";
import { commercial } from "@/content/commercial";
import { renderWithIntl } from "@/test/renderWithIntl";

const totalSlides = commercial.length + projects.length;

describe("Experience", () => {
    it("renders all key elements", () => {
        renderWithIntl(<Experience />);

        expect(
            screen.getByRole("heading", { level: 2, name: "Experience" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                level: 3,
                name: en.Experience.commercial.items[commercial[0]!.id],
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Show all Frontend technologies",
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "Show all Backend technologies",
            }),
        ).toBeInTheDocument();

        expect(
            document.querySelector('[aria-live="polite"]'),
        ).toHaveTextContent(`Project 1 / ${totalSlides}`);
    });
});
