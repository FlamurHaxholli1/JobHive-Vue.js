<template>
  <div class="profile-container">
    <!-- Back Button -->
    <router-link :to="backRoute" class="back-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      Back
    </router-link>

    <div class="profile-header">
      <div class="avatar-container">
        <div class="avatar">
          <img v-if="profile.profileImage" :src="profile.profileImage" alt="Avatar" />
          <span v-else>
            {{ profile.name?.split(' ').map(w => w[0]).join('').toUpperCase() || '?' }}
          </span>
        </div>
      </div>
      <div class="profile-info">
        <h1>{{ profile.name }}</h1>
        <p class="email">{{ profile.email }}</p>
        <span class="role-badge" :class="profile.role?.toLowerCase()">
          {{ profile.role }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <span>Duke u ngarkuar...</span>
    </div>

    <div v-else-if="error" class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ error }}</span>
    </div>

    <div v-else class="profile-content">
      <div v-if="profile.role === 'USER'" class="profile-section">
        <h3 class="section-title">Aplikimet e mia</h3>
        <p class="section-description">Shiko dhe menaxho të gjitha aplikimet e tua për punë</p>
        <router-link class="primary-button" to="/my-applications">
          Shiko aplikimet
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </router-link>
      </div>

      <div v-if="profile.role === 'EMPLOYER'" class="profile-section">
        <h2 class="section-title">Kompania ime</h2>
        <div v-if="profile.company" class="company-info">
          <div class="info-item">
            <span class="info-label">Emri:</span>
            <span class="info-value">{{ profile.company.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Përshkrimi:</span>
            <p class="info-value">{{ profile.company.description }}</p>
          </div>
        </div>
        <div v-else class="no-company">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Nuk keni kompani të regjistruar.</span>
        </div>

        <h3 class="section-title">Aplikimet e kompanisë suaj</h3>
        <p class="section-description">Menaxho aplikimet e kandidatëve për pozicionet e kompanisë tuaj</p>
        <router-link class="primary-button" to="/applications">
          Shiko aplikimet
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </router-link>
      </div>

      <div v-if="profile.role === 'ADMIN'" class="profile-section">
        <h2 class="section-title">Profil Admin</h2>
        <p class="section-description">Ju jeni administrator. Keni qasje në të gjitha të dhënat dhe funksionalitetet e sistemit.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { computed } from 'vue'




const profile = ref({})
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/profile')
    profile.value = res.data
  } catch (err) {
    error.value = 'Nuk u mund të ngarkohet profili.'
  } finally {
    loading.value = false
  }
})

const backRoute = computed(() => {
  if (profile.value.role === 'ADMIN') return '/admin'
  // Edhe USER, EMPLOYER t'shkoin te dashboard
  return '/dashboard'
})
</script>

<style scoped>
.profile-container {
  max-width: 580px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(36, 107, 253, 0.08);
  padding: 2.5rem;
  position: relative;
  min-height: 400px;
  border: 1px solid #f0f4ff;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #246bfd;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  transition: all 0.2s ease;
}

.back-button:hover {
  color: #1a56d4;
  transform: translateX(-2px);
}

.back-button svg {
  transition: transform 0.2s ease;
}

.back-button:hover svg {
  transform: translateX(-3px);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f4ff;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(36, 107, 253, 0.12) 0%, rgba(255, 225, 86, 0.12) 100%);
  border-radius: 50%;
  font-size: 2rem;
  font-weight: 700;
  color: #246bfd;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(36, 107, 253, 0.1);
  overflow: hidden;
  border: 3px solid white;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
}

.email {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0 0 0.5rem 0;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  background: #f1f3fa;
  color: #246bfd;
}

.role-badge.user {
  background: #e0e7ff;
  color: #246bfd;
}

.role-badge.employer {
  background: #fef6e0;
  color: #e09600;
}

.role-badge.admin {
  background: #fee2e2;
  color: #991b1b;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(36, 107, 253, 0.1);
  border-radius: 50%;
  border-top-color: #246bfd;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: #fee2e2;
  border-radius: 8px;
  color: #991b1b;
  font-weight: 500;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background: #f9fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #f0f4ff;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.section-description {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0 0 1rem 0;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #246bfd;
  color: white;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(36, 107, 253, 0.2);
}

.primary-button:hover {
  background: #1a56d4;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(36, 107, 253, 0.3);
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-weight: 600;
  color: #4b5563;
  font-size: 0.95rem;
}

.info-value {
  color: #1a1a1a;
  line-height: 1.5;
}

.no-company {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-style: italic;
  padding: 1rem 0;
}
</style>