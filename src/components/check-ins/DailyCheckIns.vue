<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import CheckInCard from "./CheckInCard.vue";

interface DailyNote {
    _id: string;
    developerName: string;
    previousDayWork: string;
    todayPlan: string;
    hasBlocker: boolean;
    createdAt: string;
    updatedAt: string;
}

const dailyNotes = ref<DailyNote[]>([]);
const loading = ref(true);
const error = ref("");

const fetchDailyNotes = async () => {
    try {
        loading.value = true;
        const response = await axios.get("http://localhost:4000/api/daily-notes");

        if (response.data.success) {
            dailyNotes.value = response.data.data;
        } else {
            error.value = "Failed to fetch daily notes";
        }
    } catch (err) {
        error.value = "Error connecting to server";
        console.error("Error fetching daily notes:", err);
    } finally {
        loading.value = false;
    }
};

const formattedDailyNotes = computed(() => {
    return dailyNotes.value.map((note) => ({
        ...note,
        formattedDate: new Date(note.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
    }));
});

onMounted(() => {
    fetchDailyNotes();
});
</script>

<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-2 has-text-centered">Team Standups</h1>
            <p class="has-text-centered mb-6">Daily check-ins</p>
            <!-- Loading State -->
            <div v-if="loading" class="has-text-centered">
                <button class="button is-loading is-large is-ghost">Loading</button>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="notification is-danger">
                <p>{{ error }}</p>
                <button class="button is-light mt-3" @click="fetchDailyNotes">Retry</button>
            </div>

            <!-- Empty State -->
            <div v-else-if="dailyNotes.length === 0" class="notification is-info is-light">
                <p class="has-text-centered">No daily check-ins yet. Be the first to add one!</p>
            </div>

            <!-- Daily Notes 3-Column Layout -->
            <div v-else class="three-column-layout">
                <!-- Column 1: Previous Work Day Progress -->
                <div class="column-wrapper">
                    <div class="column-header">
                        <h3 class="column-title">Previous work day progress</h3>
                    </div>
                    <div class="column-content">
                        <CheckInCard v-for="note in formattedDailyNotes" :key="`prev-${note._id}`" :note="note"
                            type="previous" />
                    </div>
                </div>

                <!-- Column 2: Plans for Today -->
                <div class="column-wrapper">
                    <div class="column-header">
                        <h3 class="column-title">Plans for today</h3>
                    </div>
                    <div class="column-content">
                        <CheckInCard v-for="note in formattedDailyNotes" :key="`today-${note._id}`" :note="note"
                            type="today" />
                    </div>
                </div>

                <!-- Column 3: Any Blockers -->
                <div class="column-wrapper">
                    <div class="column-header">
                        <h3 class="column-title">Any blockers? 🔥</h3>
                    </div>
                    <div class="column-content">
                        <CheckInCard v-for="note in formattedDailyNotes" :key="`blocker-${note._id}`" :note="note"
                            type="blocker" />
                    </div>
                </div>
            </div>

            <!-- Refresh Button -->
            <div class="has-text-centered mt-5" v-if="!loading && !error">
                <button class="button is-primary is-outlined" @click="fetchDailyNotes">
                    <span class="icon">
                        <i class="fas fa-sync-alt"></i>
                    </span>
                    <span>Refresh</span>
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.section {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.title.is-2 {
    color: #363636;
    font-weight: 700;
}

.content p {
    line-height: 1.6;
}

.three-column-layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 24px;
}

.column-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 400px;
}

.column-header {
    background: white;
    padding: 16px;
    border-radius: 8px 8px 0 0;
    border-bottom: 2px solid #f5f5f5;
}

.column-title {
    font-size: 16px;
    font-weight: 600;
    color: #363636;
    margin: 0;
}

.column-content {
    flex: 1;
    padding: 16px;
    background: #fafafa;
    border-radius: 0 0 8px 8px;
}

/* Responsive design */
@media (max-width: 1024px) {
    .three-column-layout {
        grid-template-columns: 1fr;
    }
}
</style>
