<template>
  <div
    class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white w-full max-w-md rounded-2xl shadow-lg border border-gray-200 p-6"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Сохранить заказ</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <input
          v-model="form.name"
          type="text"
          placeholder="Название заказа"
          class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          v-model="form.agent"
          type="text"
          placeholder="Контрагент"
          class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          v-model="form.comment"
          placeholder="Комментарий"
          class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          v-model="form.statusCode"
          class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Выберите статус</option>
          <option value="0">Новый</option>
          <option value="1">В процессе</option>
          <option value="2">Закрыт</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="flex justify-end mt-6">
        <div class="flex gap-2">
          <button
            @click="handleSave"
            :disabled="!isValid"
            class="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["close", "save", "generate-kp"]);

const form = ref({
  name: "",
  agent: "",
  comment: "",
  statusCode: "",
});

const isValid = computed(() => {
  return form.value.name && form.value.agent && form.value.statusCode !== "";
});

const handleSave = () => {
  if (!isValid.value) return;
  emit("save", form.value);
};
</script>
