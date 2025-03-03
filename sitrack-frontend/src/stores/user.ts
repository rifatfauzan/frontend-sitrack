import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import type { User } from '@/interfaces/user.interfaces';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as null | string,
  }),
  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

        try {
            const response = await fetch('http://localhost:8080/api/user/all', {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${authStore.token}`,
                },
            });

            const data: CommonResponseInterface<UserInterface[]> = await response.json();
            this.users = data.data
            }   catch (err) {
            this.error = `Gagal mengambil data pengguna ${err}`;
            }   finally {
            this.loading = false;
            }
        },
    },
});
