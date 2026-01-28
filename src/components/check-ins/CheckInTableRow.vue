<script setup lang="ts">
import { type DailyNote } from '../../types/note';

defineProps<{
    note: DailyNote;
}>();
</script>

<template>
    <tr class="checkin-row">
        <slot />
    </tr>
</template>

<style scoped>
.checkin-row {
    border-bottom: 1px solid #e2e8f0;
    transition: all 0.2s ease;
}

.checkin-row:hover {
    background: #f7fafc;
}

.checkin-row:last-child {
    border-bottom: none;
}
</style>
