// outsource dependencies
import { screen, waitFor, fireEvent } from "@testing-library/react";
import {
    it,
    jest,
    expect,
    describe,
    afterEach,
    beforeEach,
} from "@jest/globals";

// local dependencies
import CvActions from "./CvActions";
import { breakpoints } from "@/lib/breakpoints";
import { renderWithIntl } from "@/test/renderWithIntl";

const EN_PDF = "/cv/CV-Perekhrest-Oleksandr-Web-Developer-EN.pdf";
const UK_PDF = "/cv/CV-Perekhrest-Oleksandr-Web-Developer-UA.pdf";

function mockMatchMedia(matches: boolean): void {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: jest.fn(() => ({
            matches,
            media: `(width >= ${breakpoints.tablet}px)`,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
}

describe("CvActions", () => {
    beforeEach(() => {
        mockMatchMedia(true);
    });

    afterEach(() => {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            configurable: true,
            value: undefined,
        });
    });

    describe("link hrefs and attributes", () => {
        it("en: View CV link has the EN PDF href and target=_blank", () => {
            renderWithIntl(<CvActions />);
            const link = screen.getByRole("link", { name: /View CV/ });
            expect(link).toHaveAttribute("href", EN_PDF);
            expect(link).toHaveAttribute("target", "_blank");
        });

        it("en: Download PDF link has the EN PDF href and a download attribute", () => {
            renderWithIntl(<CvActions />);
            const link = screen.getByRole("link", { name: /Download PDF/ });
            expect(link).toHaveAttribute("href", EN_PDF);
            expect(link).toHaveAttribute("download");
        });

        it("uk: View CV link points to the UA PDF", () => {
            renderWithIntl(<CvActions />, { locale: "uk" });
            const link = screen.getByRole("link", { name: /Переглянути CV/ });
            expect(link).toHaveAttribute("href", UK_PDF);
        });

        it("uk: Download PDF link points to the UA PDF and has a download attribute", () => {
            renderWithIntl(<CvActions />, { locale: "uk" });
            const link = screen.getByRole("link", { name: /Завантажити PDF/ });
            expect(link).toHaveAttribute("href", UK_PDF);
            expect(link).toHaveAttribute("download");
        });
    });

    it("no iframe is in the document before the dialog is opened", () => {
        renderWithIntl(<CvActions />);
        expect(screen.queryByTitle("CV")).not.toBeInTheDocument();
    });

    it("wide + plain click: event is prevented and dialog opens with CV title and iframe src", async () => {
        renderWithIntl(<CvActions />);
        const viewLink = screen.getByRole("link", { name: /View CV/ });
        expect(fireEvent.click(viewLink)).toBe(false);
        await waitFor(() =>
            expect(
                screen.getByRole("dialog", { name: "CV" }),
            ).toBeInTheDocument(),
        );
        const iframe = screen.getByTitle("CV");
        expect(iframe).toHaveAttribute("src", EN_PDF);
    });

    it("narrow + plain click: event is not prevented and no dialog opens", () => {
        mockMatchMedia(false);
        renderWithIntl(<CvActions />);
        const viewLink = screen.getByRole("link", { name: /View CV/ });
        expect(fireEvent.click(viewLink)).toBe(true);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("wide + Cmd click: event is not prevented and no dialog opens", () => {
        renderWithIntl(<CvActions />);
        const viewLink = screen.getByRole("link", { name: /View CV/ });
        expect(fireEvent.click(viewLink, { metaKey: true })).toBe(true);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("wide + Ctrl click: event is not prevented and no dialog opens", () => {
        renderWithIntl(<CvActions />);
        const viewLink = screen.getByRole("link", { name: /View CV/ });
        expect(fireEvent.click(viewLink, { ctrlKey: true })).toBe(true);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("dialog closes when the close button is clicked", async () => {
        renderWithIntl(<CvActions />);
        fireEvent.click(screen.getByRole("link", { name: /View CV/ }));
        await waitFor(() =>
            expect(
                screen.getByRole("dialog", { name: "CV" }),
            ).toBeInTheDocument(),
        );
        fireEvent.click(screen.getByRole("button", { name: "Close" }));
        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
    });

    it("dialog closes when Escape is pressed", async () => {
        renderWithIntl(<CvActions />);
        fireEvent.click(screen.getByRole("link", { name: /View CV/ }));
        await waitFor(() =>
            expect(
                screen.getByRole("dialog", { name: "CV" }),
            ).toBeInTheDocument(),
        );
        fireEvent.keyDown(document.body, { key: "Escape" });
        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
    });
});
