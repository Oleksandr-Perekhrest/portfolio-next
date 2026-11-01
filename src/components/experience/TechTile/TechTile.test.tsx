// outsource dependencies
import { it, expect, describe } from "@jest/globals";
import {
    act,
    screen,
    within,
    waitFor,
    fireEvent,
} from "@testing-library/react";

// local dependencies
import TechTile from "./TechTile";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("TechTile (frontend)", () => {
    it('has accessible name "Show all Frontend technologies"', () => {
        renderWithIntl(<TechTile area="frontend" />);
        expect(
            screen.getByRole("button", {
                name: "Show all Frontend technologies",
            }),
        ).toBeInTheDocument();
    });

    it('shows top-5 summary and "+ 16 more"', () => {
        renderWithIntl(<TechTile area="frontend" />);
        expect(
            screen.getByText(
                "React · Next.js · TypeScript · Redux · React Native",
            ),
        ).toBeInTheDocument();
        expect(screen.getByText("+ 16 more")).toBeInTheDocument();
    });

    it('uk locale shows "+ ще 16"', () => {
        renderWithIntl(<TechTile area="frontend" />, { locale: "uk" });
        expect(screen.getByText("+ ще 16")).toBeInTheDocument();
    });

    it('clicking the tile opens a dialog named "Frontend"', () => {
        renderWithIntl(<TechTile area="frontend" />);
        const tile = screen.getByRole("button", {
            name: "Show all Frontend technologies",
        });
        fireEvent.click(tile);
        expect(
            screen.getByRole("dialog", { name: "Frontend" }),
        ).toBeInTheDocument();
    });

    it('dialog contains a list named "Frontend technologies" with 21 items including "Git"', () => {
        renderWithIntl(<TechTile area="frontend" />);
        fireEvent.click(
            screen.getByRole("button", {
                name: "Show all Frontend technologies",
            }),
        );
        const list = screen.getByRole("list", {
            name: "Frontend technologies",
        });
        const items = within(list).getAllByRole("listitem");
        expect(items).toHaveLength(21);
        expect(items.some((li) => li.textContent === "Git")).toBe(true);
    });

    it("Escape closes the dialog and returns focus to the tile", async () => {
        renderWithIntl(<TechTile area="frontend" />);
        const tile = screen.getByRole("button", {
            name: "Show all Frontend technologies",
        });
        tile.focus();
        await act(async () => {
            fireEvent.click(tile);
        });
        expect(
            screen.getByRole("dialog", { name: "Frontend" }),
        ).toBeInTheDocument();
        await act(async () => {
            fireEvent.keyDown(document.body, { key: "Escape" });
        });
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        await waitFor(() => expect(document.activeElement).toBe(tile));
    });

    it("Close button closes the dialog", () => {
        renderWithIntl(<TechTile area="frontend" />);
        fireEvent.click(
            screen.getByRole("button", {
                name: "Show all Frontend technologies",
            }),
        );
        expect(
            screen.getByRole("dialog", { name: "Frontend" }),
        ).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
