import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import type { Notification } from '@/types/notification'

const API_URL = import.meta.env.VITE_API_URL

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [] as Notification[],
        unreadCount: 0,
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchUserNotifications() {
            this.loading = true
            this.error = null
            const authStore = useAuthStore()

            try {
                const response = await fetch(`${API_URL}/api/notifications`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Gagal mengambil notifikasi')
                }

                const data = await response.json()
                this.notifications = data.data
                this.calculateUnreadCount()
            } catch (err) {
                this.error = (err as Error).message
            } finally {
                this.loading = false
            }
        },

        async fetchByCategory(category: string) {
            this.loading = true
            this.error = null
            const authStore = useAuthStore()

            try {
                const response = await fetch(`${API_URL}/api/notifications/category/${category}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Gagal mengambil notifikasi berdasarkan kategori')
                }

                const data = await response.json()
                return data.data
            } catch (err) {
                this.error = (err as Error).message
                throw err
            } finally {
                this.loading = false
            }
        },

        async markAsRead(id: number) {
            const authStore = useAuthStore()

            try {
                const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Gagal menandai notifikasi sebagai telah dibaca')
                }

                const index = this.notifications.findIndex(n => n.id === id)
                if (index !== -1) {
                    this.notifications[index].isRead = true
                    this.calculateUnreadCount()
                }
            } catch (err) {}
        },

        async bulkDeleteNotifications(ids: number[]) {
            const authStore = useAuthStore()
            await fetch(`${API_URL}/api/notifications/bulk-delete`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.token}`
              },
              body: JSON.stringify(ids)
            })
        },

        async triggerCheck() {
            const authStore = useAuthStore()

            try {
                const response = await fetch(`${API_URL}/api/notifications/trigger-check`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Gagal memicu pengecekan dokumen')
                }
            } catch (err) {
                this.error = (err as Error).message
            }
        },

        calculateUnreadCount() {
            this.unreadCount = this.notifications.filter(n => !n.isRead).length
        }
    },

    getters: {
        referenceNotifications: (state) => {
            return state.notifications.filter(n => 
                ['VEHICLE_STNK_EXPIRY', 'VEHICLE_KIR_EXPIRY', 'CHASSIS_KIR_EXPIRY', 'DRIVER_SIM_EXPIRY']
                .includes(n.category)
            )
        },
    }
})
