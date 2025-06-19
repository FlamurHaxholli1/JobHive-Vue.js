<template>
  <div class="applications-page">
    <Navbar />
    <div class="applications-container">
      <h2>Aplikimet për kompaninë tënde</h2>
      <div v-if="loading">Duke i marrë aplikimet...</div>
      <div v-else-if="!applications.length">
        Nuk ka aplikime për momentin.
      </div>
      <div v-else>
        <div v-for="app in applications" :key="app.id" class="application-card">
          <div>
            <b>{{ app.user?.name || 'User' }}</b>
            <span class="appl-status" :class="app.status">{{ app.status }}</span>
            <div>
              <a :href="getFullCvUrl(app.resumeUrl)" target="_blank" rel="noopener">CV</a>
            </div>
            <div><b>Puna:</b> {{ app.job?.title || '-' }}</div>
            <div><b>Letra:</b> {{ app.coverLetter }}</div>
            <!-- BUTONAT: Vetëm për employer-in e kompanisë së aplikimit -->
            <div>
              <button @click="changeStatus(app.id, 'accepted')" class="accept-btn">Prano</button>
              <button @click="changeStatus(app.id, 'rejected')" class="reject-btn">Refuzo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import api from '../services/api'
import { useAuthStore } from '../stores/authstore'
import { toast } from 'vue3-toastify' // SHTO KËTË

const auth = useAuthStore()
const applications = ref([])
const loading = ref(true)

function getFullCvUrl(resumeUrl) {
  const apiBase = 'http://localhost:8080'
  if (!resumeUrl) return '#'
  if (resumeUrl.startsWith('http')) return resumeUrl
  if (resumeUrl.startsWith('/uploads')) return apiBase + resumeUrl
  return apiBase + `/uploads/cvs/${resumeUrl}`
}

onMounted(async () => {
  const companyId = localStorage.getItem('companyId')
  if (!companyId) {
    toast.error('Së pari regjistro kompaninë!') // Toast edhe këtu
    loading.value = false
    return
  }
  try {
    const res = await api.get(`/applications/by-company/${companyId}`)
    applications.value = res.data
  } catch (e) {
    toast.error('Gabim gjatë marrjes së aplikimeve!')
    applications.value = []
  } finally {
    loading.value = false
  }
})

async function changeStatus(appId, status) {
  try {
    const companyId = localStorage.getItem('companyId')
    await api.put(`/applications/${appId}`, { status })
    toast.success('Statusi u përditësua me sukses!')
    // Refresh aplikimet
    const res = await api.get(`/applications/by-company/${companyId}`)
    applications.value = res.data
  } catch (e) {
    toast.error('Gabim gjatë përditësimit të statusit!')
  }
}
</script>

<style scoped>
.applications-page { background:#f7fafd;min-height:100vh;padding-bottom:100px }
.applications-container { max-width:900px;margin:34px auto 0 auto;background:#fff;border-radius:18px;box-shadow:0 4px 32px #246bfd11;padding:36px 34px 18px 34px }
.application-card { border:1.2px solid #e5e9f7;border-radius:12px;margin-bottom:21px;padding:19px 21px;background:#f9fafc;box-shadow:0 1.5px 10px #246bfd11 }
.appl-status { padding:2px 14px;border-radius:8px;margin-left:12px;font-weight:600;text-transform:capitalize;font-size:.98em;background:#f1f5f9;display:inline-block }
.appl-status.pending { background:#ffe15622;color:#b19507 }
.appl-status.accepted { background:#dcfce7;color:#0d7140 }
.appl-status.rejected { background:#fee2e2;color:#991b1b }
.accept-btn { background:#22c55e;color:#fff;border:none;padding:7px 20px;border-radius:5px;margin-right:10px;cursor:pointer; }
.reject-btn { background:#ef4444;color:#fff;border:none;padding:7px 20px;border-radius:5px;cursor:pointer; }
</style>
