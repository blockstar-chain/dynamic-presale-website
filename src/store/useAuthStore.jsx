// store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            clearToken: () => set({ token: null }),
        }),
        {
            name: 'auth-storage', // key in localStorage
            getStorage: () => localStorage, // you can change this to sessionStorage if needed
        }
    )
);

export default useAuthStore;
