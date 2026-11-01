// outsource dependencies
import { screen } from "@testing-library/react";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import Experience from "./Experience";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("Experience", () => {
    it("renders all key elements", () => {
        renderWithIntl(<Experience />);

        expect(
            screen.getByRole("heading", { level: 2, name: "Experience" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                level: 3,
                name: "authkit-next-express",
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

        expect(screen.getByText("Commercial · 1 / 2")).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { level: 3, name: "Languages" }),
        ).toBeInTheDocument();
    });
});
