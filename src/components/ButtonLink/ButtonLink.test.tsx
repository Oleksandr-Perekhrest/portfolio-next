// outsource dependencies
import { screen } from "@testing-library/react";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import ButtonLink from "./ButtonLink";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("ButtonLink", () => {
    it("renders a link with correct href", () => {
        renderWithIntl(
            <ButtonLink href="/test" variant="primary">
                Click me
            </ButtonLink>,
        );
        const link = screen.getByRole("link", { name: "Click me" });
        expect(link).toHaveAttribute("href", "/test");
    });

    it("applies the variant class", () => {
        renderWithIntl(
            <ButtonLink href="/test" variant="primary">
                Click me
            </ButtonLink>,
        );
        const link = screen.getByRole("link", { name: "Click me" });
        expect(link.className).toContain("primary");
    });

    it("renders children", () => {
        renderWithIntl(
            <ButtonLink href="/test" variant="secondary">
                Secondary
            </ButtonLink>,
        );
        expect(screen.getByText("Secondary")).toBeTruthy();
    });
});
