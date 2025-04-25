import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import type { Sopir, SopirRequestInterface, SopirResponse, SopirResponses } from '@/interfaces/sopir.interfaces';

const API_URL = import.meta.env.VITE_API_URL;
export const useSopirStore = defineStore('sopir', {
    state: () => ({
        sopirs: [] as Sopir[],
        loading: false,
        error: null as null | string,
    }),

    actions: {
        async fetchSopirs() {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();

            try {
                const response = await fetch(`${API_URL}/api/sopir/all`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                const data: SopirResponses = await response.json();
                this.sopirs = data.data || [];
            } catch (err) {
                this.error = `Gagal mengambil data sopir ${err}`;
            } finally {
                this.loading = false;
            }
        },

        async getSopirById(driverId: string) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();

            try {
                const response = await fetch(`${API_URL}/api/sopir/detail/${driverId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                const data: SopirResponse = await response.json();
                return data.data;
            } catch (err) {
                this.error = `Gagal mengambil data sopir ${err}`;
            } finally {
                this.loading = false;
            }
        },

        async addSopir(body: SopirRequestInterface) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const router = useRouter();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/sopir/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal menambahkan sopir');
                }

                const data: SopirResponse = await response.json();
                this.sopirs.push(data.data);

                return { success: true, message: "Berhasil menambahkan sopir baru" };
            } catch (err) {
                this.error = `Gagal menambah sopir: ${(err as Error).message}`;
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },

        async updateSopir(driverId: string, body: SopirRequestInterface) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const router = useRouter();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/sopir/update/${driverId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mengupdate sopir');
                }

                const data: SopirResponse = await response.json();
                const index = this.sopirs.findIndex(sopir => sopir.driverId === driverId);
                this.sopirs[index] = data.data;

                return { success: true, message: "Berhasil mengupdate sopir" };
            } catch (err) {
                this.error = `Gagal mengupdate sopir: ${(err as Error).message}`;
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        }
    }
})
