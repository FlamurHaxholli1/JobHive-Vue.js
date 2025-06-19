<template>
  <div class="dashboard">
    <Navbar />

    <!-- Seksioni Hero -->
    <section class="hero">
      <div class="hero-container">
        <h1>
          <span class="brand">JobHive</span> lidh<br />
          <span class="headline-highlight">talentët dhe punëdhënësit më të mirë të Kosovës</span>
        </h1>
        <p class="hero-desc">
          Platformë e lehtë për të gjetur punë, për të punësuar dhe për të rritur karrierën apo kompaninë tënde.
        </p>
        <div class="hero-actions">
          <a v-if="auth.userRole === 'USER'" href="/jobs">
            <button class="btn btn-primary">Shfleto Punët</button>
          </a>
          <div
              v-else-if="auth.userRole === 'EMPLOYER'"
              style="display: flex; flex-direction: column; align-items: center; gap: 10px;"
          >
            <div style="font-size: 1.05em; font-weight: 600;">
              Përshëndetje punëdhënës, për të filluar duhet të regjistroni kompaninë tuaj
            </div>
            <br />
            <a href="/register-company">
              <button class="btn btn-register-company">Regjistro Kompaninë</button>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Ndarse -->
    <div class="divider"></div>

    <!-- Seksioni Vlerat -->
    <section class="features">
      <div class="features-title-block">
        <h2>Pse të përdorësh JobHive?</h2>
      </div>
      <div class="features-list">
        <div class="feature">
          <div class="icon-block">
            <!-- Ikona Kërkimi -->
            <svg width="32" height="32" fill="none" stroke="#246BFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div class="feature-info">
            <h3>Kërkim i fuqishëm i vendeve të punës</h3>
            <p>
              Kërko dhe filtro menjëherë punët që i përshtaten aftësive dhe interesave tua, nga punëdhënës të verifikuar.
            </p>
          </div>
        </div>
        <div class="feature">
          <div class="icon-block">
            <!-- Ikona Profili -->
            <svg width="32" height="32" fill="none" stroke="#246BFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="feature-info">
            <h3>Aplikim i menjëhershëm</h3>
            <p>
              Krijo profil profesional brenda pak minutash. Apliko për punë me një klik pa plotësuar forma të gjata.
            </p>
          </div>
        </div>
        <div class="feature">
          <div class="icon-block">
            <!-- Ikona Valixhja -->
            <svg width="32" height="32" fill="none" stroke="#246BFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div class="feature-info">
            <h3>Për Kompani</h3>
            <p>
              Posto punë lehtësisht dhe lidhu me kandidatë të kualifikuar. Të gjitha në një panel të thjeshtë dhe modern.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authstore'
import Navbar from '../components/Navbar.vue'
const auth = useAuthStore()
</script>

<style scoped>
.dashboard {
  background: #fff;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}

/* --- Hero --- */
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 72px 0 56px 0;
  background: #fff;
}

.hero-container {
  width: 100%;
  max-width: 720px;
  text-align: center;
}

.hero h1 {
  font-size: 2.8rem;
  font-weight: 900;
  color: #1B1F3A;
  line-height: 1.2;
  margin-bottom: 22px;
  letter-spacing: -1px;
}

.brand {
  color: #246BFD;
  font-weight: 900;
  font-size: 1.05em;
  letter-spacing: -1px;
}

.headline-highlight {
  background: linear-gradient(120deg, #FFE156 60%, #246BFD 100%);
  padding: 0 0.25em;
  border-radius: 5px;
  color: #1B1F3A;
  font-weight: 900;
  font-size: 1.08em;
  display: inline-block;
  margin-top: 0.2em;
}

.hero-desc {
  color: #333333;
  font-size: 1.15rem;
  margin-bottom: 30px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 13px 34px;
  border-radius: 7px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  border: 2px solid transparent;
  outline: none;
  transition: all 0.15s cubic-bezier(.4,0,.2,1);
  background: #fff;
  color: #246BFD;
}

.btn-primary {
  border: 2px solid #246BFD;
  background: #246BFD;
  color: #fff;
}
.btn-primary:hover {
  background: #1958cb;
  border-color: #1958cb;
}

.btn-secondary {
  border: 2px solid #246BFD;
  background: #fff;
  color: #246BFD;
}
.btn-secondary:hover {
  background: #F5F7FA;
  border-color: #246BFD;
}

/* --- Divider --- */
.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #ffe15633 10%, #246BFD20 90%);
  margin: 0 auto 48px auto;
  max-width: 900px;
}

/* --- Features --- */
.features {
  max-width: 950px;
  margin: 0 auto;
  padding: 0 20px 60px 20px;
}

.features-title-block {
  text-align: center;
  margin-bottom: 46px;
}

.features-title-block h2 {
  color: #1B1F3A;
  font-size: 2.1rem;
  font-weight: 900;
  margin: 0;
  position: relative;
  display: inline-block;
}

.features-title-block h2:after {
  content: '';
  display: block;
  width: 48px;
  height: 4px;
  background: linear-gradient(90deg, #FFE156 60%, #246BFD 100%);
  border-radius: 3px;
  margin: 15px auto 0 auto;
}

.features-list {
  display: flex;
  gap: 38px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.feature {
  flex: 1 1 230px;
  min-width: 230px;
  max-width: 300px;
  background: #fff;
  padding: 0 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-block {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background: #f8fafd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: 1.7px solid #f0f3fb;
}

.feature-info h3 {
  color: #1B1F3A;
  font-weight: 800;
  font-size: 1.19rem;
  margin-bottom: 0.6em;
  margin-top: 0;
}

.feature-info p {
  color: #333333;
  font-size: 1.01rem;
  margin: 0;
  line-height: 1.7;
}

/* --- Responsive --- */
@media (max-width: 900px) {
  .features-list {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
  .feature {
    max-width: 90vw;
  }
  .hero-container {
    max-width: 97vw;
  }
  .dashboard {
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 600px) {
  .hero h1 {
    font-size: 1.65rem;
  }
  .features-title-block h2 {
    font-size: 1.3rem;
  }
}
.btn-register-company {
  padding: 13px 34px;
  border-radius: 9px;
  font-weight: 800;
  font-size: 1.13rem;
  cursor: pointer;
  border: 2px solid #246BFD;
  background: #246BFD;
  color: #fff;
  box-shadow: 0 2px 14px 0 rgba(36,107,253,0.08);
  transition: background 0.17s, color 0.17s, transform 0.12s;
  letter-spacing: 0.2px;
}

.btn-register-company:hover {
  background: #1958cb;
  color: #fff;
  transform: translateY(-1px) scale(1.025);
  box-shadow: 0 4px 24px 0 rgba(36,107,253,0.16);
}
</style>
