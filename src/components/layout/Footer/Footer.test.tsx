// outsource dependencies
import { screen } from "@testing-library/react";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import Footer from "./Footer";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("Footer", () => {
    it("renders the current year", () => {
        renderWithIntl(<Footer />);
        const year = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    });

    it("renders the built-with line", () => {
        renderWithIntl(<Footer />);
        expect(screen.getByText(/Built with Next\.js/)).toBeInTheDocument();
    });
});
