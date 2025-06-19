<template>
  <div class="login-bg">
    <div class="login-wrapper">
      <!-- LEFT COLUMN: Logo & Welcome -->
      <div class="login-side">
        <div class="logo-block">
          <div class="logo">JobHive</div>
          <p class="welcome">
            Mirë se u ktheve!<br />
            Kyçu për të parë punët më të mira në <span class="brand">Kosovë</span>.
          </p>
        </div>
      </div>
      <!-- RIGHT COLUMN: Login Form -->
      <div class="login-container">
        <h2>Log In</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="password" type="password" required />
          </div>
          <button type="submit" :disabled="loading">
            <span v-if="loading">Loading...</span>
            <span v-else>Log In</span>
          </button>
        </form>
        <p class="no-account">
          Nuk ke llogari? <router-link to="/signup">Regjistrohu</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authstore'
import { toast } from 'vue3-toastify' // SHTO KËTË

const email = ref('')
const password = ref('')
const loading = ref(false)

const router = useRouter()
const auth = useAuthStore()

async function login() {
  loading.value = true
  try {
    // Përdor authStore për login që edhe state edhe localStorage me u update
    await auth.logIn({ email: email.value, password: password.value })

    // KQYR ROLIN NGA STORE, jo prej localStorage
    if (auth.userRole === 'ADMIN') {
      router.push('/admin')
    } else if (auth.userRole === 'EMPLOYER') {
      router.push('/dashboard') // ose ku e ke dashboardin për employer
    } else if (auth.userRole === 'USER') {
      router.push('/dashboard') // ose /my-applications
    } else {
      router.push('/dashboard')
    }
    toast.success('U kyçët me sukses!')
  } catch (err) {
    toast.error(err.message || 'Ndodhi një gabim')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}

.login-wrapper {
  width: 100%;
  max-width: 860px;
  min-height: 470px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 32px 0 rgba(36,107,253,0.08), 0 1.5px 16px rgba(52,211,153,0.03);
  display: flex;
  overflow: hidden;
  border: 1.5px solid #f1f3fa;
}

/* LEFT SIDE */
.login-side {
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
  font-size: 1.22em;
  font-weight: 600;
  margin-top: 30px;
  line-height: 1.35;
}

.welcome .brand {
  color: #FFE156;
  font-weight: 800;
}

/* RIGHT SIDE */
.login-container {
  flex: 1.5;
  background: #fff;
  padding: 55px 42px 38px 42px;
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
  margin-bottom: 19px;
}

label {
  font-weight: 600;
  font-size: 1em;
  color: #1B1F3A;
  margin-bottom: 6px;
  display: block;
  letter-spacing: 0.2px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
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
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #246BFD;
  box-shadow: 0 0 0 2px #246bfd22;
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

.error {
  color: #e53a3a;
  margin-top: 18px;
  font-size: 0.98em;
  font-weight: 500;
  background: #ffeaea;
  border-radius: 6px;
  padding: 8px 0;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .login-wrapper {
    flex-direction: column;
    min-height: unset;
    max-width: 99vw;
  }
  .login-side {
    padding: 22px 0;
    justify-content: flex-start;
    min-height: 150px;
  }
  .login-container {
    padding: 38px 16px 22px 16px;
  }
}

@media (max-width: 600px) {
  .login-wrapper {
    border-radius: 0;
    min-height: unset;
    box-shadow: none;
  }
  .login-side {
    padding: 16px 0;
    min-height: 90px;
  }
  .logo-block {
    padding: 16px 14px 5px 14px;
  }
  .login-container {
    padding: 24px 7vw 16px 7vw;
  }
}
</style>
