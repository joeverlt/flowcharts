import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'
import { Loading } from './Loading'
import { EditableTitle } from './EditableTitle'
import { IconButton } from './IconButton'

interface CardProps {
  data: any
  selected?: boolean
  onSelect: (id: string) => void
  refresh: () => void
}

export const Card = ({ data, onSelect, refresh, selected }: CardProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { name, id, nodes } = data

  const onDelete = async (event: Event) => {
    event.stopPropagation()
    setLoading(true)
    try {
      await fetch(`/api/v1/workflows/${id}`, {
        method: 'DELETE'
      })
      refresh()
    } catch (e: any) {
      console.error(e)
    }
    setLoading(false)
  }

  const onUpdate = async (data: string) => {
    setLoading(true)
    try {
      await fetch(`/api/v1/workflows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      refresh()
    } catch (e: any) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div
      className={`p-4 w-full h-20 border-2 border-solid border-stone-300 rounded-lg flex justify-between cursor-pointer relative overflow-hidden ${
        selected && 'bg-stone-100 border-teal-500'
      }`}
      onClick={() => onSelect(id)}
    >
      <EditableTitle title={name} nodes={nodes.length} onEdit={onUpdate} />
      <IconButton
        size={18}
        severity="danger"
        icon={FaTrash}
        onClick={onDelete}
      />
      {loading && <Loading />}
    </div>
  )
}
