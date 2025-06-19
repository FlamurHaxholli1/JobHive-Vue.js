<template>
  <div class="company-table">
    <h2>Lista e Kompanive</h2>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Emri</th>
        <th>Website</th>
        <th>Employer</th>
        <th>Veprime</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="company in companies" :key="company.id">
        <td>{{ company.id }}</td>
        <td>{{ company.name }}</td>
        <td>{{ company.website || '—' }}</td>
        <td>{{ company.createdBy?.name || '—' }}</td>
        <td>
          <button @click="askDelete(company.id)">Fshij</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal konfirmimi fshirjes -->
    <div v-if="showConfirm" class="modal-overlay">
      <div class="modal-content">
        <p>A je i sigurt që don me fshi këtë kompani?</p>
        <button @click="confirmDelete">Po</button>
        <button @click="showConfirm = false">Jo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { toast } from 'vue3-toastify'

const companies = ref([])
const showConfirm = ref(false)
const companyToDelete = ref(null)

const loadCompanies = async () => {
  try {
    companies.value = (await api.get('/companies')).data
  } catch (err) {
    toast.error("Gabim gjatë ngarkimit të kompanive!")
  }
}

const askDelete = (id) => {
  companyToDelete.value = id
  showConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/companies/${companyToDelete.value}`)
    companies.value = companies.value.filter(c => c.id !== companyToDelete.value)
    toast.success("Kompania u fshi me sukses!")
  } catch (err) {
    toast.error("Gabim gjatë fshirjes së kompanisë!")
  } finally {
    showConfirm.value = false
    companyToDelete.value = null
  }
}

onMounted(loadCompanies)
</script>

<style scoped>
.company-table {
  margin-top: 30px;
}

.company-table h2 {
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

button {
  background: #e53a3a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 6px;
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
