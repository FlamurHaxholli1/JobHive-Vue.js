<template>
  <div class="my-applications-page">
    <Navbar />
    <div class="my-applications-container">
      <h2>Aplikimet e mia</h2>
      <div v-if="loading">Duke i marrë aplikimet...</div>
      <div v-else-if="!applications.length">
        Nuk ke aplikuar ende për asnjë punë.
      </div>
      <div v-else>
        <div v-for="app in applications" :key="app.id" class="my-app-card">
          <div>
            <b>{{ app.job?.title || '-' }}</b>
            <span class="appl-status" :class="app.status">{{ app.status }}</span>
            <div>
              <!-- Kjo link CV-je do të shfaq dokumentin në tab të ri (nëse është PDF ose imazh) -->
              <a
                  :href="getFullCvUrl(app.resumeUrl)"
                  target="_blank"
                  rel="noopener"
              >
                CV
              </a>

            </div>
            <div><b>Letra:</b> {{ app.coverLetter }}</div>
            <div style="margin-top:7px;">
              Statusi:
              <span :class="app.status" style="font-weight:700;">{{ app.status }}</span>
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

const auth = useAuthStore()
const applications = ref([])
const loading = ref(true)

function getFullCvUrl(resumeUrl) {
  const apiBase = 'http://localhost:8080' // ose vendose nga environment për prodhim
  if (!resumeUrl) return '#'
  if (resumeUrl.startsWith('http')) return resumeUrl
  if (resumeUrl.startsWith('/uploads')) return apiBase + resumeUrl
  return apiBase + `/uploads/cvs/${resumeUrl}`
}

onMounted(async () => {
  if (!auth.isUser || !auth.loggedInUser?.id) {
    loading.value = false
    return
  }
  try {
    const res = await api.get(`/applications/by-user/${auth.loggedInUser.id}`)
    applications.value = res.data
  } catch (e) {
    applications.value = []
  } finally {
    loading.value = false
  }
})
</script>


<style scoped>
.my-applications-page { background:#f7fafd;min-height:100vh;padding-bottom:100px }
.my-applications-container { max-width:800px;margin:34px auto 0 auto;background:#fff;border-radius:14px;box-shadow:0 4px 22px #246bfd11;padding:32px 28px 18px 28px }
.my-app-card { border:1.2px solid #e5e9f7;border-radius:10px;margin-bottom:16px;padding:16px 19px;background:#f9fafc;box-shadow:0 1.5px 10px #246bfd10 }
.appl-status { padding:2px 14px;border-radius:8px;margin-left:12px;font-weight:600;text-transform:capitalize;font-size:.98em;background:#f1f5f9;display:inline-block }
.appl-status.pending { background:#ffe15622;color:#b19507 }
.appl-status.accepted { background:#dcfce7;color:#0d7140 }
.appl-status.rejected { background:#fee2e2;color:#991b1b }
</style>
