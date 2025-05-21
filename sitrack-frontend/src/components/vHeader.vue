<template>
    <header class="header flex justify-between items-center h-24 w-full px-4">
        <h1 class="text-5xl font-bold pl-4">{{ title }}</h1>
        <div class="flex items-center gap-4">
            <NotificationBell />
        </div>
    </header>
</template>

<script lang="ts">
import NotificationBell from '@/components/NotificationBell.vue'

export default {
    name: 'vHeader',
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

<style scoped>
.header {
    background-color: #FAFAFF;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (max-width: 1024px) {
    .header {
        justify-content: center;
        position: relative;
    }

    .header h1 {
        padding-left: 0;
        text-align: center;
    }

    .header > div {
        position: absolute;
        right: 0.5rem;
    }
}

@media (max-width: 768px) {
    .header {
        height: 4rem;
        padding: 0 0.5rem;
    }

    .header h1 {
        font-size: 1.5rem;
    }
}
</style>
