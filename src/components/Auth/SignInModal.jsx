import { useState } from 'react';
import Modal from '../Modal';
import { useAuth } from '../../contexts/AuthContext';

const SignInModal = ({ show, setShow }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    const result = await signIn(credentials);
    setLoading(false);

    if (result.success) {
      setShow(false);
      setCredentials({ username: '', password: '' });
    } else {
      setError(result.error || 'Sign in failed. Please check your credentials.');
    }
  };

  const handleCancel = () => {
    setShow(false);
    setCredentials({ username: '', password: '' });
    setError('');
  };

  return (
    <Modal
      title="Sign In"
      show={show}
      setShow={setShow}
      save={handleSubmit}
      cancel={handleCancel}
    >
      <div className="flex flex-col gap-4 w-full">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Enter username"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Enter password"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            required
          />
        </div>
        <div className="text-sm text-gray-600">
          <p>Demo credentials:</p>
          <p>Username: admin, Password: admin123</p>
          <p>Username: user, Password: user123</p>
        </div>
      </div>
    </Modal>
  );
};

export default SignInModal;

