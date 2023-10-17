import React, { memo, useState } from 'react'
import { Handle, Position } from 'reactflow'

const ActionNode = ({ data }: any) => {
  const [showDescription, setShowDescription] = useState<boolean>(false)
  return (
    <div
      className="p-2 shadow-md bg-white border-2 border-stone-400 w-20 h-14 scale-90 flex items-center justify-center relative"
      onMouseOver={() => setShowDescription(true)}
      onMouseOut={() => setShowDescription(false)}
    >
      <div className="flex items-center justify-center w-full h-full">
        <div className="font-semi text-xs truncate overflow-hidden">
          {data?.label || 'action'}
        </div>
      </div>
      {showDescription && (
        <div className="absolute -right-[125px] w-[120px] px-2 py-1 bg-white border-2 rounded-md border-solid border-stone-400">
          <div className="text-[10px] text-stone-500">
            {data?.description || 'description'}
          </div>
        </div>
      )}

      <Handle type="target" position={Position.Top} className="!bg-teal-500" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-teal-500"
      />
    </div>
  )
}

export default memo(ActionNode)
