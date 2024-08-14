import React, { useState } from "react";
import { auth } from '@/lib/firebaseConfig';
import { signInAnonymously } from "firebase/auth";
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from "next/link";


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        alert('Invalid email or password');
      } else {
        alert('Login error: ' + error.message)
      }
      console.error('Login error:', error);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      console.log("Guest user signed in:", user.uid);
      router.push("/");
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={handleGuestLogin}
            className="text-blue-500 hover:underline"
          >
            Login as Guest
          </button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          <Link href="/sign-up">
            <div className="text-indigo-600 hover:text-indigo-800">Don&apos;t have an account? Sign up! </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
