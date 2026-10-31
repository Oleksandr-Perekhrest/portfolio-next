// outsource dependencies
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { RenderOptions } from "@testing-library/react";

// local dependencies
import en from "../../messages/en.json";
import uk from "../../messages/uk.json";

type Locale = "en" | "uk";

const messages: Record<Locale, typeof en> = { en, uk };

interface IntlRenderOptions extends RenderOptions {
    locale?: Locale;
}

export function renderWithIntl(ui: ReactElement, options?: IntlRenderOptions) {
    const { locale = "en", ...renderOptions } = options ?? {};
    return render(
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
            {ui}
        </NextIntlClientProvider>,
        renderOptions,
    );
}
