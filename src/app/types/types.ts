export interface IMessage {
    id: string
    senderId: string
    image: string
    text: string
    timestamp: {
        nanoseconds: number,
        seconds: number
    }
}


export interface IUser {
    email: string
    displayName: string
    avatar: string
    uid: string
    isOnline: boolean
    lastSeen: {
        seconds: number, nanoseconds: number
    }
}