import { IconType } from 'react-icons'

interface IconButtonProps {
  icon: IconType
  size?: number
  severity?: string
  type?: 'reset' | 'button' | 'submit'
  onClick?: any
}

export const IconButton = ({
  icon: Icon,
  size = 24,
  severity = 'muted',
  type = 'button',
  onClick
}: IconButtonProps) => {
  const severities: { [key: string]: string } = {
    danger: 'text-rose-500',
    success: 'text-teal-400',
    info: 'text-blue-500',
    warning: 'text-yellow-500',
    muted: 'text-gray-400',
    white: 'text-white'
  }

  const color: string = severities[severity]

  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-transparent border-none cursor-pointer flex items-center justify-center"
    >
      <Icon
        size={size}
        className={color}
        style={{ fill: color, stroke: color }}
      />
    </button>
  )
}
