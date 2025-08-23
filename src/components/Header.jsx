import React from 'react'
import Searchbar from './Searchbar'

const Header = ({addNew, title, buttonTitle}) => {

  return (
    <div className='flex justify-between items-center'>
    <div className='flex items-center gap-2 '>
      <h1 className='text-lg '>{title || 'Authors List'}</h1>
      <Searchbar />
    </div>
    {addNew && buttonTitle && (
      <button 
        className='bg-main text-white rounded px-4 py-2'
        onClick={addNew}
      >
        {buttonTitle}
      </button>
    )}
   </div>
  )
}

export default Header