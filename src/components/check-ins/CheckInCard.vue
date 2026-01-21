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
}>();
</script>

<template>
    <div class="card">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <span class="icon is-large has-text-primary">
                            <i class="fas fa-user-circle fa-3x"></i>
                        </span>
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-4">{{ note.developerName }}</p>
                    <p class="subtitle is-6 has-text-grey">{{ note.formattedDate }}</p>
                </div>
                <div class="media-right">
                    <span class="tag is-medium" :class="note.hasBlocker ? 'is-danger' : 'is-success'">
                        {{ note.hasBlocker ? "🚫 Blocker" : "✅ No Blocker" }}
                    </span>
                </div>
            </div>

            <div class="content mt-4">
                <div class="mb-4">
                    <p class="has-text-weight-semibold has-text-grey-dark mb-2">
                        📅 Previous Day Work:
                    </p>
                    <p class="pl-4">{{ note.previousDayWork }}</p>
                </div>

                <div>
                    <p class="has-text-weight-semibold has-text-grey-dark mb-2">🎯 Today's Plan:</p>
                    <p class="pl-4">{{ note.todayPlan }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    border-radius: 8px;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
