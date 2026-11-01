// local dependencies
import styles from "./SectionTitle.module.scss";

interface SectionTitleProps {
    children: React.ReactNode;
    id?: string;
}

export default function SectionTitle({ children, id }: SectionTitleProps) {
    return (
        <h2 id={id} className={styles.title}>
            {children}
        </h2>
    );
}
