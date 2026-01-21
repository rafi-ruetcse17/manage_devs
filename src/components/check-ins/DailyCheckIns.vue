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

            <!-- Daily Notes List -->
            <div v-else class="columns is-multiline">
                <div v-for="note in formattedDailyNotes" :key="note._id" class="column is-12">
                    <CheckInCard :note="note" />
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
</style>
