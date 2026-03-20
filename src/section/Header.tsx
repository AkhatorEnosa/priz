const Header = () => {
  return (
    <div className='relative top-0 inline-block py-10 mb-10'>
      <div className='relative'>
        <h1 className="text-8xl font-black italic tracking-tighter bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent">
            PRIZQUIZ
        </h1>
        <div className="absolute -right-2 top-2 size-4 bg-teal-400 border-4 border-[#0F1115] rounded-full" />
      </div>
      <p className="text-gray-500 tracking-[0.3em] text-[10px] uppercase font-bold">
        Unscramble the word before time runs out
      </p>
    </div>
  )
}

export default Header