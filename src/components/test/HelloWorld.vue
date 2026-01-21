<script setup lang="ts">
defineProps({
    msg: String,
});
const x = 1;
</script>

<template>
    <h1>{{ x ? "efff" : msg }}</h1>
</template>

<style scoped></style>
