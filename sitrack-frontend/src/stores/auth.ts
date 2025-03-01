import { defineStore } from 'pinia'
import type { LoginRequest, LoginResponse } from '@/interfaces/auth.interfaces'
import { useToast } from 'vue-toastification'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || 'Pengguna',
    loading: false,
    error: null as null | string,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(credentials: LoginRequest) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
        },
          body: JSON.stringify(credentials),
        })

        if (!response.ok) {
          throw new Error('Username atau password salah!')
        }

        const data: LoginResponse = await response.json()
        this.token = data.data.token;
        
        try {
          const payload = data.data.token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          this.username = decodedPayload.username || 'Pengguna';
          localStorage.setItem('username', this.username);
        } catch (e) {
          console.error('Failed to extract username from token', e);
        }
        
        localStorage.setItem('token', data.data.token)

        useToast().success("Login berhasil")
        await router.push('/home')
      } catch (err) {
        this.error = `Login gagal: ${(err as Error).message}`
        useToast().error(this.error)
      } finally {
        this.loading = false
      }
    },

    logout() {
      fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }
      })
      .then(() => {
        this.token = null;
        this.username = 'Pengguna';
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        useToast().success("Logout berhasil");
        router.push('/');
      })
      .catch(err => {
        console.error('Logout error:', err);
        this.token = null;
        this.username = 'Pengguna';
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/');
      });
    },
    
    initUser() {
      if (this.token) {
        try {
          const payload = this.token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          this.username = decodedPayload.username || 'Pengguna';
          localStorage.setItem('username', this.username);
        } catch (e) {
          console.error('Failed to decode token', e);
          this.logout();
        }
      }
    }
  }
})
