import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import usrImg from '../assets/usr.png'
import Login from './Login'

const Topbar = () => {
  const location = useLocation()
  const { user, signOut, isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  
  const path = location.pathname;
  const title = {
    '/': {
      title: 'Shop',
      subtitle: 'Shop > Books',
    },
      
    '/stores': {
      title: 'Stores',
      subtitle: 'Admin > Stores',
    },
    '/author': {
      title: 'Authors',
      subtitle: 'Admin > Authors',
    },
    '/books': {
      title: 'Books',
      subtitle: 'Admin > Books',
    },
    '/store/:storeId': {
      title: 'Store Inventory',
      subtitle: 'Admin > Store Inventory',
    },
    '/browsebooks': {
      title: 'Browse Books',
      subtitle: 'Shop > Books',
    },
    '/browseauthors': {
      title: 'Browse Authors',
      subtitle: 'Shop > Authors',
    },
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className='h-24 border-b border-b-secondary-text flex justify-between items-center'>
      <div className='flex flex-col justify-start items-start '>
        <p className='text-lg text-secondary-text'>{title[path]?.title}</p>
        <p className='font-light text-secondary-text'>{title[path]?.subtitle}</p>
      </div>
      
      <div className='flex-1 flex justify-end items-center'>
        {isAuthenticated() ? (
          <div className='flex items-center'>
            <img src={usrImg} alt="profile" className='ml-4 rounded w-8 h-8' />
            <div className='ml-2'>
              <p className='text-secondary-text font-medium'>{user?.name}</p>
              <p className='text-secondary-text text-sm'>{user?.role}</p>
            </div>
            <button
              onClick={handleSignOut}
              className='ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          >
            Sign In
          </button>
        )}
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  )
}

export default Topbar