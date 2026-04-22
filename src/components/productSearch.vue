<template>
  <div class="relative w-full">
    <input
      name="search"
      v-model="search"
      type="text"
      placeholder="Поиск товара..."
      class="w-full px-4 py-2 bg-primary-light border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
    />

    <!-- Подсказки -->
    <div
      v-if="filteredProducts.length"
      class="absolute w-full bg-white border rounded shadow mt-1 max-h-70 overflow-y-auto"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        @click="addProduct(product)"
        class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-border last:border-0"
      >
        {{ product.name }}
      </div>
      <button
        @click="search = ''"
        class="sticky bottom-0 w-full text-center py-2 text-white bg-red-500 hover:bg-red-600 transition-colors rounded-b cursor-pointer"
      >
        Закрыть
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const data = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/products");
  data.value = await res.json();
});

const props = defineProps({
  addedProducts: Array,
});
const search = ref("");

// Фильтруем продукты на основе введенного текста и исключаем уже добавленные
const filteredProducts = computed(() => {
  if (!search.value) return [];

  return data.value.filter((product) => {
    const isAdded = props.addedProducts.some((p) => p.id === product.id); // Проверяем, добавлен ли продукт в список
    return (
      !isAdded &&
      product.name.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});
const emit = defineEmits(["add-product"]);
const addProduct = (product) => {
  search.value = "";
  emit("add-product", product);
};
</script>
