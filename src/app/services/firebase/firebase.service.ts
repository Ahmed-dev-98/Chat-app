/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDoc, arrayUnion, collection, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, provider } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { IUser } from "@/app/types/types";
import { getChatRoomId } from "@/lib/utils";
import { FIREBASE_COLLECTIONS, } from "@/app/constants/firebase-enums";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

class firebaseService {
    private async getUserDocRef(uid: string) {
        const userDocRef = doc(
            db,
            FIREBASE_COLLECTIONS.USERS,
            uid
        );
        return userDocRef
    }

    public async getAllUsers() {
        const usersCollection = collection(db, FIREBASE_COLLECTIONS.USERS);
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map(
            (doc) =>
            ({
                uid: doc.id,
                ...doc.data(),
            } as IUser)
        );
        return usersData
    }
    public async getAllMessages(recipientId: string, currentUserId: string) {
        const recipientDoc = await this.getUserDoc(recipientId);
        const chatRoomId = getChatRoomId(currentUserId, recipientDoc.uid);
        return query(
            collection(
                db,
                FIREBASE_COLLECTIONS.CHAT_ROOMS,
                chatRoomId,
                FIREBASE_COLLECTIONS.MESSAGES
            ),
            orderBy("timestamp")
        );
    }
    public async sendMessage(
        senderId: string,
        recipientId: string,
        payload: DocumentData
    ) {
        const chatRoomId = getChatRoomId(senderId, recipientId);
        await addDoc(
            collection(
                db,
                FIREBASE_COLLECTIONS.CHAT_ROOMS,
                chatRoomId,
                FIREBASE_COLLECTIONS.MESSAGES
            ),
            payload
        );
        if (payload.image) {
            const chatMediaDocRef = doc(
                db,
                FIREBASE_COLLECTIONS.CHAT_ROOMS,
                chatRoomId,
                FIREBASE_COLLECTIONS.CHAT_MEDIA,
                "media"
            );
            try {
                await updateDoc(chatMediaDocRef, {
                    media: arrayUnion(payload.image),
                });
            } catch (error: any) {
                if (error.code === "not-found") {

                    await setDoc(chatMediaDocRef, {
                        media: [payload.image],
                    });
                } else {
                    console.error("Error updating chatMedia:", error);
                    throw error;
                }
            }
        }
    }

    public async updateUser(uid: string, payload: Partial<IUser>) {
        const userDocRef = await this.getUserDocRef(uid);
        await updateDoc(userDocRef, payload);
        const user = await this.getUserDoc(uid);
        return user
    }
    public async getUserDoc(uid: string) {
        const userDocRef = await this.getUserDocRef(uid);
        const data = await getDoc(userDocRef)
        return data.data() as IUser;
    }

    public async getLastMessage(chatRoomId: string) {
        return query(
            collection(
                db,
                FIREBASE_COLLECTIONS.CHAT_ROOMS,
                chatRoomId,
                FIREBASE_COLLECTIONS.MESSAGES
            ),
            orderBy("timestamp", "desc"),
            limit(1)
        )

    }
    public async register(email: string, password: string) {
        const user = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        return user
    }

    public async setUserToFirestoreDb(uid: string, userData: IUser) {
        await setDoc(doc(db, FIREBASE_COLLECTIONS.USERS, uid), userData);
    }

    public async uploadMedia(imageUploaderId: string, media: File, targetedFolder: string) {
        const storage = getStorage();
        const imgRef = ref(storage, `${targetedFolder}/${imageUploaderId + Date.now()}.${media.type.split("/")[1]}`);
        await uploadBytes(imgRef, media);
        const imgUrl = await getDownloadURL(imgRef);
        return imgUrl
    }

    public async getAllChatRoomMedia(senderId: string, recipientId: string) {
        const chatRoomId = getChatRoomId(senderId, recipientId);
        const mediaCollection = collection(db,
            FIREBASE_COLLECTIONS.CHAT_ROOMS,
            chatRoomId,
            FIREBASE_COLLECTIONS.CHAT_MEDIA,
        );
        const querySnapshot = await getDocs(mediaCollection);
        const mediaData = querySnapshot.docs.map(
            (doc) =>
            ({
                ...doc.data(),
            } as DocumentData)
        );
        return mediaData[0]?.media
    }
    public async signInWithGoogle() {
        return await signInWithPopup(auth, provider).then(async (result) => {
            const user = result.user;
            const userRef = await this.getUserDocRef(user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                await updateDoc(userRef, { isOnline: true });
                localStorage.setItem('accessToken', user.accessToken);
                return userDoc.data()
            } else {
                const userData = {
                    uid: user.uid,
                    displayName: user.displayName || "New User",
                    email: user.email || "",
                    isOnline: false,
                    lastSeen: {
                        seconds: new Date().getTime(),
                        nanoseconds: new Date().getTime() * 1000,
                    },
                    avatar: user.photoURL || "",
                    contacts: [],
                };

                await this.setUserToFirestoreDb(user.uid, userData);
                return userData
            }

        })
    }
    public async signInWithCredentials(email: string, password: string) {
        return await signInWithEmailAndPassword(auth, email, password).then(async (data) => {
            localStorage.setItem('accessToken', data.user.accessToken);

            return await this.updateUser(data.user.uid, { isOnline: true });
        })

    }
    public async logOut(uid: string) {
        await this.updateUser(uid, {
            isOnline: false, lastSeen: {
                seconds: new Date().getTime(),
                nanoseconds: new Date().getTime() * 1000,
            }
        });
        await signOut(auth);
        localStorage.removeItem('accessToken');
    }
}


export default Object.freeze(new firebaseService())