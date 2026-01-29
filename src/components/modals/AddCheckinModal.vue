<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { type DailyNote } from '../../types/note';

const props = defineProps<{
    show: boolean;
    existingCheckIn?: DailyNote | null;
    selectedDate?: string;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success'): void;
}>();

const dayStartPlan = ref('');
const dayEndWorkUpdate = ref('');
const hasBlocker = ref(false);
const loading = ref(false);
const error = ref('');

// Watch for existingCheckIn changes to pre-fill form
watch(() => props.existingCheckIn, (checkIn) => {
    if (checkIn) {
        dayStartPlan.value = checkIn.dayStartPlan || '';
        dayEndWorkUpdate.value = checkIn.dayEndWorkUpdate || '';
        hasBlocker.value = checkIn.hasBlocker || false;
    } else {
        // Reset when creating new
        dayStartPlan.value = '';
        dayEndWorkUpdate.value = '';
        hasBlocker.value = false;
    }
}, { immediate: true });

const handleSubmit = async () => {
    if (!dayStartPlan.value) {
        error.value = 'Please fill out the day start plan';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        const response = await axios.post(API_ENDPOINTS.DAILY_NOTES, {
            dayStartPlan: dayStartPlan.value,
            dayEndWorkUpdate: dayEndWorkUpdate.value,
            hasBlocker: hasBlocker.value,
            date: props.selectedDate,
        });

        if (response.data.success) {
            emit('success');
            emit('close');
            dayStartPlan.value = '';
            dayEndWorkUpdate.value = '';
            hasBlocker.value = false;
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to submit check-in';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="modal" :class="{ 'is-active': show }">
        <div class="modal-background" @click="$emit('close')"></div>
        <div class="modal-content">
            <div class="box report-box">
                <h3 class="title is-4 has-text-centered modal-title">
                    {{ existingCheckIn ? 'Update' : 'Create' }} Daily Check-in
                </h3>
                <p class="subtitle is-6 has-text-centered mb-5 modal-subtitle">
                    {{ existingCheckIn ? 'Update your progress' : 'Share your progress with the team' }}
                </p>

                <form @submit.prevent="handleSubmit">
                    <div class="field">
                        <label class="label">What is your plan for today? (Morning) <span
                                class="required">*</span></label>
                        <div class="control">
                            <textarea v-model="dayStartPlan" class="textarea"
                                placeholder="What do you plan to accomplish today?" required></textarea>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">What did you accomplish today? (Evening) <span class="optional">-
                                Optional</span></label>
                        <div class="control">
                            <textarea v-model="dayEndWorkUpdate" class="textarea"
                                placeholder="Fill this out at the end of the day..."></textarea>
                        </div>
                    </div>

                    <div class="field">
                        <label class="checkbox label-checkbox">
                            <input type="checkbox" v-model="hasBlocker" class="mr-2" />
                            Do you have any blockers?
                        </label>
                    </div>

                    <div v-if="error" class="notification is-danger is-light py-2 px-4 mb-4">
                        {{ error }}
                    </div>

                    <div class="field mt-5">
                        <div class="columns is-mobile">
                            <div class="column">
                                <button type="button" class="button is-light is-fullwidth"
                                    @click="$emit('close')">Cancel</button>
                            </div>
                            <div class="column">
                                <button type="submit" class="button is-primary is-fullwidth"
                                    :class="{ 'is-loading': loading }">
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="$emit('close')"></button>
    </div>
</template>

<style scoped>
.modal-title {
    color: #2d3748;
    font-weight: 800;
}

.modal-subtitle {
    color: #718096;
}

.report-box {
    border-radius: 16px;
    padding: 2.5rem;
    background: #fff;
}

.label {
    color: #4a5568;
    font-weight: 600;
    margin-bottom: 0.75rem;
}

.textarea {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    resize: vertical;
    min-height: 100px;
    background: #fff;
    color: #000;
}

.textarea:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.label-checkbox {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #4a5568;
    cursor: pointer;
}

.button.is-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    font-weight: 700;
    border-radius: 8px;
}

.button.is-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.required {
    color: #e53e3e;
    font-weight: 700;
}

.optional {
    color: #718096;
    font-weight: 500;
    font-size: 0.9em;
}
</style>
