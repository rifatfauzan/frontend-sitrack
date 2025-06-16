// src/stores/requestAsset.ts

import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import type { RequestAsset, RequestAssetItem } from '@/interfaces/requestAsset.interfaces';

const API_URL = import.meta.env.VITE_API_URL;

export const useRequestAssetStore = defineStore('requestAsset', {
  state: () => ({
    requestAssetList: [] as RequestAsset[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Fetch All Request Assets
    async fetchRequestAssets() {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      

      try {
        const response = await fetch(`${API_URL}/api/request-assets/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil data Request Asset');
        }

        const data = await response.json();
        this.requestAssetList = data.data || [];
      } catch (err) {
        this.error = `Gagal mengambil data Request Asset: ${(err as Error).message}`;
      } finally {
        this.loading = false;
      }
    },

    // Create Request Asset
    async createRequestAsset(requestAssetData: { requestRemark?: string, assets: RequestAssetItem[] }) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const response = await fetch(`${API_URL}/api/request-assets/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(requestAssetData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal membuat Request Asset');
        }

        const data = await response.json();

        return { success: true, message: "Request Asset berhasil dibuat", requestAssetId: data.data.requestAssetId };
      } catch (err) {
        this.error = `Gagal membuat Request Asset: ${(err as Error).message}`;
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
    // detail request asset
    async fetchRequestAssetById(id: string): Promise<RequestAsset | null> {
      this.loading = true;
      const authStore = useAuthStore();

      try {
        const response = await fetch(`${API_URL}/api/request-assets/detail?id=${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil detail Request Asset');
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        return null;
      } finally {
        this.loading = false;
      }
    },
    // Update Request Asset (approval)
    async updateRequestAssetStatus(id: string, status: number, remark: string) {
        this.loading = true;
        try {
          const response = await fetch(`${API_URL}/api/request-assets/approve?id=${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              status,
              requestRemark: remark
            }),
          });
      
          if (!response.ok) {
            throw new Error('Gagal mengupdate status request asset');
          }
          
        } catch (error) {
        } finally {
          this.loading = false;
        }
    },
    // Update seluruh data Request Asset (edit asset dan items)
    async updateRequestAsset(id: string, updatedData: { requestRemark?: string, assets: RequestAssetItem[] }) {
      this.loading = true;
      const authStore = useAuthStore();

      try {
        const response = await fetch(`${API_URL}/api/request-assets/edit?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengupdate Request Asset');
        }

        

        return { success: true, message: "Request Asset berhasil diupdate" };
      } catch (err) {
        this.error = `Gagal mengupdate Request Asset: ${(err as Error).message}`;
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});
