<script setup lang="ts">
import { type DailyNote } from "../../types/note";

defineProps<{ note: DailyNote; type: "start" | "end" | "blocker"; }>();

const emit = defineEmits<{ (e: 'click', note: DailyNote): void }>();

const handleClick = (note: DailyNote) => {
    emit('click', note);
};
</script>

<template>
    <div class="check-in-card" @click="handleClick(note)">
        <div class="card-header">
            <div class="user-info">
                <span class="user-avatar">
                    <i class="fas fa-user-circle"></i>
                </span>
                <div class="user-details">
                    <p class="user-name">{{ note.developerName }}</p>
                    <p class="user-role">Member</p>
                </div>
            </div>
        </div>
        <div class="card-body">
            <p v-if="type === 'start'" class="content-text">{{ note.dayStartPlan }}</p>
            <p v-else-if="type === 'end'" class="content-text">{{ note.dayEndWorkUpdate }}</p>
            <div v-else-if="type === 'blocker'" class="blocker-status">
                <span v-if="note.hasBlocker" class="blocker-icon">🔥</span>
                <span v-else class="no-blocker-icon">✅</span>
            </div>
        </div>
        <div class="card-footer">
            <p class="timestamp">Posted {{ note.formattedDate }}</p>
        </div>
    </div>
</template>

<style scoped>
.check-in-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 18px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba(102, 126, 234, 0.1);
    cursor: pointer;
}

.check-in-card:hover {
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
    border-color: rgba(102, 126, 234, 0.3);
}

.card-header {
    margin-bottom: 16px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 14px;
}

.user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 26px;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.user-details {
    flex: 1;
}

.user-name {
    font-weight: 700;
    font-size: 1.1rem;
    color: #2d3748;
    margin: 0;
    letter-spacing: -0.01em;
}

.user-role {
    font-size: 0.9rem;
    color: #718096;
    margin: 0;
    margin-top: 2px;
    font-weight: 500;
}

.card-body {
    margin-bottom: 16px;
}

.content-text {
    font-size: 1rem;
    color: #4a5568;
    line-height: 1.7;
    margin: 0;
    font-weight: 400;
}

.blocker-status {
    display: flex;
    align-items: center;
    justify-content: center;
}

.blocker-icon,
.no-blocker-icon {
    font-size: 32px;
}

.card-footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 12px;
}

.timestamp {
    font-size: 0.85rem;
    color: #a0aec0;
    margin: 0;
    font-weight: 500;
}
</style>
