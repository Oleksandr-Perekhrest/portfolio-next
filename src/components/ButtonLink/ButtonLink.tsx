// outsource dependencies
import { useTranslations } from "next-intl";
import type { ReactNode, MouseEventHandler } from "react";

// local dependencies
import styles from "./ButtonLink.module.scss";

type ButtonLinkProps = {
    href: string;
    variant: "primary" | "secondary" | "inverse";
    size?: "md" | "sm";
    external?: boolean;
    download?: boolean | string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    children: ReactNode;
};

export default function ButtonLink({
    href,
    variant,
    size = "md",
    external = false,
    download,
    onClick,
    children,
}: ButtonLinkProps) {
    const t = useTranslations("ButtonLink");

    return (
        <a
            href={href}
            className={`${styles.base} ${styles[variant]}${size === "sm" ? ` ${styles.sm}` : ""}`}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            {...(download !== undefined && { download })}
            onClick={onClick}
        >
            {children}
            {external && <span className={styles.newTab}>{t("newTab")}</span>}
        </a>
    );
}
