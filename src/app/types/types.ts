export interface IMessage {
    id: string
    senderId: string
    text: string
    timestamp: {
        nanoseconds: number,
        seconds: number
    }
}


export interface IUser {
    email: string
    id: string
    isOnline: boolean
    lastSeen: {
        seconds: number, nanoseconds: number
    }
}