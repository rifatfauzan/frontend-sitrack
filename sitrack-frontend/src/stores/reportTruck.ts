import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import type { ReportTruck, ReportTruckAsset } from '@/interfaces/reportTruck.interface';

const API_URL = import.meta.env.VITE_API_URL;

export const useReportTruckStore = defineStore('reportTruck', {
  state: () => ({
    reportTruckList: [] as ReportTruck[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchReportTrucks() {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const response = await fetch(`${API_URL}/api/report-truck/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
          },
        });

        const data = await response.json();
        this.reportTruckList = data.data || [];
      } catch (err) {
        this.error = `Gagal mengambil data report truck: ${(err as Error).message}`;
      } finally {
        this.loading = false;
      }
    },

    async createReportTruck(reportTruckData: ReportTruck) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const response = await fetch(`${API_URL}/api/report-truck/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(reportTruckData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal membuat report truck');
        }

        const data = await response.json();
        return { success: true, message: "Report Truck berhasil dibuat", reportTruckId: data.data.reportTruckId };
      } catch (err) {
        this.error = ` ${(err as Error).message}`;
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});
