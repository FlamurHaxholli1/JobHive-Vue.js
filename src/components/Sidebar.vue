<template>
  <div class="sidebar">
    <h2>Admin</h2>
    <ul>
      <li :class="{ active: active === 'overview' }" @click="$emit('change-section', 'overview')">
        <LayoutDashboard class="icon" /> Përmbledhje
      </li>
      <li :class="{ active: active === 'users' }" @click="$emit('change-section', 'users')">
        <Users class="icon" /> Përdoruesit
      </li>
      <li :class="{ active: active === 'companies' }" @click="$emit('change-section', 'companies')">
        <Building class="icon" /> Kompanitë
      </li>
      <li :class="{ active: active === 'jobs' }" @click="$emit('change-section', 'jobs')">
        <Briefcase class="icon" /> Jobs
      </li>
<!--      <li :class="{ active: active === 'applications' }" @click="$emit('change-section', 'applications')">-->
<!--        <FileText class="icon" /> Aplikimet-->
<!--      </li>-->
    </ul>

    <div class="bottom">
      <router-link to="/profile" class="profile-link">
        <User class="icon" /> Profili
      </router-link>
      <button @click="$emit('logout')">
        <LogOut class="icon" /> Log out
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['active'])
import {
  Users,
  FileText,
  Briefcase,
  Building,
  LayoutDashboard,
  LogOut,
  User
} from 'lucide-vue-next'
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #fff;
  color: #1B1F3A;
  padding: 32px 20px 24px 20px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 22px;
  box-shadow: 0 4px 32px 0 #246bfd12, 0 1.5px 3px 0 #246bfd09;
  min-height: 92vh;
  margin: 22px 16px 22px 16px;
}

.sidebar h2 {
  font-size: 1.16rem;
  color: #246BFD;
  letter-spacing: 1.5px;
  font-weight: 900;
  margin-bottom: 34px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.sidebar li {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 13px;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.18s, color 0.17s;
  font-size: 1rem;
  background: none;
  border: none;
}

.sidebar li.active,
.sidebar li:hover {
  background: linear-gradient(90deg, #f4f7fe 60%, #e7efff 100%);
  color: #246BFD;
  font-weight: 700;
}

.bottom {
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1.5px solid #f1f5fc;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #246BFD;
  font-weight: 700;
  background: #f8fafd;
  padding: 10px 13px;
  border-radius: 10px;
  transition: background 0.14s, color 0.14s;
}

.profile-link:hover {
  background: #e9f1ff;
  color: #1958cb;
}

button {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #246BFD;
  color: white;
  border: none;
  padding: 10px 13px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: background 0.15s;
}

button:hover {
  background: #1958cb;
}

/* Bën ikonën e logout brenda butonit të jetë gjithmonë e bardhë */
button .icon {
  color: #fff !important;
}

li.active .icon,
li:hover .icon {
  color: #246BFD;
}

/* Responsive tweaks */
@media (max-width: 700px) {
  .sidebar {
    width: 100vw;
    min-height: unset;
    margin: 0;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 3px 14px 0 #246bfd12;
    padding: 20px 12px 16px 12px;
  }
}

</style>
