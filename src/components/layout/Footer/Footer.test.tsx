// outsource dependencies
import { it, expect, describe } from "@jest/globals";
import { render, screen } from "@testing-library/react";

// local dependencies
import Footer from "./Footer";

describe("Footer", () => {
    it("renders the current year", () => {
        render(<Footer />);
        const year = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    });

    it("renders the built-with line", () => {
        render(<Footer />);
        expect(screen.getByText(/Built with Next\.js/)).toBeInTheDocument();
    });
});
