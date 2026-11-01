type TelegramIconProps = {
    size?: number;
};

export default function TelegramIcon({ size = 18 }: TelegramIconProps) {
    return (
        <svg
            aria-hidden
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 4L3 11l6 2 2 6 3-4 5 4 2-15z" />
            <path d="M9 13l8-6" />
        </svg>
    );
}
