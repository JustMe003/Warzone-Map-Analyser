<script setup lang="ts">
import { Chart, ScatterController, PointElement, LinearScale, Colors } from 'chart.js';
import { onMounted, ref } from 'vue';
import { emit } from '@tauri-apps/api/event';
import { appData } from '../../app/App';
const canvasRef = ref("scatterChart");
const widthRef = ref(150);

Chart.register(ScatterController, PointElement, LinearScale, Colors);

onMounted(() => {
    const map = appData.getAnalysedMap();
    if (map) {
        const clusters = map.getChartClusters();
        const dataSets: any[] = [];
        clusters.forEach(cluster => {
            dataSets.push({data: cluster.getElements()});
        });
        new Chart(document.getElementById(canvasRef.value) as HTMLCanvasElement, {
            type: "scatter",
            data: {
                datasets: dataSets,
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            color: "rgb(100, 100, 100)"
                        }
                    },
                    y: {
                        grid: {
                            color: "rgb(100, 100, 100)"
                        }
                    }
                },
                onClick: (_, e) => {
                    if (e.length > 0) {
                        emit("scatterElementSelected", {id: clusters[e[0].datasetIndex].getElements()[e[0].index].id || 0});
                    }
                },
                interaction: {
                    mode: 'nearest',
                    intersect: true
                },
                animation: false
            }
        });
    } else {
        widthRef.value = 0;
    }
});

</script>

<template>
    <div class="chart">
        <canvas :id="canvasRef" :width="widthRef"></canvas>
    </div>
</template>

<style>
.chart {
    background-color: darkgray;
}
</style>