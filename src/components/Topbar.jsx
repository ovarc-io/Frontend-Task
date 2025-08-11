import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import usrImg from '../assets/usr.png';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal'; 

const Topbar = () => {
  const location = useLocation();
  const { user, signIn, signOut } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');

  const path = location.pathname;
  const title = {
    '/': { title: 'Shop', subtitle: 'Shop > Books' },
    '/stores': { title: 'Stores', subtitle: 'Admin > Stores' },
    '/author': { title: 'Authors', subtitle: 'Admin > Authors' },
    '/books': { title: 'Books', subtitle: 'Admin > Books' },
    '/store/:storeId': { title: 'Store Inventory', subtitle: 'Admin > Store Inventory' },
    '/browsebooks': { title: 'Browse Books', subtitle: 'Shop > Books' },
    '/browseauthors': { title: 'Browse Authors', subtitle: 'Shop > Authors' },
  };

  const handleSignIn = () => {
    if (!usernameInput.trim()) {
      alert('Please enter a username');
      return;
    }
    signIn(usernameInput.trim());
    setUsernameInput('');
    setShowSignInModal(false);
  };

  return (
    <div className="h-24 border-b border-b-secondary-text flex justify-between items-center px-4">
      <div className="flex flex-col justify-start items-start">
        <p className="text-lg text-secondary-text">{title[path]?.title}</p>
        <p className="font-light text-secondary-text">{title[path]?.subtitle}</p>
      </div>
      <div className="flex-1 flex justify-end items-center space-x-4">
        {user ? (
          <>
            <img src={usrImg} alt="profile" className="ml-4 rounded" />
            <p className="text-secondary-text font-light ml-1 h-full">{user.name}</p>
            <button
              onClick={signOut}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded ml-4"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowSignInModal(true)}
              className="bg-main text-white px-4 py-2 rounded"
            >
              Sign In
            </button>

            <Modal
              title="Sign In"
              show={showSignInModal}
              setShow={setShowSignInModal}
              save={handleSignIn}
              cancel={() => setShowSignInModal(false)}
            >
              <input
                type="text"
                placeholder="Enter username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                autoFocus
              />
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default Topbar;
