import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import usrImg from '../assets/usr.png'
import { useAuth } from '../contexts/AuthContext'
import SignInModal from './Auth/SignInModal'

const Topbar = () => {
  const location = useLocation()
  const path = location.pathname;
  const { user, isAuthenticated, signOut } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const getTitle = () => {
    if (path === '/') {
      return { title: 'Shop', subtitle: 'Shop > Books' };
    }
    if (path === '/stores') {
      return { title: 'Stores', subtitle: 'Admin > Stores' };
    }
    if (path === '/author') {
      return { title: 'Authors', subtitle: 'Admin > Authors' };
    }
    if (path === '/books') {
      return { title: 'Books', subtitle: 'Admin > Books' };
    }
    if (path.startsWith('/store/')) {
      return { title: 'Store Inventory', subtitle: 'Admin > Store Inventory' };
    }
    if (path === '/browsebooks') {
      return { title: 'Browse Books', subtitle: 'Shop > Books' };
    }
    if (path === '/browseauthors') {
      return { title: 'Browse Authors', subtitle: 'Shop > Authors' };
    }
    if (path === '/browsestores') {
      return { title: 'Browse Stores', subtitle: 'Shop > Stores' };
    }
    return { title: '', subtitle: '' };
  };

  const pageTitle = getTitle();

  const handleSignOut = async () => {
    await signOut();
  }

  return (
    <>
      <div className='h-24 border-b border-b-secondary-text flex justify-between items-center'>
        <div className='flex flex-col justify-start items-start '>
          <p className='text-lg text-secondary-text'>{pageTitle.title}</p>
          <p className='font-light text-secondary-text'>{pageTitle.subtitle}</p>

        </div>
        <div className='flex-1 flex justify-end items-center'>
          {isAuthenticated && user ? (
            <>
              <img src={usrImg} alt="profile" className='ml-4 rounded' />
              <p className='text-secondary-text font-light ml-1 h-full'>{user.name || user.username}</p>
              <button
                onClick={handleSignOut}
                className='ml-4 text-main hover:text-main-dark px-3 py-1 rounded'
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowSignInModal(true)}
              className='ml-4 bg-main text-white px-4 py-2 rounded hover:bg-main-dark'
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      <SignInModal show={showSignInModal} setShow={setShowSignInModal} />
    </>
  )
}

export default Topbar