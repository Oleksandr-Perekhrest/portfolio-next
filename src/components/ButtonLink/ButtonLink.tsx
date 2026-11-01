// outsource dependencies
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./ButtonLink.module.scss";

type ButtonLinkProps = {
    href: string;
    variant: "primary" | "secondary" | "inverse";
    size?: "md" | "sm";
    external?: boolean;
    children: ReactNode;
};

export default function ButtonLink({
    href,
    variant,
    size = "md",
    external = false,
    children,
}: ButtonLinkProps) {
    const t = useTranslations("ButtonLink");

    return (
        <a
            href={href}
            className={`${styles.base} ${styles[variant]}${size === "sm" ? ` ${styles.sm}` : ""}`}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        >
            {children}
            {external && <span className={styles.newTab}>{t("newTab")}</span>}
        </a>
    );
}
