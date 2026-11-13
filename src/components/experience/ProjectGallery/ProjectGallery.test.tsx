// outsource dependencies
import { screen, fireEvent } from "@testing-library/react";
import { it, expect, describe, afterEach, beforeEach } from "@jest/globals";

// local dependencies
import ProjectGallery from "./ProjectGallery";
import type { Project } from "@/content/projects";
import * as ProjectsModule from "@/content/projects";
import { renderWithIntl } from "@/test/renderWithIntl";

// Captured before any per-test override so the guard and href assertions stay
// anchored to the actual content file, not the mock data.
const project = ProjectsModule.projects[0]!;

const SINGLE: readonly Project[] = [
    {
        id: "authkit",
        name: "authkit-next-express",
        repoUrl: "https://github.com/Oleksandr-Perekhrest/authkit-next-express",
        demoUrl: "https://authkit-web.vercel.app",
        stack: ["Next.js", "Express", "PostgreSQL", "Docker"],
    },
];

const DOUBLE: readonly Project[] = [
    ...SINGLE,
    {
        id: "inventory",
        name: "inventory-react-rtk",
        repoUrl: "https://github.com/Oleksandr-Perekhrest/inventory-react-rtk",
        demoUrl: "https://warehouse-manager-demo.vercel.app",
        stack: ["React", "Vite", "Redux Toolkit", "RTK Query"],
    },
];

type Setter = (d: readonly Project[] | undefined) => void;

function setProjects(data: readonly Project[] | undefined) {
    (globalThis as unknown as { __setMockProjects: Setter }).__setMockProjects(
        data,
    );
}

afterEach(() => {
    setProjects(undefined);
});

describe("ProjectGallery (single project)", () => {
    beforeEach(() => {
        setProjects(SINGLE);
    });

    it("projects[0] is the expected project (guard against data reordering)", () => {
        expect(project.id).toBe("authkit");
    });

    it('shows "Featured project" label', () => {
        renderWithIntl(<ProjectGallery />);
        expect(screen.getByText("Featured project")).toBeInTheDocument();
    });

    it("shows no Previous/Next project buttons", () => {
        renderWithIntl(<ProjectGallery />);
        expect(
            screen.queryByRole("button", { name: "Previous project" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Next project" }),
        ).not.toBeInTheDocument();
    });

    it("shows no dots", () => {
        renderWithIntl(<ProjectGallery />);
        expect(document.querySelector('div[aria-hidden="true"]')).toBeNull();
    });

    it("description text is present", () => {
        renderWithIntl(<ProjectGallery />);
        expect(
            screen.getByText(/Full-stack authentication/),
        ).toBeInTheDocument();
    });

    it("stack tags are rendered as list items", () => {
        renderWithIntl(<ProjectGallery />);
        const items = screen.getAllByRole("listitem");
        const texts = items.map((li) => li.textContent);
        for (const tag of project.stack) {
            expect(texts).toContain(tag);
        }
    });

    it('"Live demo" link has correct href, target, rel, and accessible name', () => {
        renderWithIntl(<ProjectGallery />);
        const link = screen.getByRole("link", {
            name: "Live demo (opens in a new tab)",
        });
        expect(link).toHaveAttribute("href", project.demoUrl);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it('"GitHub" link has correct href, target, rel, and accessible name', () => {
        renderWithIntl(<ProjectGallery />);
        const link = screen.getByRole("link", {
            name: "GitHub (opens in a new tab)",
        });
        expect(link).toHaveAttribute("href", project.repoUrl);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
});

describe("ProjectGallery (multiple projects)", () => {
    beforeEach(() => {
        setProjects(DOUBLE);
    });

    it("shows counter label on the first item", () => {
        renderWithIntl(<ProjectGallery />);
        expect(
            document.querySelector('[aria-live="polite"]'),
        ).toHaveTextContent(`Project 1 / ${DOUBLE.length}`);
    });

    it("Previous is disabled on the first item", () => {
        renderWithIntl(<ProjectGallery />);
        expect(
            screen.getByRole("button", { name: "Previous project" }),
        ).toBeDisabled();
    });

    it("Next moves to the second item", () => {
        renderWithIntl(<ProjectGallery />);
        fireEvent.click(screen.getByRole("button", { name: "Next project" }));
        expect(
            document.querySelector('[aria-live="polite"]'),
        ).toHaveTextContent(`Project 2 / ${DOUBLE.length}`);
    });

    it("only the active item is visible; inactive has aria-hidden and inert", () => {
        renderWithIntl(<ProjectGallery />);
        const firstHeading = screen.getByRole("heading", {
            name: DOUBLE[0]!.name,
        });
        // hidden: true is required because the inactive item carries aria-hidden="true"
        const secondHeading = screen.getByRole("heading", {
            name: DOUBLE[1]!.name,
            hidden: true,
        });

        // Active item's wrapper must not carry aria-hidden
        expect(firstHeading.closest("[aria-hidden]")).toBeNull();
        // Inactive item's wrapper must carry aria-hidden="true"
        expect(secondHeading.closest('[aria-hidden="true"]')).not.toBeNull();

        fireEvent.click(screen.getByRole("button", { name: "Next project" }));

        expect(firstHeading.closest('[aria-hidden="true"]')).not.toBeNull();
        expect(secondHeading.closest("[aria-hidden]")).toBeNull();
    });
});
