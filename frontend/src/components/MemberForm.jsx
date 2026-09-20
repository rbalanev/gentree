import { useState, useEffect } from 'react'
import { createMember, updateMember } from '../api'

export default function MemberForm({ member, allMembers, onClose }) {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    birth_year: '',
    birth_day: '',
    birth_month: '',
    gender: 'male',
    father_id: '',
    mother_id: '',
    child_ids: [],
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (member) {
      const by = member.birth_year || ''
      setForm({
        name: member.name,
        surname: member.surname,
        birth_year: by ? by.toString().slice(0, 4) : '',
        birth_day: '',
        birth_month: '',
        gender: member.gender,
        father_id: member.father_id ?? '',
        mother_id: member.mother_id ?? '',
        child_ids: [],
        notes: member.notes ?? '',
      })
    }
  }, [member])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleChildToggle = (childId) => {
    setForm((prev) => {
      const ids = prev.child_ids.includes(childId)
        ? prev.child_ids.filter((id) => id !== childId)
        : [...prev.child_ids, childId]
      return { ...prev, child_ids: ids }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setSaving(true)
    setSaved(false)
    const payload = {
      name: form.name,
      surname: form.surname,
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      gender: form.gender,
      father_id: form.father_id ? parseInt(form.father_id) : null,
      mother_id: form.mother_id ? parseInt(form.mother_id) : null,
      notes: form.notes,
    }

    try {
      if (member) {
        await updateMember(member.id, payload)
      } else {
        await createMember(payload)
      }
      // Update children links if any
      if (form.child_ids.length > 0) {
        for (const childId of form.child_ids) {
          const child = allMembers.find((m) => m.id === childId)
          if (child) {
            // Determine if this member is father or mother based on gender
            const updateData = {
              gender: form.gender,
            }
            if (form.gender === 'male') {
              updateData.father_id = member ? member.id : null
            } else {
              updateData.mother_id = member ? member.id : null
            }
            // Only update if not already set
            if (form.gender === 'male' && !child.father_id) {
              await updateMember(childId, { ...updateData })
            } else if (form.gender === 'female' && !child.mother_id) {
              await updateMember(childId, { ...updateData })
            }
          }
        }
      }
      setSaved(true)
      setTimeout(() => onClose(), 800)
    } catch (err) {
      alert('Ошибка при сохранении: ' + (err.response?.data?.detail || err.message))
    } finally {
      setSaving(false)
    }
  }

  const parentOptions = allMembers.filter((m) => m.id !== member?.id)
  // Children options: members who don't have this parent yet
  const childOptions = allMembers.filter(
    (m) =>
      m.id !== member?.id &&
      !member &&
      (!m.father_id || m.father_id !== null) &&
      (!m.mother_id || m.mother_id !== null)
  )

  return (
    <div className="modal-overlay" onContextMenu={(e) => e.preventDefault()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{member ? 'Редактировать участника' : 'Добавить участника'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Имя *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Фамилия *</label>
            <input name="surname" value={form.surname} onChange={handleChange} required />
          </div>
          <div className="form-row form-row-date">
            <label>Год рождения</label>
            <div className="date-row">
              <input
                name="birth_year"
                type="number"
                placeholder="Год"
                min="1700"
                max="2030"
                value={form.birth_year}
                onChange={handleChange}
                className="date-input year"
              />
            </div>
          </div>
          <div className="form-row">
            <label>Пол *</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div className="form-row">
            <label>Отец</label>
            <select name="father_id" value={form.father_id} onChange={handleChange}>
              <option value="">— Нет —</option>
              {parentOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} {o.surname}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Мать</label>
            <select name="mother_id" value={form.mother_id} onChange={handleChange}>
              <option value="">— Нет —</option>
              {parentOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} {o.surname}
                </option>
              ))}
            </select>
          </div>
          {!member && form.child_ids.length > 0 && (
            <div className="form-row">
              <label>Дети (будут привязаны к этому участнику)</label>
              <div className="child-checks">
                {allMembers
                  .filter((m) => m.id !== member?.id && !form.child_ids.includes(m.id))
                  .map((m) => (
                    <label key={m.id} className="child-check">
                      <input
                        type="checkbox"
                        checked={form.child_ids.includes(m.id)}
                        onChange={() => handleChildToggle(m.id)}
                      />
                      {m.name} {m.surname}
                    </label>
                  ))}
              </div>
            </div>
          )}
          {member && form.child_ids.length > 0 && (
            <div className="form-row">
              <label>Дети (будут привязаны к этому участнику)</label>
              <div className="child-checks">
                {allMembers
                  .filter((m) => m.id !== member?.id && !form.child_ids.includes(m.id))
                  .map((m) => (
                    <label key={m.id} className="child-check">
                      <input
                        type="checkbox"
                        checked={form.child_ids.includes(m.id)}
                        onChange={() => handleChildToggle(m.id)}
                      />
                      {m.name} {m.surname}
                    </label>
                  ))}
              </div>
            </div>
          )}
          <div className="form-row">
            <label>Заметки</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Отмена
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Сохранение...' : saved ? '✓ Сохранено!' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
