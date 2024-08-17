import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth, createUser } from '@/lib/firebaseConfig';
import { updateProfile } from 'firebase/auth';

const SignUp = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      // Create user with email and password
      const userCredential = await createUser(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      // Redirect or show success message
      router.push('/login'); // Redirect to login page or another page
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        alert('Email id is already in use')
      } else if (err.code === "auth/invalid-email") {
        alert('Please enter valid email id')
      } else {
        alert('Error in sign-up: ' + err.message)
      }
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ">
      <div className="w-full max-w-md p-8 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-lg">

        <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Board Games by Ankit!</h1>
        <p className="text-gray-700 mb-6 text-center">
          Sign in to access a variety of classic board and puzzle games. Join us and start playing today!
        </p>

        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Gaming Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <Link href="/login">
            <div className="text-indigo-600 hover:text-indigo-800">Already have an account? Or continue as a guest? </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
