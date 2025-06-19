<template>
  <div class="signup-bg">
    <div class="signup-wrapper">
      <!-- LEFT COLUMN: Logo & Welcome -->
      <div class="signup-side">
        <div class="logo-block">
          <div class="logo">JobHive</div>
          <p class="welcome">
            Plotëso të dhënat<br />
            dhe bëhu pjesë e tregut të punës në <span class="brand">Kosovë</span>!
          </p>
        </div>
      </div>
      <!-- RIGHT COLUMN: Form -->
      <div class="signup-container">
        <h2>Regjistrohu në JobHive</h2>
        <form @submit.prevent="register">
          <div class="form-group">
            <label>Emri</label>
            <input v-model="name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" required />
          </div>
          <div class="form-group">
            <label>Fjalëkalimi</label>
            <input v-model="password" type="password" required />
            <div style="font-size: 0.97em; color: #7e8491; margin-top: 2px;">
              Së paku 8 karaktere, një shkronjë të madhe dhe një numër.
            </div>
          </div>
          <div class="form-group">
            <label>Roli</label>
            <select v-model="role" required>
              <option value="">Zgjedh rolin...</option>
              <option value="USER">Punekerkues</option>
              <option value="EMPLOYER">Punedhenes</option>
            </select>
          </div>
          <button type="submit" :disabled="loading">
            <span v-if="loading">Loading...</span>
            <span v-else>Regjistrohu</span>
          </button>
        </form>
        <p class="have-account">
          Ke llogari? <router-link to="/login">Kyçu këtu</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { toast } from 'vue3-toastify' // SHTO KËTË

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('')
const loading = ref(false)
const router = useRouter()

function isValidPassword(pw) {
  // Minimum 8 karaktere, 1 shkronjë e madhe, 1 numër
  return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw)
}

async function register() {
  // Validimi për password
  if (!isValidPassword(password.value)) {
    toast.error('Fjalëkalimi duhet të ketë së paku 8 karaktere, një shkronjë të madhe dhe një numër.')
    return
  }

  loading.value = true
  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })
    toast.success('Llogaria u krijua me sukses! Po ju ridrejtojmë...')
    setTimeout(() => {
      router.push('/login')
    }, 1200)
  } catch (e) {
    toast.error(e.response?.data?.message || 'Gabim gjatë regjistrimit!')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signup-bg {
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}

.signup-wrapper {
  width: 100%;
  max-width: 860px;
  min-height: 470px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 32px 0 rgba(36,107,253,0.08), 0 1.5px 16px rgba(255,225,86,0.04);
  display: flex;
  overflow: hidden;
  border: 1.5px solid #f1f3fa;
}

/* LEFT SIDE */
.signup-side {
  flex: 1.3;
  background: linear-gradient(120deg, #246BFD 78%, #FFE156 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.logo-block {
  width: 100%;
  padding: 40px 30px;
  text-align: left;
}

.logo {
  font-size: 2.2em;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #fff;
  background: linear-gradient(90deg, #fff 80%, #FFE156 110%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  display: inline-block;
}

.welcome {
  color: #fff;
  font-size: 1.19em;
  font-weight: 600;
  margin-top: 32px;
  line-height: 1.35;
}

.welcome .brand {
  color: #FFE156;
  font-weight: 800;
}

/* RIGHT SIDE */
.signup-container {
  flex: 1.5;
  background: #fff;
  padding: 54px 42px 38px 42px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

h2 {
  color: #1B1F3A;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 28px;
  letter-spacing: -1px;
}

.form-group {
  text-align: left;
  margin-bottom: 17px;
}

label {
  font-weight: 600;
  font-size: 1em;
  color: #1B1F3A;
  margin-bottom: 5px;
  display: block;
  letter-spacing: 0.2px;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 7px;
  border: 1.5px solid #e3e7f0;
  font-size: 1.06em;
  color: #1B1F3A;
  background: #fff;
  margin-top: 2px;
  transition: border-color 0.18s;
  outline: none;
  box-sizing: border-box;
  appearance: none;
}
input:focus, select:focus {
  border-color: #246BFD;
  box-shadow: 0 0 0 2px #246bfd22;
}

select {
  background: #f8fafc;
}

button {
  width: 100%;
  padding: 13px 0;
  background: #246BFD;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: 700;
  font-size: 1.1em;
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
.have-account {
  margin-top: 18px;
  color: #444;
  font-size: 1em;
}
.have-account a {
  color: #246BFD;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}
.have-account a:hover {
  color: #1B1F3A;
  text-decoration: underline;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .signup-wrapper {
    flex-direction: column;
    min-height: unset;
    max-width: 99vw;
  }
  .signup-side {
    padding: 22px 0;
    justify-content: flex-start;
    min-height: 150px;
  }
  .signup-container {
    padding: 38px 16px 22px 16px;
  }
}
@media (max-width: 600px) {
  .signup-wrapper {
    border-radius: 0;
    min-height: unset;
    box-shadow: none;
  }
  .signup-side {
    padding: 16px 0;
    min-height: 90px;
  }
  .logo-block {
    padding: 16px 14px 5px 14px;
  }
  .signup-container {
    padding: 24px 7vw 16px 7vw;
  }
}
</style>
