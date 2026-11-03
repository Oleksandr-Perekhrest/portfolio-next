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
import { getCloud, getTileSummary } from "@/content/tech";

describe("TechTile (frontend)", () => {
    it('has accessible name "Show all Frontend technologies"', () => {
        renderWithIntl(<TechTile area="frontend" />);
        expect(
            screen.getByRole("button", {
                name: "Show all Frontend technologies",
            }),
        ).toBeInTheDocument();
    });

    it("shows top-5 summary and rest count", () => {
        const { names, restCount } = getTileSummary("frontend");
        renderWithIntl(<TechTile area="frontend" />);
        expect(screen.getByText(names.join(" · "))).toBeInTheDocument();
        expect(screen.getByText(`+ ${restCount} more`)).toBeInTheDocument();
    });

    it("uk locale shows rest count in Ukrainian", () => {
        const { restCount } = getTileSummary("frontend");
        renderWithIntl(<TechTile area="frontend" />, { locale: "uk" });
        expect(screen.getByText(`+ ще ${restCount}`)).toBeInTheDocument();
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

    it("dialog contains all cloud items including shared techs", () => {
        const cloud = getCloud("frontend");
        const sharedItems = cloud.filter((t) => t.area === "shared");
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
        expect(items).toHaveLength(cloud.length);
        for (const shared of sharedItems) {
            expect(items.some((li) => li.textContent === shared.name)).toBe(
                true,
            );
        }
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
