import { useState, useEffect, useCallback } from 'react'
import * as api from '../api'

export function useMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.fetchMembers()
      setMembers(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { members, loading, error, refetch: load }
}
