import { create } from "zustand";

export const useChatStore = create((set) => ({

  chats: [],
  messages: [],
  currentChat: null,

  setChats: (chats) =>
    set({
      chats: Array.isArray(chats) ? chats : []
    }),

  setMessages: (messages) =>
    set({
      messages: Array.isArray(messages) ? messages : []
    }),

  setCurrentChat: (chat) =>
    set({
      currentChat: chat
    })

}));