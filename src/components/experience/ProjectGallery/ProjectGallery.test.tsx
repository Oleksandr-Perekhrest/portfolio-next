// outsource dependencies
import { screen } from "@testing-library/react";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { projects } from "@/content/projects";
import ProjectGallery from "./ProjectGallery";
import { renderWithIntl } from "@/test/renderWithIntl";

const project = projects[0]!;

describe("ProjectGallery (single project)", () => {
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
