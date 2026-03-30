import { CheckCircle2, X } from "lucide-react"
import { RULES } from "../constant/rules"
import useSound from "use-sound";
import clickSfx from '../assets/sfx/mouse-click.mp3';

const Rules = ({setShowRules} : { setShowRules: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const [playClick] = useSound(clickSfx, { volume: 1 });
  return (
    <div className="fixed inset-0 top-0 left-0 flex items-center justify-center p-6 backdrop-blur-md bg-black/60 z-500 duration-300">
          <div className="relative w-full max-w-sm bg-[#1A1D23] border border-white/10 rounded-[2.5rem] p-8 shadow-3xl">
            <button 
                  onClick={() => { setShowRules(false); playClick()}}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>

            <div className="text-left space-y-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">The Rules</h2>
                    <div className="h-1 w-12 bg-teal-400 rounded-full" />
                </div>

                <div className='max-h-[50vh] overflow-y-scroll 
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-[#1A1D23]
                [&::-webkit-scrollbar-thumb]:bg-teal-500/20
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-teal-500/50'>
                <ul className="space-y-4 py-4">
                    {RULES.map((rule, index) => (
                    <li key={index} className="flex gap-3 text-sm text-gray-400 leading-relaxed">
                        <CheckCircle2 size={18} className="text-teal-400 shrink-0 mt-0.5" />
                        {rule}
                    </li>
                    ))}
                </ul>
                </div>

                <button 
                onClick={() => { setShowRules(false); playClick()}}
                className="w-full py-4 bg-[#252932] hover:bg-teal-400/10 hover:text-teal-400 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                >
                Got it
                </button>
            </div>
        </div>
    </div>
  )
}

export default Rules