import { AddCard } from '@/components/common/AddCard'
import { Card } from '@/components/common/Card'
import { Sidebar } from '@/components/common/Sidebar'
import ActionNode from '@/components/nodes/ActionNode'
import ConditionNode from '@/components/nodes/ConditionNode'
import EndNode from '@/components/nodes/EndNode'
import { NodeDetails } from '@/components/nodes/NodeDetails'
import StartNode from '@/components/nodes/StartNode'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  MarkerType,
  ReactFlowProvider,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState
} from 'reactflow'
import 'reactflow/dist/style.css'

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  condition: ConditionNode,
  action: ActionNode
}

export default function Home() {
  const [selected, setSelected] = useState<string>('')
  const [selectedNode, setSelectedNode] = useState<any>({})
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const reactFlowWrapper: any = useRef(null)

  const onDragOver = (event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onNodeCreate = async (event: any) => {
    event.preventDefault()

    const reactFlowBounds: any =
      reactFlowWrapper?.current?.getBoundingClientRect()
    const type = event.dataTransfer.getData('application/reactflow')
    if (typeof type === 'undefined' || !type) return

    const position = reactFlowInstance?.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    })

    const result = await fetch('/api/v1/nodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow: selected,
        type,
        position,
        data: { label: `${type} node` }
      })
    })
    const node = await result.json()
    setNodes((nds: any) => nds.concat(node))
  }

  const onNodeUpdate = async (node: any) => {
    setSelectedNode({
      id: node.id,
      label: node.data.label,
      description: node.data.description
    })
    setShowDetails(true)
    const isLastOfType =
      nodes.filter((n: any) => n.type === node.type).length === 1
    await fetch(`/api/v1/nodes/${node.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(node)
    })
    if (isLastOfType) {
      node.deletable = false
    }
    setNodes((nds) =>
      nds.map((nd) => {
        if (nd.id === node.id) {
          nd = { ...nd, ...node }
        }
        return nd
      })
    )
  }

  const onNodeDelete = async (nodes: any) => {
    const node = nodes[0]
    const { id, type } = node
    console.log(node)
    if (type === 'start' || type === 'end') {
      setNodes((nds: any) => nds.concat(node))
      return
    }

    await fetch(`/api/v1/nodes/${id}`, {
      method: 'DELETE'
    })
  }

  const onConnect = async (edge: any) => {
    const result = await fetch('/api/v1/edges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow: selected,
        source: edge.source,
        target: edge.target
      })
    })
    const data = await result.json()
    data.markerEnd = { type: MarkerType.ArrowClosed }
    setEdges((eds) => addEdge(data, eds))
  }

  const onEdgeUpdate = async (oldEdge: any, newConnection: any) => {
    await fetch(`/api/v1/edges/${oldEdge.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newConnection)
    })
    setEdges((els) => updateEdge(oldEdge, newConnection, els))
  }

  const onEdgeDelete = async (nodes: any) => {
    const id = nodes[0].id
    await fetch(`/api/v1/edges/${id}`, {
      method: 'DELETE'
    })
  }

  return (
    <main className="flex">
      <Sidebar
        onSelect={(workflow: any) => {
          setSelected(workflow.id)
          setEdges(workflow.edges)
          setNodes(workflow.nodes)
        }}
      />
      <ReactFlowProvider>
        {selected && (
          <div className="py-4 w-[120px] flex flex-col items-center justify-start border-r-2 shadow-md gap-4">
            <div
              onDragStart={(event) => onDragStart(event, 'condition')}
              draggable
            >
              <ConditionNode />
            </div>
            <div
              onDragStart={(event) => onDragStart(event, 'action')}
              draggable
            >
              <ActionNode />
            </div>
          </div>
        )}
        <div className="h-screen flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            onInit={setReactFlowInstance}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onEdgesDelete={onEdgeDelete}
            onDrop={onNodeCreate}
            onNodeClick={(event, node) => {
              setSelectedNode({
                id: node.id,
                label: node.data.label,
                description: node.data.description
              })
              setShowDetails(true)
            }}
            onNodeDragStop={(_, node) => onNodeUpdate(node)}
            onNodesDelete={onNodeDelete}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
          </ReactFlow>
        </div>
      </ReactFlowProvider>

      {showDetails && (
        <NodeDetails
          node={selectedNode}
          onUpdate={onNodeUpdate}
          onClose={() => {
            setShowDetails(false)
            setSelectedNode({})
          }}
        />
      )}
    </main>
  )
}
