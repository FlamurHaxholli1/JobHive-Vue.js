<template>
  <div class="edit-job-bg">
    <Navbar />
    <div class="edit-job-wrapper">
      <h2>Edito Vendin e Punës</h2>
      <form v-if="job" @submit.prevent="submitForm" class="edit-job-form">
        <div class="form-group">
          <label>Titulli</label>
          <input v-model="job.title" type="text" required />
        </div>
        <div class="form-group">
          <label>Përshkrimi</label>
          <textarea v-model="job.description" rows="6" required />
        </div>
        <div class="form-group">
          <label>Lokacioni</label>
          <input v-model="job.location" type="text" />
        </div>
        <div class="form-group salary-group">
          <div>
            <label>Paga Min (€)</label>
            <input v-model.number="job.salaryMin" type="number" min="0" />
          </div>
          <div>
            <label>Paga Max (€)</label>
            <input v-model.number="job.salaryMax" type="number" min="0" />
          </div>
        </div>
        <div class="form-group">
          <label>Tipi</label>
          <select v-model="job.employmentType">
            <option value="">Zgjedh tipin...</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Kontratë</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div class="form-group">
          <label>Kërkesat</label>
          <textarea v-model="job.requirements" rows="4" placeholder="Çdo kërkesë në rresht të ri..." />
        </div>
        <div class="form-group">
          <label>Statusi</label>
          <select v-model="job.status">
            <option value="active">Aktiv</option>
            <option value="closed">I mbyllur</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" :disabled="loading">💾 Ruaj Ndryshimet</button>
          <router-link class="cancel-btn" :to="`/jobs/${job.id}`">Anulo</router-link>
        </div>
      </form>
      <div v-else class="loading">Duke u ngarkuar...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import api from '../services/api'
import { toast } from 'vue3-toastify' // SHTO KËTË

const route = useRoute()
const router = useRouter()

const job = ref(null)
const loading = ref(false)

onMounted(async () => {
  try {
    const res = await api.get(`/jobs/${route.params.id}`)
    job.value = res.data
  } catch (e) {
    toast.error('Gabim gjatë ngarkimit të të dhënave.')
  }
})

async function submitForm() {
  loading.value = true
  try {
    const updateReq = {
      title: job.value.title,
      description: job.value.description,
      location: job.value.location,
      salaryMin: job.value.salaryMin,
      salaryMax: job.value.salaryMax,
      employmentType: job.value.employmentType,
      requirements: job.value.requirements,
      status: job.value.status,
    }
    await api.put(`/jobs/${job.value.id}`, updateReq)
    toast.success('Ndryshimet u ruajtën me sukses!')
    setTimeout(() => {
      router.push(`/jobs/${job.value.id}`)
    }, 1000)
  } catch (e) {
    toast.error(e.response?.data?.message || 'Gabim gjatë ruajtjes!')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.edit-job-bg {
  min-height: 100vh;
  background: #f7fafd;
  padding-bottom: 100px;
}
.edit-job-wrapper {
  max-width: 600px;
  background: #fff;
  border-radius: 16px;
  margin: 45px auto 0 auto;
  padding: 38px 40px;
  box-shadow: 0 4px 28px #246bfd18;
  border: 1.3px solid #f1f3fa;
}
.edit-job-wrapper h2 {
  text-align: center;
  color: #246BFD;
  font-size: 1.47em;
  margin-bottom: 20px;
  font-weight: 800;
}
.edit-job-form .form-group {
  margin-bottom: 20px;
}
.edit-job-form label {
  font-weight: 700;
  color: #2d3a5a;
  display: block;
  margin-bottom: 6px;
}
.edit-job-form input,
.edit-job-form textarea,
.edit-job-form select {
  width: 100%;
  padding: 9px 13px;
  border-radius: 6px;
  border: 1.2px solid #e1e9f8;
  font-size: 1.06em;
  outline: none;
  transition: border .17s;
  background: #fafdff;
}
.edit-job-form input:focus,
.edit-job-form textarea:focus,
.edit-job-form select:focus {
  border-color: #246BFD;
}
.salary-group {
  display: flex;
  gap: 14px;
}
.salary-group > div {
  flex: 1;
}
.form-actions {
  margin-top: 25px;
  display: flex;
  gap: 18px;
  align-items: center;
}
.form-actions button {
  background: #246BFD;
  color: #fff;
  border: none;
  padding: 11px 25px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background .17s;
}
.form-actions button:disabled {
  background: #b9cdf7;
  cursor: not-allowed;
}
.cancel-btn {
  color: #246BFD;
  padding: 11px 18px;
  border-radius: 8px;
  font-weight: 600;
  background: #fafdff;
  border: 1px solid #e4eaf6;
  text-decoration: none;
  transition: background .15s;
}
.cancel-btn:hover {
  background: #f0f6ff;
}
.loading {
  text-align: center;
  color: #888;
  margin-top: 80px;
  font-size: 1.21em;
}

@media (max-width: 700px) {
  .edit-job-wrapper {
    max-width: 97vw;
    padding: 16px 8vw;
  }
}
</style>
