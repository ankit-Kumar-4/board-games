// components/ChatWindow.tsx
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
} from 'firebase/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function ChatWindow({ onClose }: { onClose: () => void }) {
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
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

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        await addDoc(collection(db, 'messages'), {
            text: newMessage,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            timestamp: new Date(),
        });

        setNewMessage('');
    };

    return (
        <ProtectedRoute>
            {user ? (
                <div className="fixed bottom-16 right-4 bg-white w-80 h-96 shadow-lg rounded-lg p-4 flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="text-lg font-semibold">Welcome, {user.displayName || user.email || user.uid}</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✖
                        </button>
                    </div>

                    
                    <div className="flex-1 overflow-y-auto mb-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`${message.uid === user.uid
                                    ? 'text-right'
                                    : 'text-left'
                                    } mb-2`}
                            >
                                <span className="font-bold">{message.displayName || message.email || message.uid}:</span>{' '}
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

            ) : (
                <p>Loading...</p>
            )}
        </ProtectedRoute>
    );
}
