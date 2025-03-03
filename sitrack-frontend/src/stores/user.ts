import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import type { User, UserRequestInterface, UserResponse, UsersResponse } from '@/interfaces/user.interfaces';

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

        const data: UsersResponse = await response.json();
        this.users = data.data || [];
        } catch (err) {
        this.error = `Gagal mengambil data pengguna ${err}`;
        } finally {
        this.loading = false;
        }
    },

    async addUser(body: UserRequestInterface) {
        this.loading = true;
        this.error = null;
        const authStore = useAuthStore();
        
        try {
            const response = await fetch('http://localhost:8080/api/user/add', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify(body),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menambahkan user');
            }
            
            const data: UserResponse = await response.json();
            this.users.push(data.data);
            
            return { success: true, message: "Berhasil menambahkan akun pengguna baru" };
        } catch (err) {
            this.error = `Gagal menambah akun: ${(err as Error).message}`;
            return { success: false, message: this.error };
        } finally {
            this.loading = false;
        }
    },
  },
});