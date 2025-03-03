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

        async getUserById(id: number) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();

            try {
                const response = await fetch(`http://localhost:8080/api/user/detail?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mendapatkan data user');
                }

                const data: UserResponse = await response.json();
                return data.data;
            } catch (err) {
                this.error = `Gagal mendapatkan data user: ${(err as Error).message}`;
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateUser(user: UpdateUserRequestInterface) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();

            try {
                const response = await fetch(`http://localhost:8080/api/user/update?id=${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                    body: JSON.stringify({
                        username: user.username,
                        password: user.password,
                        role: user.role,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal memperbarui user');
                }

                const updatedUser: UserResponse = await response.json();

                const index = this.users.findIndex((u) => u.id === updatedUser.data.id);
                if (index !== -1) {
                    this.users[index] = updatedUser.data;
                }

                return { success: true, message: 'Berhasil memperbarui user' };
            } catch (err) {
                this.error = `Gagal memperbarui user: ${(err as Error).message}`;
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },

        async deleteUser(id: number) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();

            try {
                const response = await fetch(`http://localhost:8080/api/user/delete?id=${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal menghapus user');
                }

                this.users = this.users.filter((user) => user.id !== id);
                return { success: true, message: 'Berhasil menghapus user' };
            } catch (err) {
                this.error = `Gagal menghapus user: ${(err as Error).message}`;
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },
    },
});