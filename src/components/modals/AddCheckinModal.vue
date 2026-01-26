<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps<{
    show: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success'): void;
}>();

const previousDayWork = ref('');
const todayPlan = ref('');
const hasBlocker = ref(false);
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
    if (!previousDayWork.value || !todayPlan.value) {
        error.value = 'Please fill out all fields';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        const response = await axios.post('http://localhost:4000/api/daily-notes', {
            previousDayWork: previousDayWork.value,
            todayPlan: todayPlan.value,
            hasBlocker: hasBlocker.value,
        });

        if (response.data.success) {
            emit('success');
            emit('close');
            // Reset fields
            previousDayWork.value = '';
            todayPlan.value = '';
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
                <h3 class="title is-4 has-text-centered">Daily Check-in</h3>
                <p class="subtitle is-6 has-text-centered mb-5">Share your progress with the team</p>

                <form @submit.prevent="handleSubmit">
                    <div class="field">
                        <label class="label">What did you do on the previous work day?</label>
                        <div class="control">
                            <textarea v-model="previousDayWork" class="textarea" placeholder="Describe your progress..."
                                required></textarea>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">What are your plans for today?</label>
                        <div class="control">
                            <textarea v-model="todayPlan" class="textarea" placeholder="What's on your list?"
                                required></textarea>
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
.report-box {
    border-radius: 16px;
    padding: 2.5rem;
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
</style>
