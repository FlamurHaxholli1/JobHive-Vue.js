<template>
  <div v-if="company" class="company-details-bg">
    <div class="company-card">
      <div class="header">
        <div v-if="company.logoUrl" class="logo-block">
          <img :src="company.logoUrl" alt="Logo" class="logo" />
        </div>
        <div class="main-info">
          <h2 class="company-name">{{ company.name }}</h2>
          <a v-if="company.website" :href="company.website" target="_blank" class="website">
            <svg width="16" height="16" fill="none" stroke="#246BFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:4px;">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>
            </svg>
            Shko te Webi
          </a>
        </div>
      </div>
      <p class="desc">
        {{ company.description || 'Nuk ka përshkrim.' }}
      </p>
      <div class="meta">
        <div>
          <b>Krijuar nga:</b>
          <span v-if="company.createdBy">{{ company.createdBy.name }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <b>Data:</b>
          <span>{{ formatDate(company.createdAt) }}</span>
        </div>
      </div>
      <router-link to="/jobs" class="back-btn">⬅️ Kthehu te jobat</router-link>
    </div>
  </div>
  <div v-else class="loading">Duke ngarkuar të dhënat e kompanisë...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const company = ref(null)

onMounted(async () => {
  try {
    const res = await api.get(`/companies/${route.params.id}`)
    company.value = res.data
  } catch (e) {
    company.value = null
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('sq-AL', {
    year: 'numeric', month: 'long', day: '2-digit'
  })
}
</script>

<style scoped>
.company-details-bg {
  min-height: 100vh;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
}

.company-card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 6px 28px 0 rgba(36,107,253,0.07), 0 1.5px 16px rgba(255,225,86,0.05);
  max-width: 520px;
  width: 100%;
  padding: 38px 38px 26px 38px;
  margin-bottom: 60px;
  position: relative;
  animation: fadein .5s;
  border: 1.3px solid #f1f3fa;
}

@keyframes fadein {
  0% { opacity: 0; transform: translateY(40px);}
  100% { opacity: 1; transform: none;}
}

.header {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 20px;
}

.logo-block {
  flex-shrink: 0;
  background: #f5f7fa;
  border-radius: 14px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 7px #e9f1fd;
  border: 1.5px solid #e6ecfa;
}

.main-info {
  flex: 1;
  min-width: 0;
}

.company-name {
  margin: 0 0 8px 0;
  color: #246BFD;
  font-size: 2.1em;
  font-weight: 900;
  letter-spacing: -1.2px;
  word-break: break-word;
}

.website {
  color: #246BFD;
  text-decoration: none;
  font-weight: 700;
  background: #f4f8ff;
  padding: 5px 14px 5px 8px;
  border-radius: 8px;
  transition: background .18s, color .18s;
  font-size: 1.07em;
  display: inline-flex;
  align-items: center;
  margin-top: 1px;
}
.website:hover {
  background: #e2eefd;
  color: #1B1F3A;
}

.desc {
  font-size: 1.15em;
  color: #333;
  margin-bottom: 24px;
  border-left: 4px solid #FFE156;
  padding-left: 16px;
  background: #fffae9;
  border-radius: 7px;
}

.meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  margin-bottom: 26px;
  font-size: 1.04em;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 10px 15px;
}

.back-btn {
  display: inline-block;
  margin-top: 9px;
  color: #246BFD;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.08em;
  padding: 7px 18px;
  border-radius: 6px;
  background: #f5f7fa;
  transition: background 0.16s, color 0.16s;
}
.back-btn:hover {
  background: #246BFD;
  color: #fff;
}

.loading {
  min-height: 220px;
  text-align: center;
  font-size: 1.2em;
  color: #888;
  margin-top: 80px;
}

/* Responsive */
@media (max-width: 600px) {
  .company-card {
    padding: 18px 7vw 14px 7vw;
    border-radius: 11px;
  }
  .company-details-bg {
    padding-top: 26px;
  }
  .header {
    gap: 13px;
  }
  .logo {
    width: 52px;
    height: 52px;
    border-radius: 7px;
  }
}
</style>
