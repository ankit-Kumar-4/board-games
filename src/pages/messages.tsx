import { useEffect, useState } from 'react';
import { db } from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </div>
  );
}
