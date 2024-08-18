import { v4 as uuidv4 } from 'uuid';
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    onSnapshot,
    setDoc
} from "firebase/firestore";
import { db, auth } from '@/lib/firebaseConfig'; // Firestore instance
import { useEffect, useState } from 'react';

function generateRandomString(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export async function createChatroom() {
    const chatroomId = generateRandomString();
    await setDoc(doc(db, "chatrooms", chatroomId), {
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
        return true;
    } else {
        return false;
    }
}


export async function sendPrivateMessage(chatroomId: string, message: string) {
    await addDoc(collection(db, "chatrooms", chatroomId, "messages"), {
        text: message,
        uid: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        displayName: auth.currentUser?.displayName,
        timeStamp: new Date(),
    });
}

export function usePrivateMessage(chatroomId: string) {
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