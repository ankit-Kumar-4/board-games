import { addDoc, collection, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";

export async function joinGame(gameId: string) {
    const gamesRef = collection(db, "dots-n-boxes");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        let data = {
            player2: null,
            player1: null
        };

        querySnapshot.forEach((doc: any) => {
            data = { ...doc.data() };
        });

        if (data.player1 === auth.currentUser?.uid) {
            return true;
        } else if (!data.player2 || data.player2 === auth.currentUser?.uid) {
            await updateDoc(chatroomRef, {
                player2: auth.currentUser?.uid,
                name2: auth.currentUser?.displayName,
            });
        } else {
            return false;
        }
        return true;
    } else {
        return false;
    }
}


export async function createGame(gameId: string, boxes: number[], strokes: number[], dashes: number[],
    row: number, column: number
) {
    const gameRef = await addDoc(collection(db, "dots-n-boxes"), {
        player1: auth.currentUser?.uid,
        player2: null,
        name1: auth.currentUser?.displayName,
        name2: null,
        boxes,
        strokes,
        dashes,
        row,
        column,
        currentTurn: 0,
        winner: null,
        chatroomId: gameId,
        createdAt: new Date(),
    });
    return gameRef.id;
}


export async function makeMove(gameId: string, boxes: number[], strokes: number[], dashes: number[], currentTurn: number, winner: number | null) {
    const gamesRef = collection(db, "dots-n-boxes");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        await updateDoc(chatroomRef, {
            boxes,
            strokes,
            dashes,
            currentTurn,
            winner
        });
        return true;
    } else {
        return false;
    }
}



export async function restartGame(gameId: string, row: number, column: number) {
    const gamesRef = collection(db, "dots-n-boxes");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        await updateDoc(chatroomRef, {
            boxes: Array(row * column).fill(null),
            strokes: Array(row * (column + 1)).fill(null),
            dashes: Array((row + 1) * column).fill(null),
            row,
            column,
            winner: null,
        });
        return true;
    } else {
        return false;
    }
}