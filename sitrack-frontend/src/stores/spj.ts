import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
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
      } finally {
        this.loading = false;
      }
    },

    async fetchAllSpjVehicleIn() {
      this.loading = true;
      const authStore = useAuthStore();

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
      } finally {
        this.loading = false;
      }
    },

    async fetchSpjById(id: string) {
      this.loading = true;
      const authStore = useAuthStore();

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
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createSpj(payload: CreateSpjRequest) {
      this.loading = true;
      const authStore = useAuthStore();

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
        return result.data;
      } catch (err) {
        this.error = (err as Error).message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async approveSpj(payload: { spjId: string; status: number; remarksSupervisor: string }) {
      this.loading = true;
      const authStore = useAuthStore();

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
        return result.data;
      } catch (err) {
        this.error = (err as Error).message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async markSpjAsDone(spjId: string) {
      this.loading = true;
      const authStore = useAuthStore();

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
        return result.data;
      } catch (err) {
        this.error = (err as Error).message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async editSpj(spjId: string, payload: CreateSpjRequest) {
      this.loading = true;
      const authStore = useAuthStore();

      try {
        const response = await fetch(`${API_URL}/api/spj/update/${spjId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengedit SPJ');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        this.error = (err as Error).message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async exportSpj(type: 'pdf' | 'excel', spjId: string) {
      const authStore = useAuthStore();
      const url = `${API_URL}/api/spj/export/${type}/${spjId}`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Gagal export SPJ ke ${type.toUpperCase()}`);
        }
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `spj-${spjId}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
        link.click();
        window.URL.revokeObjectURL(link.href);
      } catch (err) {
        this.error = (err as Error).message;
        throw err;
      }
    },
  }
});
