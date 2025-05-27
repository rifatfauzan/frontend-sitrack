<script setup lang="ts">
import { reactive, watch } from 'vue'
import VButton from '@/components/VButton.vue'

interface LoadRow {
  code: string
  qty: number
}

const props = defineProps<{
  modelValue: LoadRow[]
}>()

const emit = defineEmits<{
  'update:modelValue': [LoadRow[]]
}>()

const codeOptions = [
  { value: '120MTFL', label: '120MTFL', chassis: 20 },
  { value: '120MT',   label: '120MT',   chassis: 20 },
  { value: 'CH120FL', label: 'CH120FL', chassis: 20 },

  { value: '220MTFL',      label: '220MTFL',      chassis: 40 },
  { value: '220MT',        label: '220MT',        chassis: 40 },
  { value: '140MTFL',      label: '140MTFL',      chassis: 40 },
  { value: '140MT',        label: '140MT',        chassis: 40 },
  { value: '120MT120FL',   label: '120MT120FL',   chassis: 40 },
  { value: '120MT220FL',   label: '120MT220FL',   chassis: 40 },
  { value: '220MT120FL',   label: '220MT120FL',   chassis: 40 },
  { value: '220MT220FL',   label: '220MT220FL',   chassis: 40 },
  { value: '120MT140FL',   label: '120MT140FL',   chassis: 40 },
  { value: 'CH140FL',      label: 'CH140FL',      chassis: 40 },
  { value: 'CH220FL',      label: 'CH220FL',      chassis: 40 },
  { value: '145MT',        label: '145MT',        chassis: 40 },
  { value: '145FL',        label: '145FL',        chassis: 40 },
  { value: '145MTFL',      label: '145MTFL',      chassis: 40 }
]

const rows = reactive<LoadRow[]>(
  props.modelValue.length
    ? props.modelValue.map(r => ({ ...r }))
    : [{ code: '', qty: 0 }]
)

watch(
  () => props.modelValue,
  val => {
    rows.splice(0, rows.length,
      ...(val.length ? val.map(r => ({ ...r })) : [{ code: '', qty: 0 }])
    )
  },
  { deep: true }
)

function sync () {
  emit('update:modelValue', rows.map(r => ({ ...r })))
}

function addRow () {
  rows.push({ code: '', qty: 0 })
  sync()
}

function removeRow (i: number) {
  rows.splice(i, 1)
  if (!rows.length) rows.push({ code: '', qty: 0 })
  sync()
}
</script>

<template>
  <table class="load-table">
    <thead>
      <tr>
        <th class="w-7/12">Container&nbsp;Type</th>
        <th class="w-3/12">Quantity</th>
        <th class="w-2/12"></th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(r,i) in rows" :key="i">
        <td>
          <select v-model="r.code" @change="sync" class="cell-input">
            <option disabled value="">Pilih kode…</option>
            <option v-for="o in codeOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </td>
        <td>
          <input type="number" min="0" v-model.number="r.qty" @input="sync" class="cell-input text-center"/>
        </td>
        <td>
          <button type="button" @click="removeRow(i)" class="btn-del">Hapus</button>
        </td>
      </tr>

      <tr>
        <td colspan="3" class="p-0">
          <VButton class="btn-add w-full" @click="addRow">+ Tambah Baris</VButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.load-table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
  font-size:.875rem;
  text-align:center;
  box-shadow:0 1px 3px rgba(0,0,0,.15);
}

.load-table thead tr{
  background:#1C5D99;
  color:#fff;
}
.load-table th{
  padding:12px;
  font-weight:600;
}
.load-table thead th:first-child { border-top-left-radius:8px; }
.load-table thead th:last-child  { border-top-right-radius:8px; }

.load-table td{
  padding:10px;
  border-top:1px solid #e5e7eb;
  background:#fff;
}
.cell-input{
  width:100%;
  padding:8px;
  border:1px solid #ccc;
  border-radius:4px;
}

.btn-del{
  background:#dc3545;
  color:#fff;
  padding:6px 12px;
  border-radius:4px;
}
.btn-del:hover{ background:#a71d2a; }

.btn-add{
  background:#1C5D99;
  color:#fff;
  border-radius:0 0 8px 8px;
}
</style>
