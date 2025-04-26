<template>
    <div class="relative pr-6">
        <button
            @click="goToNotifications"
            class="relative p-2 hover:bg-gray-100 rounded-full group"
            aria-label="Notifikasi"
            type="button"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
        >
            <i
                :class="[ 
                    'text-[1.5rem] transition-all duration-150',
                    isHovered ? 'fas fa-bell text-black' : 'far fa-bell text-gray-700'
                ]"
                style="line-height: 1"
            ></i>
            <span
                v-if="filteredUnreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold"
            >
                {{ badgeValue }}
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'

const store = useNotificationStore()
const authStore = useAuthStore()
const router = useRouter()
const isHovered = ref(false)

const filteredUnreadCount = computed(() => {
    return store.notifications.filter(notif => {
        if (authStore.role === 'Operasional') {
            return notif.category !== 'REQUEST_ASSET_UPDATE' && !notif.isRead
        } else if (authStore.role === 'Mekanik') {
            return notif.category !== 'ORDER_UPDATE' && !notif.isRead
        }
        return !notif.isRead
    }).length
})

const badgeValue = computed(() => 
    filteredUnreadCount.value > 9 ? '9+' : filteredUnreadCount.value
)

onMounted(() => {
    store.fetchAllNotifications()
})

function goToNotifications() {
    router.push('/notifications')
}
</script>
