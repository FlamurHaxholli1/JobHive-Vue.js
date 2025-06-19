<template>
  <div class="apply-job-page">
    <Navbar />
    <div class="apply-job-container">
      <router-link to="/jobs" class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Kthehu te Punët
      </router-link>

      <h2 class="page-title">Apliko për këtë punë</h2>

      <form @submit.prevent="apply" class="application-form">
        <div class="form-group">
          <label class="form-label">Ngarko CV</label>
          <input
              type="file"
              class="form-input"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              @change="handleFileUpload"
              required
          />
          <p class="input-hint">Ngarko CV-në tënde (PDF, Word ose foto).</p>
          <div v-if="selectedFileName" style="font-size:0.93em; color:#246bfd; margin-top:5px">
            U përzgjodh: {{ selectedFileName }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Letra Motivuese</label>
          <textarea
              v-model="coverLetter"
              class="form-textarea"
              placeholder="Shkruani pse jeni i interesuar për këtë pozicion..."
              required
              rows="6"
          ></textarea>
        </div>

        <button type="submit" class="submit-button" :disabled="loading">
          <span v-if="!loading">Apliko tani</span>
          <span v-else class="spinner"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/authstore'
import Navbar from "../components/Navbar.vue"
import { toast } from 'vue3-toastify' // SHTO KËTË

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const file = ref(null)
const selectedFileName = ref('')
const coverLetter = ref('')
const loading = ref(false)

function handleFileUpload(event) {
  const uploaded = event.target.files[0]
  if (uploaded) {
    file.value = uploaded
    selectedFileName.value = uploaded.name
  }
}

async function apply() {
  loading.value = true

  if (!file.value) {
    toast.error('Ju lutem ngarkoni një CV.')
    loading.value = false
    return
  }

  try {
    const formData = new FormData()
    formData.append('resumeFile', file.value)
    formData.append('coverLetter', coverLetter.value)
    formData.append('status', 'pending')
    formData.append('userId', auth.loggedInUser?.id)
    formData.append('jobId', route.params.id)

    await api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.success('Aplikuat me sukses! Po ju ridrejtojmë...')
    setTimeout(() => router.push('/jobs'), 1500)
  } catch (e) {
    toast.error(e.response?.data?.message || 'Gabim gjatë aplikimit!')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.apply-job-page {
  background-color: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.apply-job-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  width: 100%;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #246bfd;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.back-button:hover {
  color: #1a56d4;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  text-align: center;
}

.application-form {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(36, 107, 253, 0.08);
  border: 1px solid #f0f4ff;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f9fafc;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #246bfd;
  box-shadow: 0 0 0 3px rgba(36, 107, 253, 0.1);
}

.form-textarea {
  min-height: 150px;
  resize: vertical;
}

.input-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background: #246bfd;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background: #1a56d4;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(36, 107, 253, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 640px) {
  .apply-job-container {
    padding: 0 1rem;
  }
  .application-form {
    padding: 1.5rem;
  }
}
</style>
