import { useForm } from 'react-hook-form'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { useEffect } from 'react'

export const NodeDetails = ({ node, onUpdate, onClose }: any) => {
  const form = useForm({
    defaultValues: {
      label: node.label || '',
      description: node.description || ''
    }
  })

  const { handleSubmit, reset } = form

  const onSave = (data: any) => {
    onUpdate({ id: node.id, data: { ...data } })
    onClose()
  }

  useEffect(() => {
    reset({
      label: node.label || '',
      description: node.description || ''
    })
  }, [node, reset])

  return (
    <div className="p-4 flex flex-col items-center rounded-lg bg-white justify-center w-1/4  border-2 shadow-md gap-4 fixed right-4 top-4">
      <h3 className="w-full">Node: {node.id}</h3>
      <Input
        form={form}
        name="label"
        placeholder="Label"
        rules={{ required: true }}
      />
      <Input
        form={form}
        name="description"
        placeholder="Description"
        rules={{ required: true }}
      />
      <div className="flex gap-2 w-full">
        <Button
          label="Save"
          severity="success"
          block
          onClick={handleSubmit(onSave)}
        />
        <Button
          label="Cancel"
          severity="danger"
          block
          onClick={() => {
            reset()
            onClose()
          }}
        />
      </div>
    </div>
  )
}
