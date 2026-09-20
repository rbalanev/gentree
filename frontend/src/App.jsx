import { useState, useEffect } from 'react'
import { useMembers } from './hooks/useMembers'
import Header from './components/Header'
import MemberList from './components/MemberList'
import TreeView from './components/TreeView'
import MemberForm from './components/MemberForm'

function App() {
  const { members, loading, error, refetch } = useMembers()
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  // Auto-refresh every 5 seconds to detect external changes
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5000)
    return () => clearInterval(interval)
  }, [refetch])

  const handleAdd = () => {
    setEditingMember(null)
    setShowForm(true)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingMember(null)
    refetch()
  }

  return (
    <div className="app">
      <Header />
      <div className="app-layout">
        <MemberList
          members={members}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onAdd={handleAdd}
        />
        <TreeView members={members} loading={loading} />
      </div>
      {showForm && (
        <MemberForm member={editingMember} allMembers={members} onClose={handleFormClose} />
      )}
    </div>
  )
}

export default App
