const Tooltip = ({ description }: { description: string }) => {
  return (
   <span className='hidden group-hover:block absolute min-w-40 text-center left-0 top-12 bg-black text-white font-light text-[10px] normal-case rounded-lg p-2 z-100'>{description}</span>
  )
}

export default Tooltip