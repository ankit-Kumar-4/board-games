import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Listen for real-time updates
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const messagesData: any[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData.reverse());
    });

    return () => {
      unsubscribe();
      unsubscribeMessages();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      uid: user.uid,
      displayName: user.displayName,
      timestamp: new Date(),
    });

    setNewMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {user ? (
        <>
          <div className="flex justify-between w-full max-w-md">
            <p>Welcome, {user.displayName}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <div className="w-full max-w-md mt-4">
            <div className="h-64 overflow-y-auto bg-gray-100 p-4 rounded">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.uid === user.uid
                      ? 'text-right'
                      : 'text-left'
                  } mb-2`}
                >
                  <span className="font-bold">{message.displayName}:</span>{' '}
                  {message.text}
                </div>
              ))}
            </div>
            <div className="flex mt-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow p-2 border rounded"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleLogin}
        >
          Login with Google
        </button>
      )}
    </div>
  );
}
