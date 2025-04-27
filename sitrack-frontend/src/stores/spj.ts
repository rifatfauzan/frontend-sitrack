// stores/spj.ts
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useToast } from 'vue-toastification';
import type { Spj, CreateSpjRequest } from '@/interfaces/spj.interfaces';

const API_URL = import.meta.env.VITE_API_URL;

export const useSpjStore = defineStore('spj', {
  state: () => ({
    spjList: [] as Spj[],
    selectedSpj: null as Spj | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAllSpjVehicleOut() {
      this.loading = true;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/spj/vehicle-out`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        const data = await response.json();
        this.spjList = data.data || [];
      } catch {
        this.error = 'Gagal mengambil data SPJ (Vehicle Out)';
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async fetchAllSpjVehicleIn() {
      this.loading = true;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/spj/vehicle-in`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        const data = await response.json();
        this.spjList = data.data || [];
      } catch {
        this.error = 'Gagal mengambil data SPJ (Vehicle In)';
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSpjById(id: string) {
      this.loading = true;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/spj/detail/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        const data = await response.json();
        this.selectedSpj = data.data;
        return this.selectedSpj;
      } catch {
        this.error = 'Gagal mengambil detail SPJ';
        toast.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createSpj(payload: CreateSpjRequest) {
      this.loading = true;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/spj/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal membuat SPJ');
        }

        const result = await response.json();
        toast.success('SPJ berhasil dibuat!');
        return result.data;
      } catch (err) {
        this.error = (err as Error).message;
        toast.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async approveSpj(payload: { spjId: string; status: number; remarksSupervisor: string }) {
      this.loading = true;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/spj/approve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal approval SPJ');
        }

        const result = await response.json();
        toast.success('Approval SPJ berhasil!');
        return result.data;
      } catch (err) {
        this.error = (err as Error).message;
        toast.error(this.error);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async markSpjAsDone(spjId: string) {
      this.loading = true;
      const authStore = useAuthStore();
      const toast = useToast();

      try {
        const response = await fetch(`${API_URL}/api/spj/done/${spjId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal menyelesaikan SPJ');
        }

        const result = await response.json();
        toast.success('SPJ berhasil diselesaikan!');
        return result.data;
      } catch (err) {
        this.error = (err as Error).message;
        toast.error(this.error);
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
