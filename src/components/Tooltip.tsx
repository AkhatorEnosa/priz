const Tooltip = ({ description }: { description: string }) => {
  return (
   <span className='hidden group-hover:block absolute -left-10 top-10 bg-black text-white font-light text-[10px] capitalize rounded-lg p-2 text-start'>{description}</span>
  )
}

export default Tooltip