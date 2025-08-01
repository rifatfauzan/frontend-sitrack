import { defineStore } from 'pinia'
import type { LoginRequest, LoginResponse } from '@/interfaces/auth.interfaces'
import { useToast } from 'vue-toastification'
import router from '@/router'
import type { CommonResponseInterface } from '@/interfaces/common.interfaces'

const API_URL = import.meta.env.VITE_API_URL;
export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        username: localStorage.getItem('username') || 'Pengguna',
        role: localStorage.getItem('role') || '',
        loading: false,
        error: null as null | string,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(credentials: LoginRequest) {
            this.loading = true
            this.error = null

            try {
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                })

                if (!response.ok) {
                    throw new Error('Username atau password salah!')
                }

                const data: CommonResponseInterface<LoginResponse> = await response.json()
                this.token = data.data.token

                try {
                    const payload = data.data.token.split('.')[1]
                    const decodedPayload = JSON.parse(atob(payload))
                    this.username = decodedPayload.username || 'Pengguna'
                    this.role = decodedPayload.role
                    localStorage.setItem('username', this.username)
                    localStorage.setItem('role', this.role)
                } catch (e) {
                    console.error('Failed to extract username from token', e)
                }

                localStorage.setItem('token', data.data.token)

                useToast().success('Login berhasil')
                await router.push('/home')
            } catch (err) {
                this.error = `Login gagal: ${(err as Error).message}`
                useToast().error(this.error)
            } finally {
                this.loading = false
            }
        },

        logout() {
            fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                },
            })
                .then(() => {
                    this.token = null
                    this.username = 'Pengguna'
                    localStorage.removeItem('token')
                    localStorage.removeItem('username')
                    localStorage.removeItem('role')

                    useToast().success('Logout berhasil')
                    router.push('/')
                })
                .catch((err) => {
                    console.error('Logout error:', err)
                    this.token = null
                    this.username = 'Pengguna'
                    localStorage.removeItem('token')
                    localStorage.removeItem('username')
                    localStorage.removeItem('role')
                    router.push('/')
                })
        },

        initUser() {
            if (this.token) {
                try {
                    const payload = this.token.split('.')[1]
                    const decodedPayload = JSON.parse(atob(payload))
                    this.username = decodedPayload.username || 'Pengguna'
                    this.role = decodedPayload.role
                    localStorage.setItem('username', this.username)
                    localStorage.setItem('role', this.role)
                } catch (e) {
                    console.error('Failed to decode token', e)
                    this.logout()
                }
            }
        },
    },
})
