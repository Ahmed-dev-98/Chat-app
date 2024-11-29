import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const getChatRoomId = (user1Id: string, user2Id: string) => {

  return user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
};

export const formatLastSeen = (date: number) => {
  const fullDate = new Date(date * 1000).toLocaleString().split(',')[0]
  const currentDate = new Date().toLocaleString().split(',')[0]
  if (fullDate === currentDate) return new Date(date * 1000).toLocaleString().split(',')[1]
  if (fullDate !== currentDate) return new Date(date * 1000).toLocaleString().split(',')[0]


};