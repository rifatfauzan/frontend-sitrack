<template>
    <header class="header flex justify-between items-center h-24 w-full px-4">
        <h1 class="text-5xl font-bold pl-4">{{ title }}</h1>
        <div class="flex items-center gap-4">
            <NotificationBell />
        </div>
    </header>
</template>

<script>
import NotificationBell from '@/components/NotificationBell.vue'

export default {
    components: {
        NotificationBell
    },
    props: {
        title: {
            type: String,
            default: "Default Title"
        }
    }
};
</script>
