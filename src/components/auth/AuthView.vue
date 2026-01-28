<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { useAuthStore } from '../../stores/authStore';

const { login } = useAuthStore();

const username = ref('');
const password = ref('');
const name = ref('');
const isRegister = ref(false);
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
    loading.value = true;
    error.value = '';
    try {
        const url = isRegister.value
            ? API_ENDPOINTS.AUTH.REGISTER
            :  API_ENDPOINTS.AUTH.LOGIN;

        const payload = isRegister.value
            ? { name: name.value, username: username.value, password: password.value }
            : { username: username.value, password: password.value };

        const response = await axios.post(url, payload);

        if (response.data.success) {
            login(response.data.data);
            // Reset form
            username.value = '';
            password.value = '';
            name.value = '';
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Authentication failed';
    } finally {
        loading.value = false;
    }
};

const toggleMode = () => {
    isRegister.value = !isRegister.value;
    error.value = '';
};
</script>

<template>
    <div class="auth-view">
        <div class="auth-container">
            <div class="box auth-box">
                <h1 class="main-title-auth">Team Standups</h1>
                <h2 class="title has-text-centered">{{ isRegister ? 'Create Account' : 'Welcome Back' }}</h2>
                <p class="subtitle has-text-centered mb-5 pt-1">
                    {{ isRegister ? 'Join our team standups' : 'Sign in to your account' }}
                </p>

                <form @submit.prevent="handleSubmit">
                    <div v-if="isRegister" class="field">
                        <label class="label">Full Name</label>
                        <div class="control has-icons-left">
                            <input v-model="name" class="input" type="text" placeholder="e.g. John Doe" required />
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Username</label>
                        <div class="control has-icons-left">
                            <input v-model="username" class="input" type="text" placeholder="your_username" required />
                            <span class="icon is-small is-left">
                                <i class="fas fa-at"></i>
                            </span>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Password</label>
                        <div class="control has-icons-left">
                            <input v-model="password" class="input" type="password" placeholder="••••••••" required />
                            <span class="icon is-small is-left">
                                <i class="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    <div v-if="error" class="notification is-danger is-light py-2 px-4 mb-4">
                        {{ error }}f
                    </div>

                    <div class="field mt-5">
                        <button class="button is-primary is-fullwidth" :class="{ 'is-loading': loading }" type="submit">
                            {{ isRegister ? 'Sign Up' : 'Log In' }}
                        </button>
                    </div>
                </form>

                <div class="has-text-centered mt-4">
                    <button class="button is-ghost is-small" @click="toggleMode">
                        {{ isRegister ? 'Already have an account? Log In' : "Don't have an account? Sign Up" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-view {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
}

.auth-container {
    width: 100%;
    max-width: 480px;
}

.auth-box {
    border-radius: 16px;
    padding: 3rem 2.5rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.main-title-auth {
    font-size: 2.25rem;
    font-weight: 800;
    text-align: center;
    color: #667eea;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
}

.title {
    color: #2d3748;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: #718096;
    font-size: 1rem;
}

.label {
    color: #4a5568;
    font-weight: 600;
}

.input {
    border-radius: 8px;
    padding: 1.25rem 1rem 1.25rem 2.75rem;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
}

.input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.button.is-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    height: 3.5rem;
    font-weight: 700;
    font-size: 1.1rem;
    border-radius: 10px;
    transition: all 0.3s ease;
}

.button.is-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
</style>
