<template>
  <div class="section">
    <h2>Jobs</h2>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Titulli</th>
        <th>Kompania</th>
        <th>Veprime</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="job in jobs" :key="job.id">
        <td>{{ job.id }}</td>
        <td>{{ job.title }}</td>
        <td>{{ job.company?.name || 'Pa kompani' }}</td>
        <td>
          <button @click="askDelete(job.id)">Fshij</button>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- Modal konfirmimi -->
    <div v-if="showConfirm" class="modal-overlay">
      <div class="modal-content">
        <p>A dëshiron të fshish këtë punë?</p>
        <button @click="confirmDelete">Po</button>
        <button @click="showConfirm = false">Jo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { toast } from "vue3-toastify";

const jobs = ref([])
const showConfirm = ref(false)
const jobToDelete = ref(null)

const loadJobs = async () => {
  jobs.value = (await api.get('/jobs')).data
}

const askDelete = (id) => {
  jobToDelete.value = id
  showConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/jobs/${jobToDelete.value}`)
    toast.success("Puna u fshi me sukses!")
    await loadJobs()
  } catch {
    toast.error("Ndodhi një gabim gjatë fshirjes!")
  } finally {
    showConfirm.value = false
    jobToDelete.value = null
  }
}

onMounted(loadJobs)
</script>

<style scoped>
@import './tableStyles.css';
.modal-overlay {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff; padding: 25px 34px; border-radius: 10px; min-width: 240px;
  box-shadow: 0 8px 32px #246bfd25;
  text-align: center;
}
.modal-content button { margin: 0 7px; }
</style>
