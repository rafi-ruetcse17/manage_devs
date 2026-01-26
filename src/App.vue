<script setup lang="ts">
import { useAuthStore } from "./stores/authStore";
import DailyCheckIns from "./components/check-ins/DailyCheckIns.vue";
import AuthView from "./components/auth/AuthView.vue";

const { isAuthenticated } = useAuthStore();
</script>

<template>
  <DailyCheckIns v-if="isAuthenticated" />
  <AuthView v-else />
</template>

<style scoped></style>
