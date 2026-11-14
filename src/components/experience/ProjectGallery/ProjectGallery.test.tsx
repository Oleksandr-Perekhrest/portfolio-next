// outsource dependencies
import { it, expect, describe } from "@jest/globals";
import { screen, within, fireEvent } from "@testing-library/react";

// local dependencies
import en from "../../../../messages/en.json";
import uk from "../../../../messages/uk.json";
import ProjectGallery from "./ProjectGallery";
import { projects } from "@/content/projects";
import { renderWithIntl } from "@/test/renderWithIntl";
import { commercial, roleLabels } from "@/content/commercial";

const totalSlides = commercial.length + projects.length;
const firstCommercial = commercial[0]!;
const firstPersonal = projects[0]!;

describe("ProjectGallery (merged carousel)", () => {
    it("data: commercial and personal items are both non-empty", () => {
        expect(commercial.length).toBeGreaterThan(0);
        expect(projects.length).toBeGreaterThan(0);
    });

    it("shows counter label on the first slide", () => {
        renderWithIntl(<ProjectGallery />);
        expect(
            document.querySelector('[aria-live="polite"]'),
        ).toHaveTextContent(`Project 1 / ${totalSlides}`);
    });

    it("Previous project is disabled on the first slide", () => {
        renderWithIntl(<ProjectGallery />);
        expect(
            screen.getByRole("button", { name: "Previous project" }),
        ).toBeDisabled();
    });

    it("Next project disables on the last slide", () => {
        renderWithIntl(<ProjectGallery />);
        for (let i = 0; i < totalSlides - 1; i++) {
            fireEvent.click(
                screen.getByRole("button", { name: "Next project" }),
            );
        }
        expect(
            screen.getByRole("button", { name: "Next project" }),
        ).toBeDisabled();
    });

    it("first slide is commercial: shows h3 title and role label", () => {
        renderWithIntl(<ProjectGallery />);
        const heading = screen.getByRole("heading", {
            name: en.Experience.commercial.items[firstCommercial.id],
        });
        expect(heading).toBeInTheDocument();
        // scope role text to the active slide container to avoid matching hidden slides
        expect(
            within(
                heading.closest('[class*="item"]') ?? document.body,
            ).getByText(roleLabels[firstCommercial.role]),
        ).toBeInTheDocument();
    });

    it("commercial slide shows no Live demo or GitHub links", () => {
        renderWithIntl(<ProjectGallery />);
        expect(
            screen.queryByRole("link", { name: /Live demo/ }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: /GitHub/ }),
        ).not.toBeInTheDocument();
    });

    it("commercial slide stack tags are rendered as list items", () => {
        renderWithIntl(<ProjectGallery />);
        const liTexts = screen
            .getAllByRole("listitem")
            .map((li) => li.textContent);
        for (const tag of firstCommercial.stack) {
            expect(liTexts).toContain(tag);
        }
    });

    it("NDA hint text is in the document on the first (commercial) slide", () => {
        renderWithIntl(<ProjectGallery />);
        expect(
            screen.getAllByText(en.Experience.commercial.ndaHint).length,
        ).toBeGreaterThan(0);
    });

    it("navigating past all commercial slides shows the first personal project", () => {
        renderWithIntl(<ProjectGallery />);
        for (let i = 0; i < commercial.length; i++) {
            fireEvent.click(
                screen.getByRole("button", { name: "Next project" }),
            );
        }
        expect(
            screen.getByRole("heading", { name: firstPersonal.name }),
        ).toBeInTheDocument();
        expect(
            document.querySelector('[aria-live="polite"]'),
        ).toHaveTextContent(
            `Project ${commercial.length + 1} / ${totalSlides}`,
        );
    });

    it('"Live demo" link on personal slide has correct href, target, rel', () => {
        renderWithIntl(<ProjectGallery />);
        for (let i = 0; i < commercial.length; i++) {
            fireEvent.click(
                screen.getByRole("button", { name: "Next project" }),
            );
        }
        const link = screen.getByRole("link", {
            name: "Live demo (opens in a new tab)",
        });
        expect(link).toHaveAttribute("href", firstPersonal.demoUrl);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it('"GitHub" link on personal slide has correct href, target, rel', () => {
        renderWithIntl(<ProjectGallery />);
        for (let i = 0; i < commercial.length; i++) {
            fireEvent.click(
                screen.getByRole("button", { name: "Next project" }),
            );
        }
        const link = screen.getByRole("link", {
            name: "GitHub (opens in a new tab)",
        });
        expect(link).toHaveAttribute("href", firstPersonal.repoUrl);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("personal slide renders screenshot with its localized alt text (en)", () => {
        renderWithIntl(<ProjectGallery />);
        for (let i = 0; i < commercial.length; i++) {
            fireEvent.click(
                screen.getByRole("button", { name: "Next project" }),
            );
        }
        expect(
            screen.getByRole("img", {
                name: en.Experience.projects[firstPersonal.id].imageAlt,
            }),
        ).toBeInTheDocument();
    });

    it("personal slide renders screenshot with its localized alt text (uk)", () => {
        renderWithIntl(<ProjectGallery />, { locale: "uk" });
        for (let i = 0; i < commercial.length; i++) {
            fireEvent.click(
                screen.getByRole("button", { name: "Наступний проєкт" }),
            );
        }
        expect(
            screen.getByRole("img", {
                name: uk.Experience.projects[firstPersonal.id].imageAlt,
            }),
        ).toBeInTheDocument();
    });

    it("only the active item is visible; inactive has aria-hidden and inert", () => {
        renderWithIntl(<ProjectGallery />);
        const firstHeading = screen.getByRole("heading", {
            name: en.Experience.commercial.items[firstCommercial.id],
        });
        expect(firstHeading.closest("[aria-hidden]")).toBeNull();

        // hidden: true required because the inactive item carries aria-hidden="true"
        const secondTitle = en.Experience.commercial.items[commercial[1]!.id];
        const secondHeading = screen.getByRole("heading", {
            name: secondTitle,
            hidden: true,
        });
        expect(secondHeading.closest('[aria-hidden="true"]')).not.toBeNull();

        fireEvent.click(screen.getByRole("button", { name: "Next project" }));

        expect(firstHeading.closest('[aria-hidden="true"]')).not.toBeNull();
        expect(secondHeading.closest("[aria-hidden]")).toBeNull();
    });

    it("clicking Previous after Next goes back to the first slide", () => {
        renderWithIntl(<ProjectGallery />);
        fireEvent.click(screen.getByRole("button", { name: "Next project" }));
        fireEvent.click(
            screen.getByRole("button", { name: "Previous project" }),
        );
        expect(
            document.querySelector('[aria-live="polite"]'),
        ).toHaveTextContent(`Project 1 / ${totalSlides}`);
    });
});
