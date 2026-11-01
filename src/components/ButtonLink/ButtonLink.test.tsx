// outsource dependencies
import { it, expect, describe } from "@jest/globals";
import { render, screen } from "@testing-library/react";

// local dependencies
import ButtonLink from "./ButtonLink";

describe("ButtonLink", () => {
    it("renders a link with correct href", () => {
        render(
            <ButtonLink href="/test" variant="primary">
                Click me
            </ButtonLink>,
        );
        const link = screen.getByRole("link", { name: "Click me" });
        expect(link).toHaveAttribute("href", "/test");
    });

    it("applies the variant class", () => {
        render(
            <ButtonLink href="/test" variant="primary">
                Click me
            </ButtonLink>,
        );
        const link = screen.getByRole("link", { name: "Click me" });
        expect(link.className).toContain("primary");
    });

    it("renders children", () => {
        render(
            <ButtonLink href="/test" variant="secondary">
                Secondary
            </ButtonLink>,
        );
        expect(screen.getByText("Secondary")).toBeTruthy();
    });
});
