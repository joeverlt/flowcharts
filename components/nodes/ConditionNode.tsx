import React, { memo, useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow'

const ConditionNode = ({ data }: any) => {
  const [showDescription, setShowDescription] = useState<boolean>(false)
  return (
    <div
      className="p-2 shadow-md bg-white border-2 border-stone-400 w-16 h-16 transform rotate-45 skew-y-0 scale-90"
      onMouseOver={() => setShowDescription(true)}
      onMouseOut={() => setShowDescription(false)}
    >
      <div className="flex items-center justify-center  w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45">
        <div className="font-semi text-xs truncate overflow-hidden">
          {data?.label || 'condition'}
        </div>
      </div>
      {showDescription && (
        <div className="absolute top-1/2 left-1/2 w-[120px] px-2 py-1 bg-white border-2 rounded-md border-solid border-stone-400  transform translate-x-5 -translate-y-24 -rotate-45">
          <div className="text-[10px] text-stone-500">
            {data?.description || 'description'}
          </div>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        style={{
          left: 0
        }}
        className="!bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          left: '100%'
        }}
        className="!bg-teal-500"
      />
    </div>
  )
}

export default memo(ConditionNode)
