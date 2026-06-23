<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
    @click.self="$emit('close')"
  >
    <div
      class="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-800">
          Создание коммерческого предложения
        </h2>

        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 max-h-[70vh] overflow-y-auto space-y-6">
        <!-- Версия КП -->
        <div class="border rounded-2xl p-5 border-gray-300">
          <h3 class="text-lg font-semibold mb-4">
            Версия коммерческого предложения
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              class="cursor-pointer border rounded-2xl p-4 transition-all"
              :class="
                selectedTemplate === 'nds'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              "
            >
              <input
                v-model="selectedTemplate"
                type="radio"
                value="nds"
                class="hidden"
              />

              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold text-gray-800">КП-1 (С НДС)</div>

                  <div class="text-sm text-gray-500 mt-1">
                    Стандартное коммерческое предложение
                  </div>
                </div>

                <div
                  v-if="selectedTemplate === 'nds'"
                  class="w-5 h-5 rounded-full bg-blue-500"
                />
              </div>
            </label>

            <label
              class="cursor-pointer border rounded-2xl p-4 transition-all"
              :class="
                selectedTemplate === 'discount'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              "
            >
              <input
                v-model="selectedTemplate"
                type="radio"
                value="discount"
                class="hidden"
              />

              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold text-gray-800">
                    КП-2 (Со скидкой)
                  </div>

                  <div class="text-sm text-gray-500 mt-1">
                    Отображает выгоду клиента
                  </div>
                </div>

                <div
                  v-if="selectedTemplate === 'discount'"
                  class="w-5 h-5 rounded-full bg-blue-500"
                />
              </div>
            </label>
          </div>
        </div>

        <!-- Конструкции -->
        <div class="border border-gray-300 rounded-2xl p-5">
          <h3 class="text-lg font-semibold mb-4">Конструкции</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label
              v-for="item in constructions"
              :key="item"
              class="cursor-pointer"
            >
              <input
                v-model="selectedConstructions"
                :value="item"
                type="checkbox"
                class="hidden"
              />

              <div
                class="border rounded-xl px-4 py-3 transition-all"
                :class="
                  selectedConstructions.includes(item)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                {{ item }}
              </div>
            </label>
          </div>
        </div>

        <!-- Страна производитель -->
        <div class="border border-gray-300 rounded-2xl p-5">
          <h3 class="text-lg font-semibold mb-4">Страна производитель</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label v-for="item in countries" :key="item" class="cursor-pointer">
              <input
                v-model="selectedCountries"
                :value="item"
                type="checkbox"
                class="hidden"
              />

              <div
                class="border rounded-xl px-4 py-3 transition-all"
                :class="
                  selectedCountries.includes(item)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                {{ item }}
              </div>
            </label>
          </div>
        </div>

        <!-- Выгоды -->
        <div class="border border-gray-300 rounded-2xl p-5">
          <h3 class="text-lg font-semibold mb-4">Выгоды сотрудничества</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label v-for="item in benefits" :key="item" class="cursor-pointer">
              <input
                v-model="selectedBenefits"
                :value="item"
                type="checkbox"
                class="hidden"
              />

              <div
                class="border rounded-xl px-4 py-3 transition-all"
                :class="
                  selectedBenefits.includes(item)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                {{ item }}
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="border-t border-gray-300 p-4 md:p-6 flex flex-col-reverse sm:flex-row justify-end gap-3"
      >
        <button
          @click="$emit('close')"
          class="h-11 px-6 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          Отмена
        </button>

        <button
          @click="createKP"
          class="h-11 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl cursor-pointer transition-colors"
        >
          Сформировать КП
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["close", "generate-kp"]);

const selectedConstructions = ref([]);
const selectedCountries = ref([]);
const selectedBenefits = ref([]);
const selectedTemplate = ref("nds");

const constructions = [
  "Фундамент",
  "Фасад",
  "СК",
  "ЛКМ",
  "Звукоизоляция",
  "Линейный водоотвод",
  "Мансарда",
  "Терраса",
  "ПК",
  "Полы",
  "Опалубочная система",
];

const countries = [
  "Узбекистан",
  "Германия",
  "Грузия",
  "Щвейцария",
  "Россия",
  "Бельгия",
  "Дания",
  "Финляндия",
  "Франция",
  "Китай",
  "Туркменистан",
  "Беларусь",
  "Италия",
  "Польша",
  "Турция",
];

const benefits = [
  "В наличии",
  "Комплексность",
  "Временное хранение",
  "Скидка",
  "Доставка",
  "Шеф. монтаж",
  "Эксклюзивность",
  "Ускоренная поставка",
  "Доп. скидка",
  "PMG",
];

const createKP = () => {
  emit("generate-kp", {
    template: selectedTemplate.value,
    constructions: selectedConstructions.value,
    countries: selectedCountries.value,
    benefits: selectedBenefits.value,
  });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
