<template>
  <nav class="navbar">
    <div class="nav-left">
      <span class="logo">JobHive</span>
    </div>
    <div class="nav-links">
      <router-link to="/dashboard" exact>Home</router-link>
      <router-link to="/jobs">Punet</router-link>
      <!-- EMPLOYER -->
      <router-link v-if="auth.userRole === 'EMPLOYER'" to="/add-job">Shto pune</router-link>
      <router-link v-if="auth.userRole === 'EMPLOYER'" to="/applications" style="position:relative;">
        Aplikimet
        <span v-if="pendingCount > 0" class="noti-badge">{{ pendingCount }}</span>
      </router-link>
      <!-- USER -->
      <router-link
          v-if="auth.userRole === 'USER'"
          to="/my-applications"
          style="position:relative;"
          @click="clearResolvedCount"
      >
        Aplikimet e mia
        <span
            v-if="showResolvedBadge && resolvedCount > 0"
            class="noti-badge"
        >{{ resolvedCount }}</span>
      </router-link>
      <router-link
          v-if="auth.isLoggedIn"
          to="/profile"
          class="profile-link"
      >
        <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="#246BFD" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="7" r="4"/>
          <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/>
        </svg>
      </router-link>
      <router-link v-else to="/login" class="profile-link">
        <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="#888" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="7" r="4"/>
          <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/>
        </svg>
      </router-link>
      <button @click="logout" class="logout-btn">Log out</button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authstore'
import api from '../services/api'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()


const pendingCount = ref(0)
const resolvedCount = ref(0)

// badge-i do të mshehët nëse është pa aplikimet (flag ruhet në localStorage)
const showResolvedBadge = ref(true)

// E përdor këtë key që me mos pas konflikt nqs ka user të ndryshem
function badgeFlagKey() {
  return `jh_resolved_badge_hidden_${auth.loggedInUser?.id || ""}`
}

// Kur useri klikon ose navigon te aplikimet, badge mshehët & ruhet flag në localStorage
function clearResolvedCount() {
  showResolvedBadge.value = false
  if (auth.loggedInUser?.id) {
    localStorage.setItem(badgeFlagKey(), "1")
  }
}

// Në çdo ndërrim të rrugës (routing), nëse jemi te aplikimet, largo badge
watch(
    () => route.path,
    (newPath) => {
      if (newPath === '/my-applications' && auth.userRole === 'USER') {
        clearResolvedCount()
      }
    }
)

async function fetchNotifications() {
  if (auth.userRole === 'EMPLOYER') {
    const companyId = localStorage.getItem('companyId')
    if (companyId) {
      try {
        const res = await api.get(`/applications/by-company/${companyId}/pending-count`)
        pendingCount.value = res.data
      } catch (e) {
        pendingCount.value = 0
      }
    }
  }
  if (auth.userRole === 'USER' && auth.loggedInUser?.id) {
    try {
      const res = await api.get(`/applications/by-user/${auth.loggedInUser.id}/resolved-count`)
      resolvedCount.value = res.data
      // Nëse ka badge, kontrollo a është pa (nga localStorage)
      const hideBadge = localStorage.getItem(badgeFlagKey()) === "1"
      // Nëse ka resolved items, shfaq badge vetëm nëse s'është pa
      showResolvedBadge.value = !(hideBadge && resolvedCount.value > 0)
      // Nëse s'ka resolved, reseto flag-un (që të shfaqet badge herën tjetër)
      if (resolvedCount.value === 0) localStorage.removeItem(badgeFlagKey())
    } catch (e) {
      resolvedCount.value = 0
      showResolvedBadge.value = false
    }
  }
}

onMounted(() => {
  fetchNotifications()
  window.$fetchNotifications = fetchNotifications
})

watch(() => [auth.userRole, auth.loggedInUser?.id], fetchNotifications)

function logout() {
  auth.logOut() // kjo e fshin token + reseton state-in direkt!
  localStorage.removeItem('companyId')
  router.push('/login')
}
</script>

<style scoped>
.noti-badge {
  background: #ef4444;
  color: #fff;
  font-size: 0.82em;
  font-weight: 700;
  border-radius: 99px;
  padding: 2px 9px;
  position: absolute;
  top: -9px;
  right: -20px;
  box-shadow: 0 1px 4px #ef444466;
}
.navbar {
  width: 95%;
  background: #fff;
  color: #1B1F3A;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 38px;
  box-shadow: 0 2px 16px 0 rgba(36,107,253,0.05);
  border-bottom: 2.5px solid #f5f7fa;
  min-height: 64px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-size: 1.6em;
  font-weight: 900;
  letter-spacing: -1px;
  color: #246BFD;
  background: linear-gradient(120deg, #246BFD 65%, #FFE156 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-links a {
  color: #1B1F3A;
  font-size: 1.09em;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 4px;
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
  position: relative;
}

.nav-links a.router-link-exact-active,
.nav-links a.router-link-active {
  color: #246BFD;
  background: #f5f7fa;
  text-decoration: none;
}

.nav-links a::after {
  content: '';
  display: block;
  width: 0%;
  height: 2.5px;
  background: linear-gradient(90deg, #246BFD 60%, #FFE156 100%);
  border-radius: 2px;
  margin-top: 2.5px;
  transition: width 0.2s;
}

.nav-links a:hover::after {
  width: 80%;
}
.nav-links a:hover {
  color: #246BFD;
  background: #f5f7fa;
}

.logout-btn {
  margin-left: 24px;
  padding: 9px 23px;
  border-radius: 6px;
  font-weight: 700;
  border: 2px solid #246BFD;
  background: #fff;
  color: #246BFD;
  font-size: 1.03em;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.15s;
}

.logout-btn:hover {
  background: #246BFD;
  color: #fff;
  border-color: #246BFD;
}

@media (max-width: 700px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 14px 6vw;
    min-height: 58px;
    gap: 10px;
  }
  .nav-links {
    gap: 18px;
    width: 100%;
    justify-content: flex-start;
    margin-top: 4px;
    flex-wrap: wrap;
  }
  .logo {
    font-size: 1.23em;
  }
  .logout-btn {
    margin-left: 12px;
    padding: 8px 16px;
    font-size: 0.97em;
  }
}
</style>
