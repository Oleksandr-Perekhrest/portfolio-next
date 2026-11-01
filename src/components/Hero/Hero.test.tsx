// outsource dependencies
import { screen } from "@testing-library/react";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import Hero from "./Hero";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("Hero", () => {
    it("renders h1 with title", () => {
        renderWithIntl(<Hero />);
        expect(
            screen.getByRole("heading", { level: 1, name: "Web Engineer" }),
        ).toBeInTheDocument();
    });

    it("renders keywords", () => {
        renderWithIntl(<Hero />);
        expect(
            screen.getByText(
                "Full-stack · React · Next.js · Node.js · React Native",
            ),
        ).toBeInTheDocument();
    });

    it("renders lead", () => {
        renderWithIntl(<Hero />);
        expect(
            screen.getByText(/I build web and mobile products/),
        ).toBeInTheDocument();
    });

    it("link View projects has href #experience", () => {
        renderWithIntl(<Hero />);
        const link = screen.getByRole("link", { name: /View projects/ });
        expect(link).toHaveAttribute("href", "#experience");
    });
});
