// outsource dependencies
import { screen, fireEvent } from "@testing-library/react";
import { it, jest, expect, describe } from "@jest/globals";

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

    it("renders the download attribute when download prop is set", () => {
        renderWithIntl(
            <ButtonLink href="/test.pdf" variant="primary" download>
                Download
            </ButtonLink>,
        );
        expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
            "download",
        );
    });

    it("does not render download attribute when download prop is absent", () => {
        renderWithIntl(
            <ButtonLink href="/test.pdf" variant="primary">
                No download
            </ButtonLink>,
        );
        expect(
            screen.getByRole("link", { name: "No download" }),
        ).not.toHaveAttribute("download");
    });

    it("calls onClick when the link is clicked", () => {
        const handleClick = jest.fn();
        renderWithIntl(
            <ButtonLink href="/test" variant="primary" onClick={handleClick}>
                Click
            </ButtonLink>,
        );
        fireEvent.click(screen.getByRole("link", { name: "Click" }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
