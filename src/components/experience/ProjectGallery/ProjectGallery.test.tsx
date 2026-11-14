// outsource dependencies
import { it, expect, describe, afterEach } from "@jest/globals";
import { screen, cleanup, fireEvent } from "@testing-library/react";

// local dependencies
import en from "../../../../messages/en.json";
import uk from "../../../../messages/uk.json";
import ProjectGallery from "./ProjectGallery";
import { renderWithIntl } from "@/test/renderWithIntl";
import { projects, type Project } from "@/content/projects";
import {
    commercial,
    roleLabels,
    type CommercialProject,
} from "@/content/commercial";

// ── Fixtures ─────────────────────────────────────────────────────────────────
const C1: CommercialProject = {
    id: "healthcare",
    role: "frontend",
    stack: ["React", "Bootstrap"],
};
const C2: CommercialProject = {
    id: "hrm",
    role: "fullstack",
    stack: ["Next.js", "Prisma"],
};
const P1: Project = {
    id: "authkit",
    name: "fixture-app-one",
    repoUrl: "https://github.com/testuser/fixture-app-one",
    demoUrl: "https://fixture-one.example.com",
    stack: ["Next.js", "Express"],
    image: "/projects/authkit.webp",
};
const P2: Project = {
    id: "inventory",
    name: "fixture-app-two",
    repoUrl: "https://github.com/testuser/fixture-app-two",
    demoUrl: "https://fixture-two.example.com",
    stack: ["React", "RTK Query"],
    image: "/projects/inventory.webp",
};

// Helper: click Next n times
function clickNext(n: number) {
    for (let i = 0; i < n; i++) {
        fireEvent.click(screen.getByRole("button", { name: "Next project" }));
    }
}

// Helper: get the aria-live counter region
function counterEl() {
    return document.querySelector('[aria-live="polite"]');
}

// ── Real-data smoke test ──────────────────────────────────────────────────────
describe("ProjectGallery – real data smoke", () => {
    afterEach(cleanup);

    it("commercial and projects are both non-empty and default render shows first commercial title", () => {
        expect(commercial.length).toBeGreaterThan(0);
        expect(projects.length).toBeGreaterThan(0);
        renderWithIntl(<ProjectGallery />);
        expect(
            screen.getByRole("heading", {
                name: en.Experience.commercial.items[commercial[0]!.id],
            }),
        ).toBeInTheDocument();
    });
});

// ── Fixture-based unit tests ──────────────────────────────────────────────────
describe("ProjectGallery – fixtures", () => {
    afterEach(cleanup);

    // ── Order ─────────────────────────────────────────────────────────────────

    it("order: first slide is commercial", () => {
        renderWithIntl(
            <ProjectGallery
                commercialItems={[C1, C2]}
                personalProjects={[P1]}
            />,
        );
        expect(
            screen.getByRole("heading", {
                name: en.Experience.commercial.items[C1.id],
            }),
        ).toBeInTheDocument();
    });

    it("order: slide after last commercial is personal", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        clickNext(1);
        expect(
            screen.getByRole("heading", { name: P1.name }),
        ).toBeInTheDocument();
    });

    // ── Counter ───────────────────────────────────────────────────────────────

    it('counter: shows "Project 1 / N" on first slide where N equals fixture total', () => {
        // 2 commercial + 2 personal = 4 total
        renderWithIntl(
            <ProjectGallery
                commercialItems={[C1, C2]}
                personalProjects={[P1, P2]}
            />,
        );
        expect(counterEl()).toHaveTextContent("Project 1 / 4");
    });

    it("counter: updates to 2 / 2 after clicking Next on a 2-slide fixture", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        expect(counterEl()).toHaveTextContent("Project 1 / 2");
        clickNext(1);
        expect(counterEl()).toHaveTextContent("Project 2 / 2");
    });

    // ── Badge ─────────────────────────────────────────────────────────────────

    it('badge: shows "Commercial · NDA" on first (commercial) slide', () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        // The badge span carries the NDA hint as its title attribute, making it uniquely identifiable.
        expect(
            screen.getByTitle(en.Experience.commercial.ndaHint),
        ).toBeInTheDocument();
    });

    it('badge: shows "Pet project" on personal slide', () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        clickNext(1);
        expect(screen.getByText("Pet project")).toBeInTheDocument();
    });

    it("badge: changes at the commercial/personal boundary", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        // Before: commercial badge (identified by NDA title) present, personal absent
        expect(
            screen.getByTitle(en.Experience.commercial.ndaHint),
        ).toBeInTheDocument();
        expect(screen.queryByText("Pet project")).not.toBeInTheDocument();
        clickNext(1);
        // After: commercial badge gone, personal badge present
        expect(
            screen.queryByTitle(en.Experience.commercial.ndaHint),
        ).not.toBeInTheDocument();
        expect(screen.getByText("Pet project")).toBeInTheDocument();
    });

    // ── Commercial slide content ──────────────────────────────────────────────

    it("commercial slide: shows translated title as h3", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        expect(
            screen.getByRole("heading", {
                level: 3,
                name: en.Experience.commercial.items[C1.id],
            }),
        ).toBeInTheDocument();
    });

    it("commercial slide: shows role label", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        expect(screen.getByText(roleLabels[C1.role])).toBeInTheDocument();
    });

    it("commercial slide: shows NDA placeholder text", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        expect(
            screen.getAllByText(en.Experience.commercial.ndaHint).length,
        ).toBeGreaterThan(0);
    });

    it("commercial slide: stack tags are rendered as list items", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        const liTexts = screen
            .getAllByRole("listitem")
            .map((li) => li.textContent);
        for (const tag of C1.stack) {
            expect(liTexts).toContain(tag);
        }
    });

    it('commercial slide: no "Live demo" or "GitHub" links', () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        expect(
            screen.queryByRole("link", { name: /Live demo/ }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: /GitHub/ }),
        ).not.toBeInTheDocument();
    });

    // ── Personal slide content ────────────────────────────────────────────────

    it("personal slide: shows project name as h3", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        clickNext(1);
        expect(
            screen.getByRole("heading", { level: 3, name: P1.name }),
        ).toBeInTheDocument();
    });

    it("personal slide: shows description from translations", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        clickNext(1);
        expect(
            screen.getByText(en.Experience.projects[P1.id].description),
        ).toBeInTheDocument();
    });

    it("personal slide: Live demo link has fixture demoUrl", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        clickNext(1);
        const link = screen.getByRole("link", {
            name: "Live demo (opens in a new tab)",
        });
        expect(link).toHaveAttribute("href", P1.demoUrl);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("personal slide: GitHub link has fixture repoUrl", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        clickNext(1);
        const link = screen.getByRole("link", {
            name: "GitHub (opens in a new tab)",
        });
        expect(link).toHaveAttribute("href", P1.repoUrl);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    // ── Navigation buttons ────────────────────────────────────────────────────

    it("Previous project is disabled on the first slide", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        expect(
            screen.getByRole("button", { name: "Previous project" }),
        ).toBeDisabled();
    });

    it("Next project is disabled on the last slide", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
        );
        clickNext(1);
        expect(
            screen.getByRole("button", { name: "Next project" }),
        ).toBeDisabled();
    });

    // ── UA locale ─────────────────────────────────────────────────────────────

    it("UA locale: commercial badge shows Ukrainian text", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
            { locale: "uk" },
        );
        expect(
            screen.getByTitle(uk.Experience.commercial.ndaHint),
        ).toBeInTheDocument();
    });

    it("UA locale: personal badge shows Ukrainian text", () => {
        renderWithIntl(
            <ProjectGallery commercialItems={[C1]} personalProjects={[P1]} />,
            { locale: "uk" },
        );
        fireEvent.click(
            screen.getByRole("button", { name: uk.Experience.nextProject }),
        );
        expect(
            screen.getByText(uk.Experience.personalBadge),
        ).toBeInTheDocument();
    });
});
