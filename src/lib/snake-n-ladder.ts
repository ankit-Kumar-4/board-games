import { addDoc, collection, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";

export async function joinGame(gameId: string) {
    const gamesRef = collection(db, "snl");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        let data: any = {
            player1: { id: null, name: null },
            player2: { id: null, name: null },
            player3: { id: null, name: null },
            player4: { id: null, name: null }
        };

        querySnapshot.forEach((doc: any) => {
            data = { ...doc.data() };
        });

        if ([data.player1.id, data.player2.id, data.player3.id, data.player4.id].some(id => id === auth.currentUser?.uid)) {
            return true;
        } else if (!data.player2.id) {
            await updateDoc(chatroomRef, {
                player2: { id: auth.currentUser?.uid, name: auth.currentUser?.displayName }
            });
        } else if (!data.player3.id && data.playerCount > 2) {
            await updateDoc(chatroomRef, {
                player3: { id: auth.currentUser?.uid, name: auth.currentUser?.displayName }
            });
        } else if (!data.player4.id && data.playerCount > 3) {
            await updateDoc(chatroomRef, {
                player4: { id: auth.currentUser?.uid, name: auth.currentUser?.displayName }
            });
        } else {
            return false;
        }
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

export async function rematchGame(gameId: string) {
    const gamesRef = collection(db, "snl");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        await updateDoc(chatroomRef, {
            playerPosition: Array(4).fill(1),
            playerTurn: 0,
            status: '',
            ranking: [],
            lastTwoTurn: [
                { player_id: 0, dicenumber: 0, last_position: 1 },
                { player_id: 0, dicenumber: 0, last_position: 1 }
            ],
        });
        return true;
    } else {
        return false;
    }
}

export async function createGame(gameId: string, playerCount: number) {
    const gameRef = await addDoc(collection(db, "snl"), {
        player1: { id: auth.currentUser?.uid, name: auth.currentUser?.displayName },
        player2: { id: null, name: null },
        player3: { id: null, name: null },
        player4: { id: null, name: null },
        playerPosition: Array(4).fill(1),
        playerTurn: 0,
        status: '',
        ranking: [],
        lastTwoTurn: [
            { player_id: 0, dicenumber: 0, last_position: 1 },
            { player_id: 0, dicenumber: 0, last_position: 1 }
        ],
        playerCount,
        chatroomId: gameId,
        createdAt: new Date(),
    });
    return gameRef.id;
}

export async function makeMove(gameId: string, status: string, playerTurn: number,
    lastTwoTurn: any[], playerPosition: number[], ranking: any[]
) {
    const gamesRef = collection(db, "snl");
    const q = query(gamesRef, where("chatroomId", "==", gameId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatroomRef = querySnapshot.docs[0].ref;
        const data: any = {
            status, playerTurn, lastTwoTurn
        };
        if (playerPosition.length > 0) {
            data.playerPosition = playerPosition;
        }
        if (ranking.length > 0) {
            data.ranking = ranking;
        }
        await updateDoc(chatroomRef, data);
        return true;
    } else {
        return false;
    }
}
