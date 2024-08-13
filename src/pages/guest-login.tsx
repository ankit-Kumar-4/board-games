import React, { useState } from 'react';
import { auth } from '@/lib/firebaseConfig';
import { getAuth, signInAnonymously } from "firebase/auth";
import { useRouter } from 'next/router';

const GuestLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
    //   const auth = getAuth();
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
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={handleGuestLogin}>Login as Guest</button>
      )}
    </div>
  );
};

export default GuestLogin;
