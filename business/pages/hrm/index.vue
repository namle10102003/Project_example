<template>
            <div class="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div class="w-full flex flex-col items-center justify-center pt-12">
                    <h1 class="text-4xl font-extrabold text-blue-800 mb-8 text-center drop-shadow-lg tracking-wide">Dashboard Nhân Sự</h1>
                    <!-- Card thống kê nhanh -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-4xl">
                        <div class="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <span class="text-3xl font-bold mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87v-2a4 4 0 00-3-3.87m6 5.87v-2a4 4 0 00-3-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" /></svg>
                                {{ employees.length }}
                            </span>
                            <span class="font-medium">Tổng nhân viên</span>
                        </div>
                        <div class="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <span class="text-3xl font-bold mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 0h4" /></svg>
                                {{ departmentCount }}
                            </span>
                            <span class="font-medium">Phòng ban</span>
                        </div>
                        <div class="bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <span class="text-3xl font-bold mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {{ maleCount }} / {{ femaleCount }}
                            </span>
                            <span class="font-medium">Nam / Nữ</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full flex flex-col items-center">
                        <h2 class="text-2xl font-semibold mb-6 text-blue-700">Thống kê số lượng nhân viên theo phòng ban</h2>
                        <EmployeeBarChart :data="chartData" :options="chartOptions" class="w-full max-w-2xl h-96" />
                    </div>
                </div>
            </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ChartData } from 'chart.js'

import { useEmployeesStore } from '@/stores/business/employee'
import EmployeeBarChart from '~/components/EmployeeBarChart.vue'
import EmployeeService from '@/services/hrm/employees.js'

definePageMeta({
        layout: 'hrm'
})

const employeesStore = useEmployeesStore();
const employees = computed<any[]>(() => employeesStore.allEmployees || []);

// Group employees by department (assuming field: department or office_name)
const departmentStats = computed(() => {
    const stats: Record<string, number> = {};
    employees.value.forEach((emp: any) => {
        const dept = emp.department || emp.office_name || 'Khác';
        stats[dept] = (stats[dept] || 0) + 1;
    });
    return stats;
});

// Biểu đồ stacked bar: Nam/Nữ theo phòng ban
const chartData = computed<ChartData<'bar'>>(() => {
    const labels = Object.keys(departmentStats.value);
    // Tạo datasets cho Nam và Nữ
    const maleData = labels.map(dept => employees.value.filter(e => {
        const d = e.department || e.office_name || 'Khác';
        return d === dept && ((e.gender || '').toLowerCase() === 'male' || (e.gender || '').toLowerCase() === 'nam');
    }).length);
    const femaleData = labels.map(dept => employees.value.filter(e => {
        const d = e.department || e.office_name || 'Khác';
        return d === dept && ((e.gender || '').toLowerCase() === 'female' || (e.gender || '').toLowerCase() === 'nữ');
    }).length);
    return {
        labels,
        datasets: [
            {
                label: 'Nam',
                backgroundColor: '#3b82f6',
                data: maleData,
                borderRadius: 8,
            },
            {
                label: 'Nữ',
                backgroundColor: '#f472b6',
                data: femaleData,
                borderRadius: 8,
            }
        ]
    };
});

// Thống kê phụ
const departmentCount = computed(() => Object.keys(departmentStats.value).length)
const maleCount = computed(() => employees.value.filter(e => (e.gender || '').toLowerCase() === 'male' || (e.gender || '').toLowerCase() === 'nam').length)
const femaleCount = computed(() => employees.value.filter(e => (e.gender || '').toLowerCase() === 'female' || (e.gender || '').toLowerCase() === 'nữ').length)

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display: true, position: 'top' },
        title: {
            display: false
        },
        tooltip: {
            enabled: true,
            callbacks: {
                label: function(context: any) {
                    return `${context.dataset.label}: ${context.parsed.y}`;
                }
            }
        }
    },
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
            beginAtZero: true,
            ticks: { stepSize: 1 }
        }
    }
};

onMounted(() => {
    EmployeeService.fetch && EmployeeService.fetch();
});
</script>
