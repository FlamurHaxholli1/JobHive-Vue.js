<template>
  <div class="admin-dashboard">
    <Sidebar :active="activeSection" @change-section="activeSection = $event" @logout="logout" />

    <div class="main-content">
      <Topbar title="Admin Panel" />

      <!-- 📊 Statistika -->
      <div class="stat-grid" v-if="activeSection === 'overview'">
        <div class="stat-card" @click="activeSection = 'users'">
          <div class="label">Përdorues</div>
          <div class="count">{{ stats.users }}</div>
        </div>
        <div class="stat-card" @click="activeSection = 'companies'">
          <div class="label">Kompanitë</div>
          <div class="count">{{ stats.companies }}</div>
        </div>
        <div class="stat-card" @click="activeSection = 'jobs'">
          <div class="label">Jobs</div>
          <div class="count">{{ stats.jobs }}</div>
        </div>
      </div>

      <!-- Komponenti përkatës -->
      <component :is="sectionComponent" v-if="activeSection !== 'overview'" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
import UserTable from '../components/UserTable.vue'
import CompanyTable from '../components/CompanyTable.vue'
import JobTable from '../components/JobTable.vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'vue3-toastify' // <--- SHTO KËTË

const router = useRouter()
const activeSection = ref('overview')

const stats = ref({
  users: 0,
  companies: 0,
  jobs: 0,
  applications: 0
})

const sectionComponent = computed(() => {
  switch (activeSection.value) {
    case 'users': return UserTable
    case 'companies': return CompanyTable
    case 'jobs': return JobTable
    default: return null
  }
})

let currentUserId = null
const token = localStorage.getItem('token')
if (token) {
  const decoded = jwtDecode(token)
  currentUserId = decoded.userId || decoded.id
}

const loadStats = async () => {
  try {
    const allUsers = (await api.get('/admin/users')).data
    stats.value.users = allUsers.filter(u => u.id !== currentUserId).length

    stats.value.companies = (await api.get('/companies')).data.length
    stats.value.jobs = (await api.get('/jobs')).data.length
    stats.value.applications = (await api.get('/applications')).data.length
  } catch (err) {
    toast.error('Gabim gjatë ngarkimit të statistikave!')
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('companyId')
  router.push('/login')
}

onMounted(loadStats)
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.main-content {
  flex: 1;
  padding: 20px;
}

/* 📊 Statistika: stil i pastër dhe në 2x2 */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(145deg, #ffffff, #f3f4f6);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.07);
  background: linear-gradient(145deg, #f9fafb, #eef1f5);
}

.stat-card .label {
  font-size: 15px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 8px;
}

.stat-card .count {
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
}

/* Responsive: me ra në një kolonë në ekran të vogël */
@media (max-width: 700px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
