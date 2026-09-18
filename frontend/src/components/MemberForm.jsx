import { useState, useEffect } from 'react'
import { createMember, updateMember } from '../api'

export default function MemberForm({ member, allMembers, onClose }) {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    birth_year: '',
    gender: 'male',
    father_id: '',
    mother_id: '',
    notes: '',
  })

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name,
        surname: member.surname,
        birth_year: member.birth_year ?? '',
        gender: member.gender,
        father_id: member.father_id ?? '',
        mother_id: member.mother_id ?? '',
        notes: member.notes ?? '',
      })
    }
  }, [member])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      father_id: form.father_id ? parseInt(form.father_id) : null,
      mother_id: form.mother_id ? parseInt(form.mother_id) : null,
    }

    try {
      if (member) {
        await updateMember(member.id, payload)
      } else {
        await createMember(payload)
      }
      onClose()
    } catch (err) {
      alert('Ошибка при сохранении: ' + (err.response?.data?.detail || err.message))
    }
  }

  const parentOptions = allMembers.filter((m) => m.id !== member?.id)

  return (
    <div className="modal-overlay" onClick={onClose}>
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
          <div className="form-row">
            <label>Год рождения</label>
            <input
              name="birth_year"
              type="number"
              min="1700"
              max="2030"
              value={form.birth_year}
              onChange={handleChange}
            />
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
          <div className="form-row">
            <label>Заметки</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Отмена
            </button>
            <button type="submit">{member ? 'Сохранить' : 'Добавить'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
