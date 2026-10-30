// outsource dependencies
import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";

// local dependencies
import Home from "./page";

test("renders h1 with author name", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});
