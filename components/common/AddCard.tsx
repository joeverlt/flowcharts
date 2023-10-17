import { MouseEventHandler, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { IconButton } from './IconButton'
import { Loading } from './Loading'
import { Input } from './Input'

interface AddCardProps {
  block?: boolean
  title?: string
  loading?: boolean
  onAdd: any
}

export const AddCard = ({ block, title, onAdd, loading }: AddCardProps) => {
  const [adding, setAdding] = useState<boolean>(false)
  const form = useForm()
  const { handleSubmit, reset } = form

  const onCancel: MouseEventHandler = (event) => {
    event.stopPropagation()
    setAdding(false)
    reset()
  }

  return (
    <div
      className={`${
        block ? 'h-20' : ''
      } p-4 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center gap-3 w-full ${
        adding ? 'cursor-pointer' : ''
      }`}
      onClick={() => {
        reset()
        setAdding(true)
      }}
    >
      {!adding && <span>{title}</span>}
      {adding && (
        <div className="flex gap-2">
          <Input
            name="name"
            placeholder="Name"
            form={form}
            rules={{ required: true }}
          />
          <IconButton
            severity="success"
            size={32}
            icon={FaCheckCircle}
            onClick={handleSubmit(onAdd)}
          />
          <IconButton
            size={32}
            severity="danger"
            icon={FaTimesCircle}
            onClick={onCancel}
          />
        </div>
      )}
      {loading && <Loading />}
    </div>
  )
}
