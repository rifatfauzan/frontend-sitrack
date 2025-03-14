import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useToast } from 'vue-toastification';
import type { Chassis, CreateChassisRequest, CreateChassisResponse } from '@/interfaces/chassis.interfaces';

const API_URL = import.meta.env.VITE_API_URL;

export const useChassisStore = defineStore('chassis', {
    state: () => ({
        chassisList: [] as Chassis[],
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchChassis() {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/chassis/all`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                const data = await response.json();
                this.chassisList = data.data || [];
                // toast.success(`Berhasil mengambil ${this.chassisList.length} chassis!`);
            } catch (err) {
                this.error = `Gagal mengambil data chassis: ${err}`;
                toast.error(this.error);
            } finally {
                this.loading = false;
            }
        },

        async addChassis(chassisData: CreateChassisRequest) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/chassis/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify(chassisData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal menambahkan chassis');
                }

                const data: { data: CreateChassisResponse } = await response.json();
                this.chassisList.push({ ...chassisData, chassisId: data.data.chassisId });

                // toast.success("Chassis berhasil ditambahkan!");
                return { success: true, message: "Chassis berhasil ditambahkan!" };
            } catch (err) {
                this.error = `Gagal menambah chassis: ${(err as Error).message}`;
                toast.error(this.error);
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },

        async getChassisById(chassisId: string) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/chassis/detail?id=${chassisId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mendapatkan data chassis');
                }

                const data: { data: Chassis } = await response.json();
                return data.data;
            } catch (err) {
                this.error = `Gagal mendapatkan data chassis: ${(err as Error).message}`;
                toast.error(this.error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateChassis(chassisId: string, chassisData: CreateChassisRequest) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/chassis/update?id=${chassisId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify(chassisData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal memperbarui chassis');
                }

                const data: { data: CreateChassisResponse } = await response.json();

                const index = this.chassisList.findIndex(chassis => chassis.chassisId === chassisId);
                if (index !== -1) {
                    this.chassisList[index] = { ...chassisData, chassisId };
                }

                // toast.success("Chassis berhasil diperbarui!");
                return { success: true, message: "Chassis berhasil diperbarui!" };
            } catch (err) {
                this.error = `Gagal memperbarui chassis: ${(err as Error).message}`;
                toast.error(this.error);
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },
    },
});
