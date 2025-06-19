<!-- JobsPage.vue -->
<template>
  <div>
    <Navbar />
    <main class="jobs-page">
      <!-- HEADER + SEARCH CARD -->
      <section class="header-search-card">
        <div class="header-content">
          <h1>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFE156" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:10px;">
              <rect x="2" y="7" width="20" height="13" rx="3"/>
              <path d="M16 21V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v15"/>
            </svg>
            Pozitat e Lira
          </h1>
          <p class="page-subtitle">Gjej mundësinë tënde të re për karrierë</p>
        </div>
        <div class="search-container">
          <input
              v-model="search"
              placeholder="Kërko sipas titullit, kompanisë apo lokacionit..."
              class="search"
              @input="filterJobs"
          />
        </div>
      </section>

      <!-- LOADING STATE -->
      <section v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Duke i ngarkuar pozitat...</p>
      </section>

      <!-- EMPTY STATE -->
      <section v-else-if="!filteredJobs.length" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#246BFD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Nuk u gjet asnjë punë</h3>
        <p>Provo të ndryshosh kriteret e kërkimit</p>
      </section>

      <!-- JOB CARDS GRID -->
      <section v-else class="job-cards-grid">
        <article
            class="job-card"
            v-for="job in filteredJobs"
            :key="job.id"
            @click="goToJobDetails(job.id)"
        >
          <div class="job-main-info">
            <div class="job-title-company">
              <h2>{{ job.title }}</h2>
              <div class="company">{{ job.company?.name }}</div>
            </div>
            <div class="job-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#246BFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {{ job.location }}
            </div>
          </div>
          <div class="job-details">
            <div class="salary-type">
              <div v-if="job.salaryMin" class="salary">
                {{ job.salaryMin }} - {{ job.salaryMax }} €
              </div>
              <div class="employment-type">
                {{ job.employmentType }}
              </div>
            </div>
            <div class="job-footer">
              <div class="posted-date">
                Publikuar: {{ formatDate(job.createdAt) }}
              </div>
              <div class="status" :class="job.status.toLowerCase()">
                {{ job.status === 'active' ? 'Aktive' : job.status === 'closed' ? 'E mbyllur' : job.status === 'pending' ? 'Në pritje' : job.status }}
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import api from '../services/api'
import {useAuthStore} from "../stores/authStore.js";

const auth = useAuthStore()
const router = useRouter()
const jobs = ref([])
const loading = ref(true)
const search = ref('')
const filteredJobs = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/jobs')
    jobs.value = res.data
    filteredJobs.value = res.data
  } catch {
    jobs.value = []
    filteredJobs.value = []
  } finally {
    loading.value = false
  }
})

function filterJobs() {
  if (!search.value) {
    filteredJobs.value = jobs.value
    return
  }
  const searchTerm = search.value.toLowerCase()
  filteredJobs.value = jobs.value.filter(job =>
      (job.title && job.title.toLowerCase().includes(searchTerm)) ||
      (job.company && job.company.name && job.company.name.toLowerCase().includes(searchTerm)) ||
      (job.location && job.location.toLowerCase().includes(searchTerm))
  )
}

function goToJobDetails(id) {
  router.push(`/jobs/${id}`)
}

function goToAddJob() {
  router.push('/jobs/add')
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('sq-AL', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
</script>

<style scoped>
.jobs-page {
  width: 100%;
  min-height: 100vh;
  background: #F5F7FA;
  padding: 32px 0 60px 0;
}
/* HEADER + SEARCH BANNER CARD */
.header-search-card {
  background: #246BFD;
  border-radius: 18px;
  box-shadow: 0 6px 28px #246bfd17;
  max-width: 680px;
  margin: 0 auto 34px auto;
  padding: 32px 28px 22px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-content h1 {
  color: #fff;
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  letter-spacing: -1.1px;
}
.page-subtitle {
  color: #FFE156;
  font-size: 1.13rem;
  font-weight: 600;
  margin-bottom: 14px;
}
.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.search {
  width: 100%;
  max-width: 420px;
  padding: 13px 16px;
  border-radius: 7px;
  border: 1.7px solid #e3e7f0;
  font-size: 1.07rem;
  background: #fff;
  color: #1B1F3A;
  transition: border 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 4px 0 rgba(36,107,253,0.03);
}
.search:focus {
  outline: none;
  border-color: #FFE156;
  box-shadow: 0 0 0 2px #ffe15644;
}
/* JOB CARDS */
.job-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 34px;
  padding: 0 4vw;
}
.job-card {
  background: #fff;
  border-radius: 16px;
  padding: 26px 20px 18px 20px;
  border: 1.7px solid #f1f3fa;
  box-shadow: 0 3px 18px 0 rgba(36,107,253,0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: border 0.22s, box-shadow 0.18s, transform 0.17s;
  min-height: 180px;
}
.job-card:hover {
  border: 1.7px solid #246BFD;
  box-shadow: 0 6px 22px 0 rgba(36,107,253,0.08);
  transform: translateY(-2px) scale(1.015);
}
.job-main-info {
  margin-bottom: 14px;
}
.job-title-company h2 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1B1F3A;
  margin-bottom: 2px;
}
.company {
  color: #246BFD;
  font-weight: 600;
  font-size: 1.02rem;
}
.job-location {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #246BFD;
  font-size: 0.98rem;
  margin-top: 11px;
}
.job-location svg {
  display: inline;
}
.job-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.salary-type {
  display: flex;
  align-items: center;
  gap: 15px;
}
.salary {
  font-weight: 700;
  color: #1B1F3A;
  font-size: 1.05rem;
}
.employment-type {
  background-color: #FFE15622;
  color: #856100;
  border-radius: 7px;
  padding: 4px 14px;
  font-size: 0.93rem;
  font-weight: 600;
}
.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: #888;
  margin-top: 8px;
}
.status {
  padding: 4px 14px;
  border-radius: 13px;
  font-size: 0.93rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.2px;
}
.status.active {
  background-color: #dcfce7;
  color: #0d7140;
}
.status.pending {
  background-color: #ffe15644;
  color: #b19507;
}
.status.closed {
  background-color: #fee2e2;
  color: #991b1b;
}
/* LOADING & EMPTY STATE */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 90px 0 0 0;
  gap: 18px;
  text-align: center;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #246BFD;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.empty-state h3 {
  font-size: 1.24rem;
  font-weight: 800;
  color: #1B1F3A;
}
.empty-state p {
  color: #333;
}
/* ADD JOB BUTTON */
.add-job-btn-wrap { display: flex; justify-content: flex-end; max-width: 680px; margin: 14px auto 0 auto; }
.add-job-btn {
  background: #FFE156;
  color: #246BFD;
  font-weight: 800;
  border: none;
  border-radius: 8px;
  padding: 11px 28px;
  font-size: 1.07em;
  cursor: pointer;
  box-shadow: 0 2px 7px #ffe15622;
  transition: background 0.18s;
}
.add-job-btn:hover {
  background: #ffd700;
}
/* RESPONSIVE */
@media (max-width: 800px) {
  .header-search-card {
    max-width: 98vw;
    padding: 18px 8vw;
    border-radius: 9px;
  }
  .job-cards-grid {
    grid-template-columns: 1fr;
    padding: 0 2vw;
    gap: 18px;
  }
  .job-card {
    padding: 16px 7px 12px 7px;
    border-radius: 11px;
    min-height: 120px;
  }
}
</style>
