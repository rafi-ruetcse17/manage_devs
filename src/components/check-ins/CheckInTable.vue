<script setup lang="ts">
import { type DailyNote } from '../../types/note';
import CheckInTableRow from './CheckInTableRow.vue';
import UserCell from './UserCell.vue';

defineProps<{
    notes: DailyNote[];
    currentUsername?: string;
}>();

const emit = defineEmits<{
    (e: 'rowClick', note: DailyNote): void;
    (e: 'editClick', note: DailyNote): void;
}>();
</script>

<template>
    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th class="col-user">Team Member</th>
                    <th class="col-plan">Day Start Plan (Morning)</th>
                    <th class="col-update">Day End Work Update (Evening)</th>
                    <th class="col-blocker">Any blockers?</th>
                    <th class="col-actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                <CheckInTableRow v-for="note in notes" :key="note._id" :note="note" @click="emit('rowClick', note)">
                    <UserCell :note="note" />
                    <td class="cell">
                        <div class="content">{{ note.dayStartPlan }}</div>
                    </td>
                    <td class="cell">
                        <div class="content" :class="{ empty: !note.dayEndWorkUpdate }">
                            {{ note.dayEndWorkUpdate || '—' }}
                        </div>
                    </td>
                    <td class="cell">
                        <div class="badge" :class="note.hasBlocker ? 'blocked' : 'clear'">
                            {{ note.hasBlocker ? 'YES' : 'NO' }}
                        </div>
                    </td>
                    <td class="cell">
                        <button v-if="note.username === currentUsername" class="edit-icon-btn"
                            @click.stop="emit('editClick', note)" title="Edit check-in">
                            <i class="fas fa-edit"></i>
                        </button>
                        <span v-else class="no-actions">—</span>
                    </td>
                </CheckInTableRow>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.table-container {
    margin-top: 2rem;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Inter', sans-serif;
}

.table thead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.table thead th {
    padding: 1.25rem 1.5rem;
    text-align: left;
    font-size: 1rem;
    font-weight: 700;
    color: white;
    letter-spacing: -0.01em;
    border: none;
}

.col-user {
    width: 20%;
    min-width: 200px;
}

.col-plan,
.col-update {
    width: 30%;
}

.col-blocker {
    width: 15%;
}

.col-actions {
    width: 5%;
    text-align: center !important;
}

.cell {
    padding: 1.5rem;
    vertical-align: top;
}

.content {
    font-size: 0.95rem;
    color: #4a5568;
    line-height: 1.6;
    background: white;
    border-radius: 6px;
    min-height: 60px;
    display: flex;
    align-items: center;
}

.content.empty {
    color: #cbd5e0;
    font-style: italic;
    justify-content: center;
    background: #f7fafc;
}

.badge {
    display: inline-flex;
    align-items: start;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
}

.badge.blocked {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
}

.badge.clear {
    background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
    color: white;
}

.actions-cell {
    text-align: center;
    vertical-align: middle;
}

.edit-icon-btn {
    background: #edf2f7;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
}

.edit-icon-btn:hover {
    background: #667eea;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.no-actions {
    color: #cbd5e0;
    font-size: 0.9rem;
}

@media (max-width: 1024px) {
    .table-container {
        overflow-x: auto;
    }

    .table {
        min-width: 800px;
    }
}
</style>
