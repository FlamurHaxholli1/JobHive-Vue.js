<template>
  <div class="user-table">
    <h2>Lista e përdoruesve</h2>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Emri</th>
        <th>Email</th>
        <th>Roli</th>
        <th>Veprime</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>
          <select v-model="user.role" @change="changeRole(user.id, user.role)">
            <option value="USER">USER</option>
            <option value="EMPLOYER">EMPLOYER</option>
          </select>
        </td>
        <td>
          <button @click="askDelete(user.id)">Fshij</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal konfirmimi për fshirje -->
    <div v-if="showConfirm" class="modal-overlay">
      <div class="modal-content">
        <p>A je i sigurt që don me fshi këtë përdorues?</p>
        <button @click="confirmDelete">Po</button>
        <button @click="showConfirm = false">Jo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'vue3-toastify'

const users = ref([])
const showConfirm = ref(false)
const userToDelete = ref(null)

let currentUserId = null
const token = localStorage.getItem('token')
if (token) {
  const decoded = jwtDecode(token)
  currentUserId = decoded.userId || decoded.id
}

const loadUsers = async () => {
  try {
    const allUsers = (await api.get('/admin/users')).data
    users.value = allUsers.filter(u => u.id !== currentUserId)
  } catch (err) {
    toast.error("Gabim gjatë ngarkimit të përdoruesve!")
  }
}

const changeRole = async (id, role) => {
  try {
    await api.put(`/admin/users/${id}/role?role=${role}`)
    toast.success("Roli u ndryshua me sukses!")
  } catch (err) {
    toast.error("Gabim gjatë ndërrimit të rolit!")
  }
}

const askDelete = (id) => {
  userToDelete.value = id
  showConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/admin/users/${userToDelete.value}`)
    users.value = users.value.filter(u => u.id !== userToDelete.value)
    toast.success("Përdoruesi u fshi me sukses!")
  } catch (err) {
    toast.error('Gabim gjatë fshirjes së përdoruesit!')
  } finally {
    showConfirm.value = false
    userToDelete.value = null
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.user-table {
  margin-top: 30px;
}

.user-table h2 {
  color: #246BFD;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background: #f9fafe;
  color: #555;
  font-weight: 600;
}

select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  background: #e53a3a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #c62828;
}

/* Modal styles */
.modal-overlay {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff; padding: 25px 34px; border-radius: 10px; min-width: 240px;
  box-shadow: 0 8px 32px #246bfd25;
  text-align: center;
}
.modal-content button { margin: 0 7px; }
</style>
