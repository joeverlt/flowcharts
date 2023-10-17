import { RegisterOptions, UseFormReturn } from 'react-hook-form'

interface InputProps {
  name: string
  placeholder?: string
  type?: string
  rules?: RegisterOptions
  form: UseFormReturn<any>
}

export const Input = ({ name, placeholder, type, rules, form }: InputProps) => {
  const { register } = form

  return (
    <input
      {...register(name, rules)}
      type={type}
      placeholder={placeholder}
      autoFocus
      className="border-stone-300 border rounded-lg p-2 w-full focus:outline-none"
    />
  )
}
