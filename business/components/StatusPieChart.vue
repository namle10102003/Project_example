<template>
  <Pie :data="data" :options="options" class="w-full h-80" />
</template>
<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { defineProps } from 'vue'
import type { ChartData } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, ArcElement)
const props = defineProps<{ data: ChartData<'pie'>, options?: object }>()
</script>
