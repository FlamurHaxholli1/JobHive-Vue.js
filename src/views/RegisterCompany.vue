<template>
  <div class="company-register-page">
    <div class="register-company-container">
      <h2>Mirë se vjen, Employer!</h2>
      <p>Regjistro kompaninë tënde për të vazhduar.</p>
      <form @submit.prevent="registerCompany">
        <div class="form-group">
          <label>Emri i Kompanisë</label>
          <input v-model="company.name" required />
        </div>
        <div class="form-group">
          <label>Përshkrimi</label>
          <textarea v-model="company.description" required />
        </div>
        <div class="form-group">
          <label>Website</label>
          <input v-model="company.website" required />
        </div>
        <div class="form-group">
          <label>Logo URL</label>
          <input v-model="company.logoUrl" required />
        </div>
        <button type="submit">Regjistro Kompaninë</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/authstore'
import { toast } from 'vue3-toastify' // SHTO KËTË

const auth = useAuthStore()
const router = useRouter()
const company = ref({
  name: '',
  description: '',
  website: '',
  logoUrl: ''
})

async function registerCompany() {
  try {
    const res = await api.post('/companies', {
      ...company.value,
      createdBy: auth.loggedInUser?.id
    })
    // Ruaj companyId n'localStorage
    localStorage.setItem('companyId', res.data.id)
    toast.success('Kompania u regjistrua me sukses!')
    // Redirect te shto punë
    setTimeout(() => {
      router.push('/add-job')
    }, 1100)
  } catch (e) {
    toast.error(e.response?.data?.message || 'Gabim gjatë regjistrimit të kompanisë!')
  }
}
</script>

<style scoped>
.company-register-page { min-height:100vh;background:#f7fafd;padding:54px 0 }
.register-company-container { background:#fff;max-width:400px;margin:0 auto;padding:36px 34px 18px 34px;border-radius:13px;box-shadow:0 4px 32px #246bfd14; }
h2 { color:#246bfd;font-weight:800;font-size:2em;margin-bottom:6px }
.form-group { margin-bottom:18px;text-align:left }
label { display:block;font-weight:600;margin-bottom:5px;color:#333 }
input,textarea { width:100%;padding:9px 11px;border:1.5px solid #e3e7f0;border-radius:7px;font-size:1.07em }
button { width:100%;padding:13px 0;background:#246bfd;color:#fff;border:none;border-radius:7px;font-weight:700;font-size:1.1em;cursor:pointer;margin-top:10px }
.register-company-container {
  background: #fff;
  padding: 45px 38px 28px 38px;
  border-radius: 16px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 6px 32px 0 rgba(36,107,253,0.08), 0 1.5px 16px rgba(52,211,153,0.03);
  border: 1.5px solid #f1f3fa;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  color: #246BFD;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 5px;
  letter-spacing: -1px;
}
p {
  color: #1B1F3A;
  font-size: 1.08em;
  font-weight: 600;
  margin-bottom: 18px;
}
.form-group {
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 600;
  color: #1B1F3A;
  margin-bottom: 5px;
}
label span {
  color: #e53a3a;
  font-size: 1.12em;
  margin-left: 1px;
}
input, textarea {
  padding: 10px 12px;
  border-radius: 7px;
  border: 1.5px solid #e3e7f0;
  font-size: 1.07em;
  color: #1B1F3A;
  background: #fff;
  margin-top: 2px;
  transition: border-color 0.18s;
  outline: none;
  box-sizing: border-box;
}
input:focus, textarea:focus {
  border-color: #246BFD;
  box-shadow: 0 0 0 2px #246bfd22;
}
input.invalid, textarea.invalid {
  border-color: #e53a3a;
  background: #ffeaea;
}
button {
  width: 100%;
  padding: 13px 0;
  background: #246BFD;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: 700;
  font-size: 1.13em;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 12px rgba(36,107,253,0.08);
  margin-top: 10px;
  letter-spacing: 0.1px;
}
button:disabled {
  background: #a6c2f8;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background: #1958cb;
}
@media (max-width: 600px) {
  .register-company-container {
    border-radius: 0;
    min-height: unset;
    box-shadow: none;
    padding: 24px 7vw 18px 7vw;
  }
}
</style>
