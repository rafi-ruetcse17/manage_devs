<script setup lang="ts">
import { type DailyNote } from '../../types/note';

defineProps<{
    note: DailyNote;
}>();
</script>

<template>
    <td class="user-cell">
        <div class="user-info">
            <div class="avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="details">
                <p class="name">{{ note.developerName }}</p>
                <p class="time">{{ note.formattedDate }}</p>
            </div>
        </div>
    </td>
</template>

<style scoped>
.user-cell {
    background: #fafbfc;
    padding: 1.5rem;
    vertical-align: top;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.details {
    flex: 1;
    min-width: 0;
}

.name {
    font-weight: 700;
    font-size: 1rem;
    color: #2d3748;
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.time {
    font-size: 0.8rem;
    color: #718096;
    margin: 0;
    font-weight: 500;
}
</style>
