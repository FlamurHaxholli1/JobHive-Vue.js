<template>
  <div class="add-job-page">
    <div class="add-job-container">
      <h2>Shto një punë të re</h2>
      <form @submit.prevent="addJob">
        <div class="form-group">
          <label>Titulli</label>
          <input v-model="job.title" required />
        </div>
        <div class="form-group">
          <label>Përshkrimi</label>
          <textarea v-model="job.description" required />
        </div>
        <div class="form-group">
          <label>Lokacioni</label>
          <input v-model="job.location" required />
        </div>
        <div class="form-group">
          <label>Paga minimale</label>
          <input v-model="job.salaryMin" type="number" min="0" required />
        </div>
        <div class="form-group">
          <label>Paga maksimale</label>
          <input v-model="job.salaryMax" type="number" min="0" required />
        </div>
        <div class="form-group">
          <label>Tipi i Punës</label>
          <select v-model="job.employmentType" required>
            <option value="" disabled selected>Zgjedh tipin</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div class="form-group">
          <label>Kërkesat</label>
          <textarea v-model="job.requirements" />
        </div>
        <button type="submit" :disabled="loading">
          <span v-if="!loading">Shto Punën</span>
          <span v-else style="font-size:1.2em;">Loading...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/authstore'
import { toast } from 'vue3-toastify'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const job = ref({
  title: '', description: '', location: '',
  salaryMin: '', salaryMax: '',
  employmentType: '', requirements: ''
})

async function addJob() {
  const companyId = localStorage.getItem('companyId')
  if (!companyId) {
    toast.error('Së pari regjistro kompaninë!')
    router.push('/register-company')
    return
  }
  loading.value = true
  try {
    await api.post('/jobs', {
      ...job.value,
      salaryMin: parseFloat(job.value.salaryMin),
      salaryMax: parseFloat(job.value.salaryMax),
      companyId: parseInt(companyId),
      postedBy: auth.loggedInUser?.id
    })
    toast.success('Puna u shtua me sukses!')
    setTimeout(() => {
      router.push('/jobs')
    }, 1300)
  } catch (e) {
    toast.error(e.response?.data?.message || 'Gabim gjatë shtimit të punës!')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-job-page { min-height:100vh;background:#f7fafd;padding:54px 0 }
.add-job-container { background:#fff;max-width:450px;margin:0 auto;padding:36px 34px 18px 34px;border-radius:13px;box-shadow:0 4px 32px #246bfd14; }
h2 { color:#246bfd;font-weight:800;font-size:2em;margin-bottom:6px }
.form-group { margin-bottom:18px;text-align:left }
label { display:block;font-weight:600;margin-bottom:5px;color:#333 }
input,textarea { width:100%;padding:9px 11px;border:1.5px solid #e3e7f0;border-radius:7px;font-size:1.07em }
select { width:100%;padding:10px 12px;border-radius:7px;border:1.5px solid #e3e7f0;font-size:1.07em;background:#fff;margin-top:2px }
input:focus, textarea:focus, select:focus { border-color: #246BFD; box-shadow: 0 0 0 2px #246bfd22; }
button { width:100%;padding:13px 0;background:#246bfd;color:#fff;border:none;border-radius:7px;font-weight:700;font-size:1.1em;cursor:pointer;margin-top:10px;transition: background 0.18s, box-shadow 0.18s; box-shadow: 0 2px 12px rgba(36,107,253,0.08); letter-spacing: 0.1px; }
button:disabled { opacity:0.65; cursor: not-allowed; }
button:hover:not(:disabled) { background: #1958cb; }
</style>
