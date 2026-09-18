export default function MemberList({ members, loading, error, onEdit, onAdd }) {
  if (loading) return <div className="sidebar">Загрузка...</div>
  if (error) return <div className="sidebar sidebar-error">Ошибка: {error}</div>

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Участники ({members.length})</h3>
        <button className="btn-add" onClick={onAdd}>
          + Добавить
        </button>
      </div>
      <ul className="member-list">
        {members.map((m) => (
          <li key={m.id} className="member-item">
            <span className="member-name">
              {m.name} {m.surname}
              {m.birth_year && <span className="member-year"> (р. {m.birth_year})</span>}
            </span>
            <div className="member-actions">
              <button className="btn-small" onClick={() => onEdit(m)}>
                Ред.
              </button>
            </div>
          </li>
        ))}
        {members.length === 0 && <li className="empty-state">Нет участников. Добавьте первого!</li>}
      </ul>
    </div>
  )
}
