
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useToast } from 'vue-toastification';
import type { Asset, CreateAssetRequest } from '@/interfaces/asset.interface';

const API_URL = import.meta.env.VITE_API_URL;

export const useAssetStore = defineStore('asset', {
    state: () => ({
        assetList: [] as Asset[],
        loading: false,
        error: null as string | null,
    }),

    actions: {
        // 1. Fetch All Assets
        async fetchAssets() {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/asset/all`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                const data = await response.json();
                this.assetList = data.data || [];
            } catch (err) {
                this.error = `Gagal mengambil data asset: ${err}`;
                toast.error(this.error);
            } finally {
                this.loading = false;
            }
        },

        // 2. Add Asset
        async addAsset(assetData: CreateAssetRequest) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/asset/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify(assetData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal menambahkan asset');
                }

                const data = await response.json();
                this.assetList.push({ ...assetData, assetId: data.data.assetId });

                toast.success('Asset berhasil ditambahkan!');
                return { success: true, message: "Asset berhasil ditambahkan!" };
            } catch (err) {
                this.error = `Gagal menambah asset: ${(err as Error).message}`;
                toast.error(this.error);
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },
        async editAsset(assetId: string, assetData: CreateAssetRequest) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const toast = useToast();

            try {
                const response = await fetch(`${API_URL}/api/asset/update/${assetId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify(assetData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mengedit asset');
                }

                const data = await response.json();
                this.assetList = this.assetList.map(asset => asset.assetId === assetId ? { ...asset, ...data.data } : asset);

                toast.success('Asset berhasil diedit!');
                return { success: true, message: "Asset berhasil diedit!" };
            } catch (err) {
                this.error = `Gagal mengedit asset: ${(err as Error).message}`;
                toast.error(this.error);
                return { success: false, message: this.error };
            } finally {
                this.loading = false;
            }
        },

        async getAssetById(assetId: string) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();

            try {
                const response = await fetch(`${API_URL}/api/asset/${assetId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                    },
                });

                const data = await response.json();
                return data.data;
            } catch (err) {
                this.error = `Gagal mengambil data asset: ${(err as Error).message}`;
            } finally {
                this.loading = false;
            }
        }
    },
});