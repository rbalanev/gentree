import { Handle, Position } from 'reactflow'

export default function PersonNode({ data }) {
  const { name, surname, birth_year, gender } = data
  const initials = `${name?.[0] || ''}${surname?.[0] || ''}`

  return (
    <div className={`person-node ${gender}`}>
      <div className="person-avatar">{initials}</div>
      <div className="person-info">
        <span className="person-name">{name} {surname}</span>
        {birth_year && <span className="person-year">р. {birth_year}</span>}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
