import { addDoc, collection, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";

export async function joinGame(gameId: string) {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        await updateDoc(chatroomRef, {
            playerO: auth.currentUser?.uid,
            nameO: auth.currentUser?.displayName,
        });
        return true;
    } else {
        return false;
    }
}

export async function updateScore(gameId: string, score: any[]) {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        await updateDoc(chatroomRef, {
            score
        });
        return true;
    } else {
        return false;
    }
}

export async function rematchGame(gameId: string, player: string) {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        if (player === 'X') {
            await updateDoc(chatroomRef, {
                rematchX: true,
            });
        } else if (player === 'O') {
            await updateDoc(chatroomRef, {
                rematchO: true
            });
        } else {
            await updateDoc(chatroomRef, {
                rematchO: false,
                rematchX: false
            });
        }
        return true;
    } else {
        return false;
    }
}

export async function createGame(gameId: string) {
    const gameRef = await addDoc(collection(db, "games"), {
        playerX: auth.currentUser?.uid,
        playerO: null,
        nameX: auth.currentUser?.displayName,
        nameO: null,
        board: Array(9).fill(null),
        rematchX: false,
        rematchO: false,
        currentTurn: true,
        winner: null,
        chatroomId: gameId,
        score: [],
        createdAt: new Date(),
    });
    return gameRef.id;
}

export async function makeMove(gameId: string, board: any[], currentTurn: boolean) {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        await updateDoc(chatroomRef, {
            board: board,
            currentTurn: currentTurn
        });
        return true;
    } else {
        return false;
    }
}
