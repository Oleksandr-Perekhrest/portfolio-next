// outsource dependencies
import type { ReactNode } from "react";

// local dependencies
import styles from "./ButtonLink.module.scss";

type ButtonLinkProps = {
    href: string;
    variant: "primary" | "secondary";
    children: ReactNode;
};

export default function ButtonLink({
    href,
    variant,
    children,
}: ButtonLinkProps) {
    return (
        <a href={href} className={`${styles.base} ${styles[variant]}`}>
            {children}
        </a>
    );
}
