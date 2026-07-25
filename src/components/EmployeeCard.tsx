import type { Employee } from '../types';

interface EmployeeCardProps {
    employee: Employee;
    onSelect?: (employee: Employee) => void;
}

const statusColors: Record<string, string> = {
    active: "#dcfce7",
    inactive: "#fee2e2",
    on_leave: "#fef9c3",
};

const statusLabels: Record<string, string> = {
    active: "Activo",
    inactive: "Inactivo",
    on_leave: "Permiso",
};

function EmployeeCard({ employee, onSelect }: EmployeeCardProps) {
    const { name, position, department, status, avatarUrl } = employee;

    return (
        <div
            onClick={() => onSelect?.(employee)}
            style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                maxWidth: '300px',
                cursor: onSelect ? 'pointer' : 'default',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', overflow: 'hidden'
                }}>
                    {avatarUrl
                        ? <img src={avatarUrl} alt={`Avatar de ${name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : name.charAt(0).toUpperCase()
                    }
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{name}</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '14px', color: '#64748b' }}>{position}</p>
                </div>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                    background: '#dbeafe', color: '#1d4ed8',
                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px'
                }}>
                    {department}
                </span>
                <span style={{
                    background: statusColors[ status ],
                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px'
                }}>
                    {statusLabels[ status ]}
                </span>
            </div>
        </div>
    );
}

export default EmployeeCard;