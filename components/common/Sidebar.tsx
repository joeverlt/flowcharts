import { useEffect, useState } from 'react'
import { AddCard } from './AddCard'
import { Card } from './Card'
import { MarkerType } from 'reactflow'

export const Sidebar = ({ onSelect }: { onSelect: (data: any) => any }) => {
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [workflows, setWorkflows] = useState<any[]>([])

  const onAddWorkflow = async (data: any) => {
    setLoading(true)
    try {
      await fetch('/api/v1/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      await getWorkflows()
    } catch (e: any) {
      console.error(e)
    }
    setLoading(false)
  }

  const getWorkflows = async () => {
    try {
      const result = await fetch('/api/v1/workflows')
      const data = await result.json()
      setWorkflows(data)
    } catch (e: any) {
      console.error(e)
    }
  }

  const onSelectWorkflow = async (id: string) => {
    try {
      const result = await fetch(`/api/v1/workflows/${id}`)
      const data = await result.json()
      const { nodes, edges } = data
      setSelected(id)
      onSelect({
        id,
        nodes: nodes.map((node: any) => ({
          ...node,
          deletable: !(node.type === 'start' || node.type === 'end')
        })),
        edges: edges.map((edge: any) => ({
          ...edge,
          markerEnd: { type: MarkerType.ArrowClosed }
        }))
      })
    } catch (e: any) {
      console.error(e)
    }
  }

  useEffect(() => {
    getWorkflows()
  }, [])

  return (
    <div className="px-3 w-1/4 flex flex-col items-center justify-start border-r-2 shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 w-full p-4">
        Flowcharts
      </h1>
      <div className="flex flex-col w-full py-2 gap-2">
        <AddCard
          block
          title="Add workflow"
          loading={loading}
          onAdd={onAddWorkflow}
        />
        {workflows &&
          workflows.map((workflow) => (
            <Card
              key={workflow.id}
              data={workflow}
              refresh={getWorkflows}
              selected={selected === workflow.id}
              onSelect={onSelectWorkflow}
            />
          ))}
      </div>
    </div>
  )
}
