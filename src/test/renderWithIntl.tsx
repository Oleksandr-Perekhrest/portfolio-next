// outsource dependencies
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { RenderOptions } from "@testing-library/react";

// local dependencies
import en from "../../messages/en.json";

export function renderWithIntl(ui: ReactElement, options?: RenderOptions) {
    return render(
        <NextIntlClientProvider locale="en" messages={en}>
            {ui}
        </NextIntlClientProvider>,
        options,
    );
}
