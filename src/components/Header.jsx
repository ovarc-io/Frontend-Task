import React from 'react'
import Searchbar from './Searchbar'

const Header = ({addNew, title, buttonTitle, canAdd = true}) => {

  return (
    <div className='flex justify-between items-center'>
    <div className='flex items-center gap-2 '>
      <h1 className='text-lg '>{title || 'Authors List'}</h1>
      <Searchbar />
    </div>
    <button
      className={`rounded px-4 py-2 ${canAdd ? 'bg-main text-white hover:bg-main-dark' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
      onClick={() => {
        if (!canAdd) return;
        addNew();
      }}
      disabled={!canAdd}
      title={canAdd ? buttonTitle || `Add New ${title.split(" ")[0]}` : 'Sign in to perform this action'}
    >
      {buttonTitle || `Add New ${title.split(' ')[0]}`}
    </button>



   </div>
  )
}

export default Header