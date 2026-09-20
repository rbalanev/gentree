import { useMemo } from 'react'
import ReactFlow, { Controls, Background, MarkerType } from 'reactflow'
import PersonNode from './PersonNode'
import 'reactflow/dist/style.css'

const nodeTypes = { person: PersonNode }

function computeTreeLayout(members) {
  if (!members || members.length === 0) return { nodes: [], edges: [] }

  // Build adjacency: parent -> children
  const childrenMap = new Map()
  const parentMap = new Map()
  members.forEach((m) => {
    childrenMap.set(m.id, [])
    if (m.father_id) {
      parentMap.set(m.id, (parentMap.get(m.id) || []).concat(m.father_id))
      childrenMap.get(m.father_id).push(m)
    }
    if (m.mother_id) {
      parentMap.set(m.id, (parentMap.get(m.id) || []).concat(m.mother_id))
      childrenMap.get(m.mother_id).push(m)
    }
  })

  // Find root nodes (no parents)
  const rootIds = members.filter((m) => !parentMap.has(m.id)).map((m) => m.id)

  // BFS to assign levels
  const levelMap = new Map()
  const queue = []

  rootIds.forEach((id) => {
    levelMap.set(id, 0)
    queue.push({ id, level: 0 })
  })

  // Also add orphan children (no parents in data) as roots
  members.forEach((m) => {
    if (!levelMap.has(m.id) && !parentMap.has(m.id)) {
      levelMap.set(m.id, 0)
      queue.push({ id: m.id, level: 0 })
    }
  })

  while (queue.length > 0) {
    const { id, level } = queue.shift()
    const children = childrenMap.get(id) || []
    children.forEach((child) => {
      if (!levelMap.has(child.id) || levelMap.get(child.id) > level + 1) {
        levelMap.set(child.id, level + 1)
        queue.push({ id: child.id, level: level + 1 })
      }
    })
  }

  // Group by level
  const levels = {}
  levelMap.forEach((level, id) => {
    if (!levels[level]) levels[level] = []
    levels[level].push(id)
  })

  // Assign positions with proper spacing
  const nodeWidth = 200
  const nodeHeight = 80
  const hGap = 40
  const vGap = 130

  // For each level, center nodes based on their parent positions
  const positionMap = new Map()

  // Level 0: center all roots
  const level0 = levels[0] || []
  const totalWidth0 = level0.length * (nodeWidth + hGap) - hGap
  const startX0 = -(totalWidth0 / 2)
  level0.forEach((id, i) => {
    positionMap.set(id, { x: startX0 + i * (nodeWidth + hGap), y: 0 })
  })

  // For subsequent levels, position children under their parents
  for (let lvl = 1; lvl < Object.keys(levels).length; lvl++) {
    const currentLevel = levels[lvl] || []
    const childrenPerGroup = new Map() // parentId -> [childIds]

    currentLevel.forEach((childId) => {
      const parents = parentMap.get(childId) || []
      parents.forEach((parentId) => {
        if (!childrenPerGroup.has(parentId)) {
          childrenPerGroup.set(parentId, [])
        }
        childrenPerGroup.get(parentId).push(childId)
      })
    })

    // Group children by their parent's position
    const positionedGroups = new Map() // positionKey -> { children, parentX }
    let groupCounter = 0

    currentLevel.forEach((childId) => {
      const parents = parentMap.get(childId) || []
      parents.forEach((parentId) => {
        const pos = positionMap.get(parentId)
        if (pos) {
          const key = `${parentId}_${groupCounter}`
          if (!positionedGroups.has(key)) {
            positionedGroups.set(key, { parentX: pos.x, children: [], parentId })
          }
          positionedGroups.get(key).children.push(childId)
          groupCounter++
        }
      })
    })

    // Merge groups with same parentX
    const mergedGroups = []
    positionedGroups.forEach((group) => {
      const existing = mergedGroups.find((g) => g.parentX === group.parentX)
      if (existing) {
        existing.children.push(...group.children)
      } else {
        mergedGroups.push({ ...group })
      }
    })

    // Position each group
    let globalX = -1000
    mergedGroups.forEach((group) => {
      const children = group.children
      const groupWidth = children.length * (nodeWidth + hGap) - hGap
      const groupStartX = group.parentX - groupWidth / 2

      children.forEach((childId, i) => {
        positionMap.set(childId, {
          x: groupStartX + i * (nodeWidth + hGap),
          y: lvl * (nodeHeight + vGap),
        })
      })
    })
  }

  // Build nodes
  const nodes = members.map((m) => ({
    id: String(m.id),
    type: 'person',
    position: positionMap.get(m.id) || { x: 0, y: 0 },
    data: m,
  }))

  // Build edges
  const edges = []
  members.forEach((m) => {
    if (m.father_id) {
      edges.push({
        id: `e-f-${m.father_id}-${m.id}`,
        source: String(m.father_id),
        target: String(m.id),
        markerEnd: { type: MarkerType.Arrow, width: 20, height: 20 },
        style: { stroke: '#3498db', strokeWidth: 2 },
      })
    }
    if (m.mother_id) {
      edges.push({
        id: `e-m-${m.mother_id}-${m.id}`,
        source: String(m.mother_id),
        target: String(m.id),
        markerEnd: { type: MarkerType.Arrow, width: 20, height: 20 },
        style: { stroke: '#e91e63', strokeWidth: 2 },
      })
    }
  })

  return { nodes, edges }
}

export default function TreeView({ members, loading }) {
  const { nodes, edges } = useMemo(() => {
    if (!members || members.length === 0) return { nodes: [], edges: [] }
    return computeTreeLayout(members)
  }, [members])

  if (loading) return <div className="tree-view">Загрузка...</div>
  if (members.length === 0)
    return <div className="tree-view empty">Нет участников. Добавьте первого!</div>

  return (
    <div className="tree-view">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}
