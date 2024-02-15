'use client'

const Navbar = () => {
  return (
    <nav
      className='flex justify-between items-center h-14 bg-transparent text-black relative font-mono'
      role='navigation'
    >
      <div className='flex flex-row p-4'>
        <div className='px-4'>Menu1</div>
        <div className='px-4'>Menu2</div>
        <div className='px-4'>Menu3</div>
      </div>
    </nav>
  )
}

export default Navbar
