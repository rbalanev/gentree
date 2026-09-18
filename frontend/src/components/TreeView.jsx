import { useMemo } from 'react'
import ReactFlow, { Controls, Background, useReactFlow } from 'reactflow'
import PersonNode from './PersonNode'
import 'reactflow/dist/style.css'

const nodeTypes = { person: PersonNode }

function layoutTree(nodes, edges) {
  if (nodes.length === 0) return { nodes, edges }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const childrenMap = new Map()
  const rootIds = new Set()

  nodes.forEach((n) => childrenMap.set(n.id, []))
  edges.forEach((e) => {
    const children = childrenMap.get(e.source) || []
    children.push(e.target)
    childrenMap.set(e.source, children)
    rootIds.delete(e.target)
  })

  nodes.forEach((n) => {
    if (!childrenMap.has(n.id)) rootIds.add(n.id)
  })

  const levelMap = new Map()
  const queue = []

  rootIds.forEach((id) => {
    queue.push({ id, level: 0 })
    levelMap.set(id, 0)
  })

  while (queue.length > 0) {
    const { id, level } = queue.shift()
    const children = childrenMap.get(id) || []
    children.forEach((childId) => {
      if (!levelMap.has(childId)) {
        levelMap.set(childId, level + 1)
        queue.push({ id: childId, level: level + 1 })
      }
    })
  }

  const levels = {}
  levelMap.forEach((level, id) => {
    if (!levels[level]) levels[level] = []
    levels[level].push(id)
  })

  const maxLevel = Math.max(...Object.keys(levels).map(Number))
  const nodeWidth = 200
  const nodeHeight = 80
  const hGap = 30
  const vGap = 120

  const layoutedNodes = nodes.map((n) => {
    const level = levelMap.get(n.id) || 0
    const levelNodes = levels[level] || []
    const index = levelNodes.indexOf(n.id)
    const totalWidth = levelNodes.length * (nodeWidth + hGap) - hGap
    const startX = -(totalWidth / 2)

    return {
      ...n,
      position: {
        x: startX + index * (nodeWidth + hGap),
        y: level * (nodeHeight + vGap),
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}

export default function TreeView({ members, loading }) {
  const { fitView } = useReactFlow()

  const { nodes, edges } = useMemo(() => {
    if (!members || members.length === 0) return { nodes: [], edges: [] }

    const nodeMembers = members.map((m) => ({
      id: String(m.id),
      type: 'person',
      position: { x: 0, y: 0 },
      data: m,
    }))

    const treeEdges = members
      .filter((m) => m.father_id || m.mother_id)
      .flatMap((m) => {
        const result = []
        if (m.father_id) {
          result.push({
            id: `e-${m.father_id}-${m.id}`,
            source: String(m.father_id),
            target: String(m.id),
          })
        }
        if (m.mother_id) {
          result.push({
            id: `e-${m.mother_id}-${m.id}`,
            source: String(m.mother_id),
            target: String(m.id),
          })
        }
        return result
      })

    const { nodes: layoutedNodes } = layoutTree(nodeMembers, treeEdges)
    return { nodes: layoutedNodes, edges: treeEdges }
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
