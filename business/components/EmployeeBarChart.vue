<template>
    <Bar :data="data" :options="options" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { defineProps } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import type { ChartData } from 'chart.js'
const props = defineProps<{
    data: ChartData<'bar'>,
    options?: object
}>()
</script>