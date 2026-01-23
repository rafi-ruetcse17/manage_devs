<script setup lang="ts">
interface DailyNote {
    _id: string;
    developerName: string;
    previousDayWork: string;
    todayPlan: string;
    hasBlocker: boolean;
    createdAt: string;
    updatedAt: string;
    formattedDate?: string;
}

interface Props {
    show: boolean;
    note: DailyNote | null;
}

defineProps<Props>();

const emit = defineEmits<{
    (e: 'close'): void
}>();

const closeModal = () => {
    emit('close');
};
</script>

<template>
    <div v-if="show && note" class="modal is-active">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <div class="modal-header-content">
                    <div class="modal-user-info">
                        <span class="modal-avatar">
                            <i class="fas fa-user-circle"></i>
                        </span>
                        <div>
                            <p class="modal-title">{{ note.developerName }}</p>
                            <p class="modal-subtitle">Daily Check-in Details</p>
                        </div>
                    </div>
                </div>
                <button class="delete" aria-label="close" @click="closeModal"></button>
            </header>
            <section class="modal-card-body">
                <div class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-check-circle"></i>
                        Previous Day Work
                    </h3>
                    <p class="modal-section-content">{{ note.previousDayWork }}</p>
                </div>

                <div class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-calendar-day"></i>
                        Plan for Today
                    </h3>
                    <p class="modal-section-content">{{ note.todayPlan }}</p>
                </div>

                <div class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-exclamation-triangle"></i>
                        Blocker Status
                    </h3>
                    <div class="blocker-badge" :class="note.hasBlocker ? 'has-blocker' : 'no-blocker'">
                        <span class="blocker-icon">{{ note.hasBlocker ? '🔥' : '✅' }}</span>
                        <span class="blocker-text">{{ note.hasBlocker ? 'Has Blocker' : 'No Blockers' }}</span>
                    </div>
                </div>

                <div class="modal-footer-info">
                    <i class="fas fa-clock"></i>
                    <span>Posted {{ note.formattedDate }}</span>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
/* Modal Styles */
.modal-background {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
}

.modal-card {
    max-width: 700px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-card-head {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-bottom: none;
    padding: 1.5rem 2rem;
}

.modal-header-content {
    flex: 1;
}

.modal-user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.modal-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 32px;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin: 0;
    letter-spacing: -0.01em;
}

.modal-subtitle {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    margin-top: 4px;
    font-weight: 500;
}

.modal-card-body {
    padding: 2rem;
    background: #ffffff;
}

.modal-section {
    margin-bottom: 2rem;
}

.modal-section:last-of-type {
    margin-bottom: 1.5rem;
}

.modal-section-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.modal-section-title i {
    color: #667eea;
    font-size: 1.1rem;
}

.modal-section-content {
    font-size: 1rem;
    color: #4a5568;
    line-height: 1.7;
    margin: 0;
    padding: 1rem;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 3px solid #667eea;
}

.blocker-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
}

.blocker-badge.has-blocker {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
}

.blocker-badge.no-blocker {
    background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
    color: white;
}

.blocker-icon {
    font-size: 1.5rem;
}

.blocker-text {
    font-size: 1rem;
}

.modal-footer-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
    color: #718096;
    font-size: 0.9rem;
    font-weight: 500;
}

.modal-footer-info i {
    color: #a0aec0;
}

@media (max-width: 768px) {
    .modal-card {
        max-width: 90%;
        margin: 1rem;
    }

    .modal-card-head {
        padding: 1.25rem 1.5rem;
    }

    .modal-card-body {
        padding: 1.5rem;
    }

    .modal-title {
        font-size: 1.25rem;
    }

    .modal-section-title {
        font-size: 1rem;
    }
}
</style>
