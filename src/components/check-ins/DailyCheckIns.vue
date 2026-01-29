<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import CheckInTable from "./CheckInTable.vue";
import CheckinModal from "../modals/CheckinModal.vue";
import AddCheckinModal from "../modals/AddCheckinModal.vue";
import { useAuthStore } from "../../stores/authStore";

import { type DailyNote } from "../../types/note";

const dailyNotes = ref<DailyNote[]>([]);
const loading = ref(true);
const error = ref("");
const showAddModal = ref(false);
const showDetailModal = ref(false);
const selectedNote = ref<DailyNote | null>(null);
const today = new Date().toLocaleDateString("en-CA");
const selectedDate = ref<string>(today);
const { user, logout } = useAuthStore();

const fetchDailyNotes = async (date?: string) => {
    try {
        loading.value = true;
        let url = API_ENDPOINTS.DAILY_NOTES;

        const queryDate = date !== undefined ? date : selectedDate.value;

        if (queryDate) {
            url += `?date=${queryDate}`;
        }

        const response = await axios.get(url);

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

const hasSubmittedToday = computed(() => {
    if (!user.value) return false;
    const today = new Date().toLocaleDateString("en-CA");
    return dailyNotes.value.some(note => {
        const noteDate = new Date(note.createdAt).toLocaleDateString("en-CA");
        return noteDate === today && note.username === user.value?.username;
    });
});

const todayCheckIn = computed(() => {
    if (!user.value) return null;
    const today = new Date().toLocaleDateString("en-CA");
    return dailyNotes.value.find(note => {
        const noteDate = new Date(note.createdAt).toLocaleDateString("en-CA");
        return noteDate === today && note.username === user.value?.username;
    }) || null;
});

const handleDateSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    selectedDate.value = target.value;
    fetchDailyNotes(target.value);
};

const clearDateFilter = () => {
    selectedDate.value = "";
    fetchDailyNotes();
};

const formattedSelectedDate = computed(() => {
    if (!selectedDate.value) return "All Check-ins";
    return new Date(selectedDate.value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});

onMounted(() => {
    fetchDailyNotes(selectedDate.value);
});

const handleRowClick = (note: DailyNote) => {
    selectedNote.value = note;
    showDetailModal.value = true;
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedNote.value = null;
};

</script>

<template>
    <section class="section">
        <!-- Auth Header -->
        <div class="auth-header">
            <div class="user-profile">
                <button @click="showAddModal = true" class="report-btn" :class="{ 'update-mode': hasSubmittedToday }">
                    <i :class="hasSubmittedToday ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
                    <span>{{ hasSubmittedToday ? 'Update Report' : 'Fill Report' }}</span>
                </button>
                <div class="user-info-section">
                    <div class="user-avatar-small">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-details-section">
                        <p class="user-name-text">{{ user?.name }}</p>
                        <button @click="logout" class="logout-btn">
                            <i class="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <div class="container">
            <h1 class="main-title">Team Standups</h1>
            <p class="team-name">TEAM : Front-End</p>
            <p class="subtitle-text">Stay connected with daily check-ins from your team</p>

            <!-- Date Filter Section -->
            <div v-if="!loading && !error" class="date-filter-section">
                <div class="date-filter-container">
                    <div class="date-picker-wrapper">
                        <label class="date-label">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Filter by Date:</span>
                        </label>
                        <input type="date" @change="handleDateSelect" class="date-input" :value="selectedDate"
                            :max="new Date().toISOString().split('T')[0]" />
                    </div>
                    <div class="selected-date-display">
                        <span class="date-badge">{{ formattedSelectedDate }}</span>
                        <button v-if="selectedDate" @click="clearDateFilter" class="clear-button"
                            title="Clear date filter">
                            <i class="fas fa-times"></i>
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="has-text-centered">
                <button class="button is-loading is-large is-ghost">Loading</button>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="notification is-danger">
                <p>{{ error }}</p>
                <button class="button is-light mt-3" @click="() => fetchDailyNotes()">Retry</button>
            </div>

            <!-- Empty State -->
            <div v-else-if="dailyNotes.length === 0" class="notification is-info is-light">
                <p class="has-text-centered">
                    <template v-if="selectedDate">No check-ins found for {{ formattedSelectedDate }}</template>
                    <template v-else>No daily check-ins yet. Be the first to add one!</template>
                </p>
            </div>

            <!-- Daily Notes Table -->
            <CheckInTable v-if="!loading && !error && dailyNotes.length > 0" :notes="formattedDailyNotes"
                @rowClick="handleRowClick" />

            <div class="has-text-centered mt-5" v-if="!loading && !error">
                <button class="button is-primary is-outlined" @click="() => fetchDailyNotes()">
                    <span class="icon">
                        <i class="fas fa-sync-alt"></i>
                    </span>
                    <span>Refresh</span>
                </button>
            </div>
        </div>

        <!-- Modals -->
        <CheckinModal :show="showDetailModal" :note="selectedNote" @close="closeDetailModal" />
        <AddCheckinModal :show="showAddModal" :existingCheckIn="todayCheckIn" @close="showAddModal = false"
            @success="fetchDailyNotes" />
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
    position: relative;
}

.auth-header {
    position: absolute;
    top: 2rem;
    right: 3rem;
    z-index: 10;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.75rem 1.25rem;
    border-radius: 50px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(10px);
}

.user-info-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.user-avatar-small {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 22px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.user-details-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.user-name-text {
    font-weight: 700;
    font-size: 0.95rem;
    color: #2d3748;
    line-height: 1;
    margin: 0;
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: none;
    border: none;
    padding: 0;
    color: #718096;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
}

.logout-btn:hover {
    color: #e53e3e;
}

.logout-btn i {
    font-size: 0.75rem;
}

.report-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 25px;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.report-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.report-btn.update-mode {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.report-btn.update-mode:hover {
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.report-btn i {
    font-size: 1rem;
}

.main-title {
    font-size: 3.5rem;
    font-weight: 800;
    text-align: center;
    color: #ffffff;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    letter-spacing: -0.02em;
}

.team-name {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.subtitle-text {
    text-align: center;
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 3rem;
    font-weight: 400;
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

/* Date Filter Styles */
.date-filter-section {
    margin-bottom: 2rem;
}

.date-filter-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 1rem 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.date-picker-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.date-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
}

.date-label i {
    color: #667eea;
    font-size: 1.2rem;
}

.date-input {
    padding: 0.75rem 1rem;
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    color: #2d3748;
    background: white;
    transition: all 0.3s ease;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
}

.date-input:hover {
    border-color: rgba(102, 126, 234, 0.5);
}

.date-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.selected-date-display {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.date-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.clear-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    color: #718096;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.clear-button:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
    color: #4a5568;
    transform: translateY(-1px);
}

.clear-button i {
    font-size: 0.9rem;
}

@media (max-width: 1024px) {
    .main-title {
        font-size: 2.5rem;
    }

    .subtitle-text {
        font-size: 1.1rem;
    }
}

@media (max-width: 768px) {
    .section {
        padding: 2rem 1rem;
    }

    .auth-header {
        position: static;
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: center;
    }

    .user-profile {
        padding: 0.5rem 0.75rem;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 100%;
    }

    .report-btn {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        gap: 0.4rem;
    }

    .report-btn i {
        font-size: 0.85rem;
    }

    .user-avatar-small {
        width: 32px;
        height: 32px;
        font-size: 18px;
    }

    .user-name-text {
        font-size: 0.85rem;
    }

    .logout-btn {
        font-size: 0.7rem;
        gap: 0.25rem;
    }

    .logout-btn i {
        font-size: 0.7rem;
    }

    .main-title {
        font-size: 2rem;
        margin-top: 0;
    }

    .team-name {
        font-size: 1.1rem;
    }

    .subtitle-text {
        font-size: 0.95rem;
        margin-bottom: 2rem;
    }

    .date-filter-container {
        flex-direction: column;
        align-items: stretch;
        padding: 1.25rem 1.5rem;
    }

    .date-picker-wrapper {
        flex-direction: column;
        align-items: stretch;
    }

    .date-input {
        width: 100%;
    }

    .selected-date-display {
        flex-direction: column;
        align-items: stretch;
    }

    .date-badge {
        text-align: center;
    }

    .clear-button {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .section {
        padding: 1.5rem 0.75rem;
    }

    .user-profile {
        padding: 0.4rem 0.6rem;
        gap: 0.4rem;
    }

    .report-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.75rem;
    }

    .report-btn span {
        display: none;
    }

    .report-btn i {
        font-size: 1rem;
        margin: 0;
    }

    .user-avatar-small {
        width: 28px;
        height: 28px;
        font-size: 16px;
    }

    .user-name-text {
        font-size: 0.8rem;
    }

    .logout-btn {
        font-size: 0.65rem;
    }

    .main-title {
        font-size: 1.75rem;
    }

    .team-name {
        font-size: 1rem;
    }

    .subtitle-text {
        font-size: 0.85rem;
    }
}
</style>
