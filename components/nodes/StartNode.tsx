import React, { memo, useState } from 'react'
import { Handle, Position } from 'reactflow'

const StartNode = ({ data }: any) => {
  const [showDescription, setShowDescription] = useState<boolean>(false)

  return (
    <div
      className="p-2 rounded-full shadow-md border-2 border-white/10 bg-teal-400 w-16 h-16 flex items-center justify-center relative"
      onMouseOver={() => setShowDescription(true)}
      onMouseOut={() => setShowDescription(false)}
    >
      <div className="flex">
        <span className="text-sm font-bold text-white">{data.label}</span>
      </div>
      {showDescription && (
        <div className="absolute -right-[125px] w-[120px] px-2 py-1 bg-white border-2 rounded-md border-solid border-stone-400">
          <div className="text-[10px] text-stone-500">
            {data?.description || 'description'}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  )
}

export default memo(StartNode)
