import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, doc, updateDoc, arrayUnion, getDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from '@/lib/firebaseConfig'; // Firestore instance
import { useEffect, useState } from 'react';

export async function createChatroom() {
    const chatroomId = uuidv4();
    await addDoc(collection(db, "chatrooms"), {
        id: chatroomId,
        createdBy: auth.currentUser?.uid,
        participants: [auth.currentUser?.uid],
        createdAt: new Date(),
    });
    return chatroomId;
}


export async function joinChatroom(chatroomId: string) {
    const chatroomRef = doc(db, "chatrooms", chatroomId);
    const chatroomSnap = await getDoc(chatroomRef);

    if (chatroomSnap.exists()) {
        await updateDoc(chatroomRef, {
            participants: arrayUnion(auth.currentUser?.uid),
        });
    } else {
        throw new Error("Chatroom not found");
    }
}


export async function sendMessage(chatroomId: string, message: string) {
    await addDoc(collection(db, "chatrooms", chatroomId, "messages"), {
        text: message,
        sender: auth.currentUser?.uid,
        createdAt: new Date(),
    });
}

export function useMessages(chatroomId: string) {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "chatrooms", chatroomId, "messages"),
            (snapshot) => {
                const newMessages = snapshot.docs.map(doc => doc.data());
                setMessages(newMessages);
            }
        );

        return () => unsubscribe();
    }, [chatroomId]);

    return messages;
}