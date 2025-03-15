import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useToast } from 'vue-toastification';
import type { Truck, CreateTruckRequest, CreateTruckResponse, UpdateTruckResponse, UpdateTruckRequest } from '@/interfaces/truck.interfaces';

const API_URL = import.meta.env.VITE_API_URL;

export const useTruckStore = defineStore('truck', {
    state: () => ({
        truckList: [] as Truck[],
        loading: false,
        error: null as string | null,
    }),

    actions: {
        // **1. Fetch All Trucks**
        async fetchTrucks() {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/truck/all`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                const data = await response.json();
                this.truckList = data.data || [];
                toast.success(`Berhasil mengambil ${this.truckList.length} truck!`);
            } catch (err) {
                this.error = `Gagal mengambil data truck: ${err}`;
                toast.error(this.error);
            } finally {
                this.loading = false;
            }
        },

        // **2. Add Truck**
        async addTruck(truckData: CreateTruckRequest) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/truck/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify(truckData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal menambahkan truck');
                }

                const data: { data: CreateTruckResponse } = await response.json();
                this.truckList.push({ ...truckData, vehicleId: data.data.vehicleId });

                toast.success("Truck berhasil ditambahkan!");
                return { success: true, message: "Truck berhasil ditambahkan!" };
            } catch (err) {
                this.error = `Gagal menambah truck: ${(err as Error).message}`;
                toast.error(this.error);
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },

        // **3. Get Truck by ID**
        async getTruckById(vehicleId: string) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/truck/detail?id=${vehicleId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mendapatkan data truck');
                }

                const data: { data: Truck } = await response.json();
                return data.data;
            } catch (err) {
                this.error = `Gagal mendapatkan data truck: ${(err as Error).message}`;
                toast.error(this.error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        // **4. Update Truck**
        async updateTruck(vehicleId: string, truckData: UpdateTruckRequest) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();
        
            console.log("🚀 Updating truck with ID:", vehicleId);
            console.log("📦 Data sent to API:", JSON.stringify(truckData, null, 2));
        
            try {
                const response = await fetch(`${API_URL}/api/truck/update?id=${vehicleId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify(truckData),
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("❌ Update truck failed:", errorData);
                    throw new Error(errorData.message || 'Gagal memperbarui truck');
                }
        
                const data: { data: UpdateTruckResponse } = await response.json();
        
                const index = this.truckList.findIndex(truck => truck.vehicleId === vehicleId);
                if (index !== -1) {
                    this.truckList[index] = { ...truckData, vehicleId };
                }
        
                toast.success("✅ Truck berhasil diperbarui!");
                return { success: true, message: "Truck berhasil diperbarui!" };
            } catch (err) {
                this.error = `Gagal memperbarui truck: ${(err as Error).message}`;
                toast.error(this.error);
                console.error("🚨 Error updating truck:", err);
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        }
        
    },
});
