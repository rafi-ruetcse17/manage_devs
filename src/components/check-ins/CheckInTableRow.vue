<script setup lang="ts">
import { type DailyNote } from '../../types/note';

defineProps<{
    note: DailyNote;
}>();

const emit = defineEmits<{
    (e: 'click', note: DailyNote): void;
}>();
</script>

<template>
    <tr class="checkin-row" @click="emit('click', note)">
        <slot />
    </tr>
</template>

<style scoped>
.checkin-row {
    border-bottom: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    cursor: pointer;
}

.checkin-row:hover {
    background: #f7fafc;
}

.checkin-row:last-child {
    border-bottom: none;
}
</style>
