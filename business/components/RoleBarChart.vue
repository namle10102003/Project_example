<template>
  <Bar :data="data" :options="options" class="w-full h-80" />
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
import type { ChartData } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const props = defineProps<{ data: ChartData<'bar'>, options?: object }>()
</script>
