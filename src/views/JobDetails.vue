<template>
  <div class="job-details-bg">
    <Navbar />

    <div v-if="loading" class="loading">Duke u ngarkuar...</div>
    <div v-else-if="!job" class="not-found">
      Ky vend pune nuk ekziston ose është larguar.
    </div>
    <div v-else class="job-hero">
      <div class="hero-info">
        <div class="hero-icon">
          <svg width="52" height="52" fill="none" stroke="#246BFD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <rect x="2.5" y="7" width="19" height="13" rx="2" />
            <path d="M16 20V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v14"/>
          </svg>
        </div>
        <div>
          <h1>{{ job.title }}</h1>
          <div class="company-line">
            <span>
              <svg width="16" height="16" fill="none" stroke="#1B1F3A" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><rect x="7" y="2" width="10" height="5" rx="1"/><path d="M8 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/></svg>
              {{ job.company?.name || '-' }}
            </span>
            <span class="dot">·</span>
            <span>
              <svg width="16" height="16" fill="none" stroke="#246BFD" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ job.location || '-' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="job" class="job-details-main">
      <div class="details-row">
        <div class="details-item">
          <svg width="20" height="20" fill="none" stroke="#246BFD" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <div>
            <label>Publikuar</label>
            <div>{{ formatDate(job.createdAt) }}</div>
          </div>
        </div>
        <div class="details-item">
          <svg width="20" height="20" fill="none" stroke="#FFE156" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2l4-4"/>
          </svg>
          <div>
            <label>Statusi</label>
            <div :class="['status', job.status?.toLowerCase()]">{{ job.status }}</div>
          </div>
        </div>
        <div class="details-item">
          <svg width="20" height="20" fill="none" stroke="#246BFD" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12h8"/>
            <path d="M12 8v8"/>
          </svg>
          <div>
            <label>Paga</label>
            <div v-if="job.salaryMin">{{ job.salaryMin }}€ - {{ job.salaryMax }}€</div>
            <div v-else>-</div>
          </div>
        </div>
        <div class="details-item">
          <svg width="20" height="20" fill="none" stroke="#1B1F3A" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="7" width="18" height="13" rx="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <div>
            <label>Tipi</label>
            <div>{{ job.employmentType || '-' }}</div>
          </div>
        </div>
      </div>

      <div class="desc-section">
        <h2>Përshkrimi i Punës</h2>
        <p>{{ job.description }}</p>
      </div>
      <div v-if="job.requirements" class="req-section">
        <h2>Kërkesat</h2>
        <ul>
          <li v-for="(line, i) in reqLines" :key="i">{{ line }}</li>
        </ul>
      </div>
      <div class="actions">
        <!-- Vetëm userat (punëkërkuesit) mund të aplikojnë -->
        <router-link
            v-if="auth.isLoggedIn && auth.userRole === 'USER'"
            :to="`/jobs/${job.id}/apply`"
            class="apply-btn"
        >
          📝 Apliko për këtë punë
        </router-link>

        <!-- Vetëm employer-i që ka postu këtë job mund të editoj/fshijë -->
        <router-link
            v-if="canEditJob"
            :to="`/jobs/${job.id}/edit`"
            class="edit-btn"
        >
          ✏️ Edito
        </router-link>
        <button
            v-if="canEditJob"
            @click="askDelete"
            class="delete-btn"
        >
          🗑️ Fshi
        </button>

        <span class="company-link">
          <router-link :to="`/company/${job.company?.id}`">
            {{ job.company?.name }}
          </router-link>
        </span>
      </div>

      <!-- MODAL KONFIRMIMI -->
      <!-- ... pjesa lart siç e ke ... -->

      <!-- MODAL KONFIRMIMI -->
      <transition name="fade">
        <div v-if="showConfirm" class="modal-outer">
          <div class="modal">
            <div class="modal-icon">
              <svg width="36" height="36" fill="none" stroke="#e53a3a" stroke-width="2.6" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#fdeaea" stroke-width="7"/>
                <path d="M15 9l-6 6M9 9l6 6" stroke="#e53a3a" stroke-width="2.6" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="modal-title">A je i sigurt?</div>
            <div class="modal-text">Kjo punë do të fshihet përgjithmonë. Dëshiron të vazhdosh?</div>
            <div class="modal-actions">
              <button class="btn-cancel" @click="showConfirm=false">Anulo</button>
              <button class="btn-delete" @click="confirmDelete">Fshij</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import Navbar from '../components/Navbar.vue'
import { useAuthStore } from '../stores/authstore'
import { toast } from 'vue3-toastify'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const job = ref(null)
const loading = ref(true)
const showConfirm = ref(false)

onMounted(async () => {
  try {
    const res = await api.get(`/jobs/${route.params.id}`)
    job.value = res.data
  } catch (err) {
    job.value = null
    toast.error("Gabim gjatë ngarkimit të punës!")
  } finally {
    loading.value = false
  }
})

const reqLines = computed(() => {
  if (!job.value?.requirements) return []
  return job.value.requirements.split('\n').filter(Boolean)
})

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('sq-AL', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const canEditJob = computed(() => {
  return (
      auth.isLoggedIn &&
      auth.userRole === 'EMPLOYER' &&
      job.value?.postedBy?.id === auth.loggedInUser?.id
  )
})

function askDelete() {
  showConfirm.value = true
}

async function confirmDelete() {
  try {
    await api.delete(`/jobs/${job.value.id}`)
    toast.success("Puna u fshi me sukses!")
    router.push('/jobs')
  } catch (e) {
    toast.error('Gabim gjatë fshirjes së punës!')
  } finally {
    showConfirm.value = false
  }
}
</script>

<style scoped>
/* ... (stilet si i ke, veç mos harro edhe këto për modal) */
.modal-overlay {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.18); display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff; padding: 25px 34px; border-radius: 10px; min-width: 240px;
  box-shadow: 0 8px 32px #246bfd25;
  text-align: center;
}
.modal-content button { margin: 0 7px; }

.job-details-bg {
  background: #f7fafd;
  min-height: 100vh;
  padding-bottom: 100px;
}
.job-hero {
  background: linear-gradient(90deg, #246BFD15 60%, #FFE15614 100%);
  border-radius: 0 0 22px 22px;
  box-shadow: 0 4px 32px #246bfd11;
  max-width: 850px;
  margin: 42px auto 0 auto;
  padding: 32px 42px 18px 42px;
  display: flex;
  align-items: center;
  border: 1.3px solid #f1f3fa;
}
.hero-info {
  display: flex;
  gap: 28px;
  align-items: center;
}
.hero-icon {
  background: #f1f5fa;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1.5px 8px #246bfd11;
}
.job-hero h1 {
  margin: 0 0 8px 0;
  font-size: 2.15em;
  color: #246BFD;
  font-weight: 900;
  letter-spacing: -1px;
}
.company-line {
  color: #1B1F3A;
  font-weight: 500;
  font-size: 1.11em;
  margin-top: 2px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.company-line .dot {
  color: #bdbdbd;
  margin: 0 6px;
  font-size: 1.2em;
}
.job-details-main {
  max-width: 850px;
  margin: 0 auto;
  padding: 38px 44px 48px 44px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 32px #246bfd13;
  border: 1.3px solid #f1f3fa;
}
.details-row {
  display: flex;
  flex-wrap: wrap;
  gap: 33px;
  margin-bottom: 30px;
  margin-top: 18px;
  border-bottom: 1.3px solid #f5f7fa;
  padding-bottom: 17px;
}
.details-item {
  display: flex;
  gap: 13px;
  align-items: flex-start;
  min-width: 145px;
  color: #1B1F3A;
}
.details-item label {
  font-size: 0.97em;
  color: #888;
  font-weight: 600;
  margin-bottom: 1.5px;
}
.status {
  text-transform: capitalize;
  padding: 2px 13px;
  border-radius: 10px;
  font-weight: 700;
  display: inline-block;
  margin-left: 0;
  font-size: 1em;
  letter-spacing: 0.2px;
  background: #f5f7fa;
}
.status.active {
  background: #dcfce7;
  color: #0d7140;
}
.status.closed {
  background: #fee2e2;
  color: #991b1b;
}
.status.pending {
  background: #ffe15644;
  color: #b19507;
}
.desc-section, .req-section {
  margin-bottom: 28px;
}
.desc-section h2, .req-section h2 {
  color: #246BFD;
  margin-bottom: 7px;
  font-size: 1.13em;
  font-weight: 800;
}
.desc-section p, .req-section ul {
  color: #222;
  font-size: 1.09em;
  margin: 0;
}
.req-section ul {
  margin: 0;
  padding-left: 18px;
  list-style-type: disc;
}
.actions {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.apply-btn,
.edit-btn,
.delete-btn {
  border: none;
  outline: none;
  border-radius: 8px;
  padding: 11px 28px;
  font-size: 1.05em;
  font-weight: bold;
  cursor: pointer;
  transition: background .19s, box-shadow .19s, color .19s;
  box-shadow: 0 1px 7px #246bfd18;
  text-decoration: none;
  display: inline-block;
}

.apply-btn {
  background: #246BFD;
  color: #fff;
}
.apply-btn:hover {
  background: #1958cb;
}

.edit-btn {
  background: #fff6cc;
  color: #7e6500;
  border: 1.1px solid #ffe156;
}
.edit-btn:hover {
  background: #ffe156;
  color: #7e6500;
}

.delete-btn {
  background: #ffe2e2;
  color: #bb1818;
  border: 1.1px solid #ffb5b5;
}
.delete-btn:hover {
  background: #ffb5b5;
  color: #7d1b1b;
}

.company-link a {
  color: #246BFD;
  font-weight: 700;
  font-size: 1.07em;
  text-decoration: none;
  transition: color 0.2s;
}
.company-link a:hover {
  text-decoration: underline;
  color: #1B1F3A;
}
.loading, .not-found {
  text-align: center;
  color: #888;
  margin-top: 110px;
  font-size: 1.23em;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .22s cubic-bezier(.4,0,.2,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modal-outer {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(24, 36, 58, 0.13);
  display: flex; align-items: center; justify-content: center;
  z-index: 5000;
  backdrop-filter: blur(1.5px);
}
.modal {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 32px 0 #e53a3a19, 0 1.5px 14px #246bfd0a;
  min-width: 310px;
  padding: 34px 32px 22px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popin .20s cubic-bezier(.4,0,.2,1);
}
@keyframes popin {
  from { transform: scale(0.92); opacity:0.3 }
  to { transform: scale(1); opacity:1 }
}
.modal-icon {
  margin-bottom: 10px;
}
.modal-title {
  font-weight: 800;
  color: #e53a3a;
  font-size: 1.25em;
  margin-bottom: 6px;
}
.modal-text {
  color: #222;
  font-size: 1.03em;
  margin-bottom: 20px;
  text-align: center;
  line-height: 1.5;
}
.modal-actions {
  display: flex; gap: 18px;
  margin-top: 8px;
}
.btn-cancel {
  background: #f7fafd;
  color: #1b1f3a;
  border: 1.5px solid #e3e7f0;
  border-radius: 7px;
  padding: 9px 24px;
  font-size: 1em;
  font-weight: 700;
  cursor: pointer;
  transition: background .17s;
}
.btn-cancel:hover {
  background: #e9eaea;
}
.btn-delete {
  background: #e53a3a;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 9px 24px;
  font-size: 1em;
  font-weight: 700;
  cursor: pointer;
  transition: background .17s;
  box-shadow: 0 2px 10px #e53a3a22;
}
.btn-delete:hover {
  background: #b71818;
}


@media (max-width: 900px) {
  .job-hero, .job-details-main {
    max-width: 99vw;
    padding: 18px 4vw 18px 4vw;
    border-radius: 13px;
  }
  .hero-info {
    gap: 15px;
  }
}
@media (max-width: 600px) {
  .job-hero, .job-details-main {
    padding: 10px 2vw 10px 2vw;
    border-radius: 8px;
  }
  .job-hero h1 {
    font-size: 1.1em;
  }
  .details-row {
    flex-direction: column;
    gap: 18px;
  }
  .actions {
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
}
</style>
