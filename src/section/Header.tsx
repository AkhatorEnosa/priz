import React from 'react'

const Header = () => {
  return (
    <div className='relative inline-block py-10'>
      <div className='relative'>
        <h1 className="text-8xl font-black italic tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            PRIZ
        </h1>
        <div className="absolute -right-4 top-2 w-3 h-3 bg-teal-400 rounded-full animate-pulse" />
      </div>
    </div>
  )
}

export default Header