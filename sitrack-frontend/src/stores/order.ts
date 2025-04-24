// stores/order.ts

import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useToast } from 'vue-toastification';
import type {Order, CreateOrderRequest, CreateOrderResponse} from '@/interfaces/order.interfaces';

const API_URL = import.meta.env.VITE_API_URL;

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderList: [] as Order[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/order/all`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        const data = await response.json();
        this.orderList = data.data || [];
        // toast.success(`Berhasil mengambil ${this.orderList.length} order!`);
      } catch (err) {
        this.error = `Gagal mengambil data order: ${err}`;
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async addOrder(orderData: CreateOrderRequest) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/order/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Gagal menambahkan order');
        }

        const { data } = await response.json() as { data: CreateOrderResponse };

        // const newOrder = await this.getOrderById(data.orderId);
        // if (newOrder) this.orderList.push(newOrder);
        

        toast.success('Order berhasil ditambahkan!');
        return { success: true, orderId: data.orderId };
      } catch (err) {
        this.error = `Gagal menambahkan order: ${(err as Error).message}`;
        toast.error(this.error);
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
      

    async getOrderById(orderId: string): Promise<Order | null> {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/order/detail?id=${orderId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(errorData.message || 'Gagal mendapatkan data order');
        // }

        const data: { data: Order } = await response.json();
        return data.data;
      } catch (err) {
        this.error = `Gagal mendapatkan data order: ${(err as Error).message}`;
        toast.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async approveOrder(payload: { orderId: string; approvedBy: string }) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/order/approve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal meng-approve order');
        }

        toast.success('Order berhasil di-approve!');
        return { success: true, message: 'Order berhasil di-approve!' };
      } catch (err) {
        this.error = `Gagal meng-approve order: ${(err as Error).message}`;
        toast.error(this.error);
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});
