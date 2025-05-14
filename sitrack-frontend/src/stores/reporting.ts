import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import type { ReportType } from '@/interfaces/reporting.interfaces'

const API_URL = import.meta.env.VITE_API_URL

interface ReportingState {
  reportType: ReportType
  fromDate: string
  endDate: string
  data: unknown[]
  columns: string[]
  loading: boolean
  error: string | null
}

export const useReportingStore = defineStore('reporting', {
  state: (): ReportingState => ({
    reportType: 'ALL_CUSTOMERS',
    fromDate: '',
    endDate: '',
    data: [],
    columns: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchReport() {
      this.loading = true
      this.error = null
      const authStore = useAuthStore()
      try {
        const payload: Record<string, unknown> = { reportType: this.reportType }
        if (this.reportType === 'ALL_ORDERS' || this.reportType === 'ALL_SPJ') {
          payload.fromDate = this.fromDate
          payload.endDate = this.endDate
        }
        const response = await fetch(`${API_URL}/api/reports/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Gagal mengambil data report')
        }
        const result = await response.json()
        this.data = result.data || []
        this.columns = result.columns || []
      } catch (err) {
        this.data = []
        this.columns = []
        this.error = (err as Error).message || 'Gagal mengambil data report'
      } finally {
        this.loading = false
      }
    },
    async exportReport(type: 'pdf' | 'excel') {
      const authStore = useAuthStore()
      const payload: Record<string, unknown> = { reportType: this.reportType }
      if (this.reportType === 'ALL_ORDERS' || this.reportType === 'ALL_SPJ') {
        payload.fromDate = this.fromDate
        payload.endDate = this.endDate
      }
      const url = `${API_URL}/api/reports/export/${type}`
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Gagal export report')
        }
        const blob = await response.blob()
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `report.${type === 'pdf' ? 'pdf' : 'xlsx'}`
        link.click()
        window.URL.revokeObjectURL(link.href)
      } catch {
        // error intentionally ignored
      }
    },
  },
})
