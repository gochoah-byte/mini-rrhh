interface StatsBadgeProps {
    label: string;
    value: number;
    color?: string;
}

function StatsBadge({ label, value, color = "#2563eb" }: StatsBadgeProps) {
    return (
        <div
            style={{
                border: `2px solid ${color}`,
                borderRadius: "10px",
                width: "180px",
                padding: "20px",
                textAlign: "center",
                background: "#fff",
            }}
        >
            <h2
                style={{
                    margin: 0,
                    color,
                    fontSize: "34px",
                }}
            >
                {value}
            </h2>

            <p
                style={{
                    marginTop: "10px",
                    color: "#64748b",
                }}
            >
                {label}
            </p>
        </div>
    );
}

export default StatsBadge;