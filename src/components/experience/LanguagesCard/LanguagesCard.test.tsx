// outsource dependencies
import { screen } from "@testing-library/react";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import LanguagesCard from "./LanguagesCard";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("LanguagesCard", () => {
    it("en locale: items in order Ukrainian native, English B2, Czech C1", () => {
        renderWithIntl(<LanguagesCard />);
        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(3);
        expect(items[0]!.textContent).toBe("Ukrainian — native");
        expect(items[1]!.textContent).toBe("English — B2");
        expect(items[2]!.textContent).toBe("Czech — C1");
    });

    it("uk locale: items use Ukrainian labels", () => {
        renderWithIntl(<LanguagesCard />, { locale: "uk" });
        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(3);
        expect(items[0]!.textContent).toBe("українська — рідна");
        expect(items[1]!.textContent).toBe("англійська — B2");
        expect(items[2]!.textContent).toBe("чеська — C1");
    });
});
