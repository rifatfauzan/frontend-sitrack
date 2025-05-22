import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

import type { Komisi, CreateKomisiRequest, CreateKomisiResponse } from '@/interfaces/komisi.interfaces';

const API_URL = import.meta.env.VITE_API_URL;
export const useKomisiStore = defineStore('komisi', {
  state: () => ({
    komisiList: [] as Komisi[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchKomisi() {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const response = await fetch(`${API_URL}/api/komisi/all`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        const data = await response.json();
        this.komisiList = data.data || [];
      } catch (err) {
        this.error = `Gagal mengambil data komisi: ${err}`;
      } finally {
        this.loading = false;
      }
    },
    async addKomisi(body: CreateKomisiRequest) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      try {
        const response = await fetch(`${API_URL}/api/komisi/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Gagal menambahkan komisi');
        }
        
        this.komisiList.push(data.data);
        return {success : true}
        
      } catch (err) {
        this.error = (err as Error).message;
        return { success: false, message: this.error };
      }
      finally {
        this.loading = false;
      }
    },
    async updateKomisi(komisiId: string, body: CreateKomisiRequest) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      try {
        const response = await fetch(`${API_URL}/api/komisi/update/${komisiId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mengupdate Komisi');
        }
        const data: CreateKomisiResponse = await response.json();
        const index = this.komisiList.findIndex((komisi: { komisiId: string; }) => komisi.komisiId === komisiId);
        this.komisiList[index] = data.data;

        return { success: true, message: "Berhasil mengupdate komisi" };
      }
      catch (err) {
        this.error = `Gagal memperbarui komisi: ${(err as Error).message}`;
        return { success: false, message: this.error };
      }
      finally {
        this.loading = false;
      }
    },
    async fetchKomisiById(komisiId: string) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      try {
        const response = await fetch(`${API_URL}/api/komisi/detail/${komisiId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Gagal mengambil data komisi');
        }
        const data = await response.json();
        return data.data;
      }
      catch (err) {
        this.error = `Gagal mengambil data komisi: ${err}`;
      }
      finally {
        this.loading = false;
      }
    },
  },
});