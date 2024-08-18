// components/ChatWindow.tsx
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseConfig';
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
} from 'firebase/firestore';
import { createChatroom, joinChatroom, sendPrivateMessage, usePrivateMessage } from '@/lib/chatroom';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function ChatWindow({ onClose }: { onClose: () => void }) {
    const [user, setUser] = useState<any>(null);
    const [chat, setChat] = useState<any[]>([]);
    const [privateChat, setPrivateChat] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState('global');
    const [isChatActive, setIsChatActive] = useState(false);
    const [chatroomId, setChatroomID] = useState('');

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
            setChat(messagesData.reverse());
        });

        return () => {
            unsubscribe();
            unsubscribeMessages();
        };
    }, []);

    useEffect(() => {
        if (isChatActive) {
            const unsubscribe = onSnapshot(
                query(
                    collection(db, "chatrooms", chatroomId, "messages"),
                    orderBy("timeStamp", "asc")
                ),
                (snapshot) => {
                    const newMessages = snapshot.docs.map(doc => doc.data());
                    setPrivateChat(newMessages);
                }
            );

            return () => unsubscribe();
        }
    }, [chatroomId, isChatActive]);


    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        if (activeTab === 'private') {
            await sendPrivateMessage(chatroomId, input);
        } else {
            await addDoc(collection(db, 'messages'), {
                text: input,
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                timestamp: new Date(),
            });
        }

        setInput('');
    };

    const handleChatroomCreation = async () => {
        const chatroom_id = await createChatroom();
        setIsChatActive(true);
        setChatroomID(chatroom_id);
        alert('Please share chatromm id with friends: ' + chatroom_id);
        sendPrivateMessage(chatroom_id, 'Please share chatroom id: ' + chatroom_id)
    }

    const handleChatroomJoining = async () => {
        const result = await joinChatroom(chatroomId);
        if (result) {
            alert('Welcome to the chat!')
            setIsChatActive(true);
        } else {
            alert('Invalid chatroom ID')
        }
    }

    return (
        <ProtectedRoute>
            {user ? (
                <div className="fixed bottom-16 right-4 bg-white w-80 h-4/6 shadow-lg rounded-lg p-4 flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="text-lg font-semibold">Welcome, {user.displayName || user.email || user.uid}</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✖
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-around mb-4">
                        <button
                            className={`w-full py-2 ${activeTab === "global" ? "border-b-2 border-blue-500" : ""
                                }`}
                            onClick={() => setActiveTab("global")}
                        >
                            Global Chat
                        </button>
                        <button
                            className={`w-full py-2 ${activeTab === "private" ? "border-b-2 border-blue-500" : ""
                                }`}
                            onClick={() => setActiveTab("private")}
                        >
                            Private Chat
                        </button>
                    </div>


                    {/* chat content */}
                    <div className="flex-1 overflow-y-auto mb-4">
                        {activeTab === 'global' ? chat.map((message) => (
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
                        )) : isChatActive ? (
                            privateChat.map((message) => (
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
                            ))
                        ) : (
                            <div className="flex-col justify-around mb-4">
                                <button
                                    className={`w-full py-2 ${activeTab === "global" ? "border-b-2 border-blue-500" : ""
                                        }`}
                                    onClick={() => handleChatroomCreation()}
                                >
                                    Create Chatroom
                                </button>
                                <div className='text-center m-5'>OR</div>
                                <input
                                    type="text"
                                    value={chatroomId}
                                    onChange={(e) => {
                                        const newValue = e.target.value.toUpperCase();
                                        if (/^[A-Z0-9]*$/.test(newValue) && newValue.length <= 5) {
                                            setChatroomID(newValue);
                                        }
                                    }}
                                    className="flex-grow p-2 w-full border rounded"
                                    pattern="[A-Z0-9]{5}"
                                />
                                <button
                                    className={`w-full py-2 ${activeTab === "private" ? "border-b-2 border-blue-500" : ""
                                        }`}
                                    onClick={() => handleChatroomJoining()}
                                >
                                    Join Chat with ID
                                </button>
                            </div>
                        )}
                    </div>


                    {/* Input field */}
                    <div className="flex mt-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
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
