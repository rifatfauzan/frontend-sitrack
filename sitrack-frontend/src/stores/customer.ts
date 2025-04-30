import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useToast } from 'vue-toastification';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '@/interfaces/customer.interfaces';

const API_URL = import.meta.env.VITE_API_URL;

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        customers: [] as Customer[],
        loading: false,
        error: null as null | string,
    }),

    actions: {
        async fetchCustomers() {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();

            try {
                const response = await fetch(`${API_URL}/api/customer/all`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${authStore.token}` },
                });

                const data = await response.json();
                this.customers = data.data || [];
            } catch (err) {
                this.error = `Gagal mengambil data customer: ${(err as Error).message}`;
            } finally {
                this.loading = false;
            }
        },

        async getCustomerById(id: string) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();

            try {
                const response = await fetch(`${API_URL}/api/customer/detail/${id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${authStore.token}` },
                });

                if (!response.ok) throw new Error('Customer tidak ditemukan');

                const data = await response.json();
                return data.data;
            } catch (err) {
                this.error = `Gagal mendapatkan data customer: ${(err as Error).message}`;
                return null;
            } finally {
                this.loading = false;
            }
        },

        async addCustomer(customer: CreateCustomerRequest) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
        
            try {
                const response = await fetch(`${API_URL}/api/customer/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify(customer),
                });
        
                const data = await response.json();
        
                if (!response.ok) {
                    throw new Error(data.message || "Terjadi kesalahan saat menambahkan customer.");
                }
        
                this.customers.push(data.data);
                return { success: true };
            } catch (err) {
                this.error = (err as Error).message;
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },      

        async updateCustomer(customer: UpdateCustomerRequest) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
        
            try {
                const response = await fetch(`${API_URL}/api/customer/update/${customer.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                    body: JSON.stringify(customer),
                });
        
                const updatedCustomer = await response.json();
                
                if (!response.ok) throw new Error(updatedCustomer.message || 'Gagal memperbarui customer');
        
                const index = this.customers.findIndex((c) => c.id === updatedCustomer.data.id);
                if (index !== -1) this.customers[index] = updatedCustomer.data;
        
                return { success: true };
            } catch (err) {
                // this.error = `Gagal memperbarui customer: ${(err as Error).message}`;
                this.error = (err as Error).message;
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },

        async deleteCustomer(id: string) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/customer/delete/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${authStore.token}` },
                });

                if (!response.ok) throw new Error('Gagal menghapus customer');

                this.customers = this.customers.filter((c) => c.id !== id);
                toast.success("Customer berhasil dihapus!");
                return { success: true };
            } catch (err) {
                this.error = `Gagal menghapus customer: ${(err as Error).message}`;
                toast.error(this.error);
                return { success: false };
            } finally {
                this.loading = false;
            }
        },
    },
});
