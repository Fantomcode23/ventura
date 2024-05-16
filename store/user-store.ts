import { create } from "zustand";
import { getUser, logout } from "@/actions/auth-actions";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@supabase/supabase-js";

type UserStore = {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      async fetchUser() {
        set({ isLoading: true });
        const user = await getUser();
        set({ user: user, isLoading: false });
      },

      async logout() {
        await logout();
        set({ user: null });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
