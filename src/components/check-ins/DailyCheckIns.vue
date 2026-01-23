<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import CheckInCard from "./CheckInCard.vue";
import CheckinModal from "../modals/CheckinModal.vue";

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

const dailyNotes = ref<DailyNote[]>([]);
const loading = ref(true);
const error = ref("");
const showModal = ref(false);
const selectedNote = ref<DailyNote | null>(null);

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

const handleCardClick = (note: DailyNote) => {
    selectedNote.value = note;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedNote.value = null;
};

onMounted(() => {
    fetchDailyNotes();
});
</script>

<template>
    <section class="section">
        <div class="container">
            <h1 class="main-title">Team Standups</h1>
            <p class="subtitle-text">Stay connected with daily check-ins from your team</p>
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
                            type="previous" @click="handleCardClick" />
                    </div>
                </div>

                <!-- Column 2: Plans for Today -->
                <div class="column-wrapper">
                    <div class="column-header">
                        <h3 class="column-title">Plans for today</h3>
                    </div>
                    <div class="column-content">
                        <CheckInCard v-for="note in formattedDailyNotes" :key="`today-${note._id}`" :note="note"
                            type="today" @click="handleCardClick" />
                    </div>
                </div>

                <!-- Column 3: Any Blockers -->
                <div class="column-wrapper">
                    <div class="column-header">
                        <h3 class="column-title">Any blockers?</h3>
                    </div>
                    <div class="column-content">
                        <CheckInCard v-for="note in formattedDailyNotes" :key="`blocker-${note._id}`" :note="note"
                            type="blocker" @click="handleCardClick" />
                    </div>
                </div>
            </div>

            <div class="has-text-centered mt-5" v-if="!loading && !error">
                <button class="button is-primary is-outlined" @click="fetchDailyNotes">
                    <span class="icon">
                        <i class="fas fa-sync-alt"></i>
                    </span>
                    <span>Refresh</span>
                </button>
            </div>
        </div>

        <!-- Modal -->
        <CheckinModal :show="showModal" :note="selectedNote" @close="closeModal" />
    </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.section {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 3rem 1.5rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

.main-title {
    font-size: 3.5rem;
    font-weight: 800;
    text-align: center;
    color: #ffffff;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    letter-spacing: -0.02em;
}

.subtitle-text {
    text-align: center;
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 3rem;
    font-weight: 400;
}

.content p {
    line-height: 1.6;
}

.three-column-layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    margin-top: 2rem;

}

.column-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 400px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
}

.column-wrapper:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.column-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-bottom: none;
}

.column-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.01em;
}

.column-content {
    flex: 1;
    padding: 20px;
    background: #ffffff;
}

.notification {
    font-size: 1.1rem;
    padding: 1.5rem;
    border-radius: 12px;
}

.button.is-primary {
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.button.is-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@media (max-width: 1024px) {
    .main-title {
        font-size: 2.5rem;
    }

    .subtitle-text {
        font-size: 1.1rem;
    }

    .three-column-layout {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .column-title {
        font-size: 1.3rem;
    }
}
</style>
