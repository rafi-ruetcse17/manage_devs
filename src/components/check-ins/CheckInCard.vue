<script setup lang="ts">
interface Note {
    _id: string;
    developerName: string;
    previousDayWork: string;
    todayPlan: string;
    hasBlocker: boolean;
    formattedDate: string;
}

defineProps<{
    note: Note;
    type: "previous" | "today" | "blocker";
}>();
</script>

<template>
    <div class="check-in-card">
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
            <p v-if="type === 'previous'" class="content-text">{{ note.previousDayWork }}</p>
            <p v-else-if="type === 'today'" class="content-text">{{ note.todayPlan }}</p>
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
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
}

.check-in-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-header {
    margin-bottom: 12px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #3273dc;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
}

.user-details {
    flex: 1;
}

.user-name {
    font-weight: 600;
    font-size: 14px;
    color: #363636;
    margin: 0;
}

.user-role {
    font-size: 12px;
    color: #7a7a7a;
    margin: 0;
}

.card-body {
    margin-bottom: 12px;
}

.content-text {
    font-size: 14px;
    color: #4a4a4a;
    line-height: 1.5;
    margin: 0;
}

.blocker-status {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
}

.blocker-icon,
.no-blocker-icon {
    font-size: 32px;
}

.card-footer {
    border-top: 1px solid #f5f5f5;
    padding-top: 8px;
}

.timestamp {
    font-size: 12px;
    color: #b5b5b5;
    margin: 0;
}
</style>
