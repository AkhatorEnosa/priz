import { useContext } from "react"
import { AppContext } from "../context/AppContext"

const Header = () => {
  const { loading, gameState } = useContext(AppContext)
  return (
    gameState !== "FINISHED" && <div className='relative w-full py-10 mb-10'>
      <div className='max-w-[80vw] flex flex-col justify-center items-center text-center w-fit relative'>
        <h1 className="relative text-center text-5xl md:text-8xl font-black italic tracking-tighter bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent">
          PRIZQUIZ
          <span className="absolute top-2 size-4 bg-teal-400 border-4 border-[#0F1115] rounded-full" />
        </h1>
        <p className="px-5 text-gray-500 tracking-[0.3em] text-[10px] mt-5 uppercase font-bold">
          Unscramble the word before time runs out
        </p>
      </div>
    </div>
  )
}

export default Header