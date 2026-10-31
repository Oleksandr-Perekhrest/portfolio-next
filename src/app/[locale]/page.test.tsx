// outsource dependencies
import { test, expect } from "@jest/globals";
import { screen } from "@testing-library/react";

// local dependencies
import Home from "./page";
import { renderWithIntl } from "@/test/renderWithIntl";

test("renders h1 with author name", () => {
    renderWithIntl(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});
