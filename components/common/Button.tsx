import { MouseEventHandler } from 'react'

interface ButtonProps {
  label?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
  severity?: 'danger' | 'warning' | 'info' | 'success' | 'mute'
  onClick?: () => any
}

export const Button = ({
  size,
  label,
  severity,
  block,
  type = 'button',
  onClick = () => {}
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${
          severity === 'danger'
            ? 'bg-rose-500'
            : severity === 'warning'
            ? 'bg-yellow-500'
            : severity === 'info'
            ? 'bg-blue-500'
            : severity === 'success'
            ? 'bg-teal-400'
            : severity === 'mute'
            ? 'bg-gray-600'
            : 'bg-blue-500'
        }
        text-white rounded-md py-2 px-4 ${
          size === 'xs'
            ? 'text-xs'
            : size === 'sm'
            ? 'text-sm'
            : size === 'md'
            ? 'text-base'
            : size === 'lg'
            ? 'text-lg'
            : size === 'xl'
            ? 'text-xl'
            : ''
        }
        ${block ? 'w-full' : ''}
        cursor-pointer
      `}
    >
      {label}
    </button>
  )
}
