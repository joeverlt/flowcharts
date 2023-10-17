import { MouseEventHandler, useState } from 'react'
import { FaCheckCircle, FaEdit, FaTimesCircle } from 'react-icons/fa'
import { IconButton } from './IconButton'
import { Input } from './Input'
import { useForm } from 'react-hook-form'

interface EditableTitleProps {
  title: string
  nodes: number
  onEdit: (data: string) => any
}

export const EditableTitle = ({ title, nodes, onEdit }: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const form = useForm({ defaultValues: { name: title || '' } })
  const { handleSubmit, reset } = form

  const handleTextClick: MouseEventHandler<
    HTMLDivElement | HTMLButtonElement
  > = (event) => {
    event.stopPropagation()
    event.preventDefault()
    setIsEditing(true)
  }

  const onSubmit = (data: any) => {
    setIsEditing(false)
    onEdit(data)
  }

  return (
    <div className="flex items-center space-x-2 cursor-pointer w-full mr-2">
      {isEditing ? (
        <div className="flex space-x-2 w-full">
          <Input
            name="name"
            placeholder="Name"
            form={form}
            rules={{ required: true }}
          />
          <div className="flex flex-col space-y-2">
            <IconButton
              icon={FaCheckCircle}
              severity="success"
              size={16}
              onClick={handleSubmit(onSubmit)}
            />
            <IconButton
              icon={FaTimesCircle}
              severity="danger"
              size={16}
              onClick={(event: Event) => {
                event.stopPropagation()
                event.preventDefault()
                setIsEditing(false)
                reset()
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col items-start">
            <span className="text-xl" onClick={handleTextClick}>
              {title}
            </span>
            <span className="text-xs text-stone-400" onClick={handleTextClick}>
              {nodes} nodes
            </span>
          </div>
          <IconButton
            icon={FaEdit}
            severity="muted"
            size={18}
            onClick={handleTextClick}
          />
        </div>
      )}
    </div>
  )
}
