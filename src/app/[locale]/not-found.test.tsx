// outsource dependencies
import { screen } from "@testing-library/react";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import NotFound from "./not-found";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("NotFound", () => {
    it("renders the page-not-found heading", () => {
        renderWithIntl(<NotFound />);
        expect(
            screen.getByRole("heading", { level: 1, name: /page not found/i }),
        ).toBeInTheDocument();
    });

    it("renders a link back to the home page", () => {
        renderWithIntl(<NotFound />);
        expect(
            screen.getByRole("link", { name: /go home/i }),
        ).toBeInTheDocument();
    });
});
