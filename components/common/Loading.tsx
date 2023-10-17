import React from 'react'
import { AiOutlineLoading } from 'react-icons/ai'

export const Loading = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-black flex items-center justify-center rounded-8">
      <AiOutlineLoading className="text-white text-24 animate-spin" />
      <span className="text-white font-bold ml-6">Loading...</span>
    </div>
  )
}
