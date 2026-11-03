// outsource dependencies
import { screen } from "@testing-library/react";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import Experience from "./Experience";
import { commercial } from "@/content/commercial";
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

        expect(screen.getByTestId("commercial-label")).toHaveTextContent(
            `Commercial · 1 / ${commercial.length}`,
        );

        expect(
            screen.getByRole("heading", { level: 3, name: "Languages" }),
        ).toBeInTheDocument();
    });
});
