<template>
  <div
    class="relative w-full flex gap-2 items-stretch md:flex-row-reverse flex-col"
  >
    <!-- Дропдаун  -->
    <div class="flex gap-2">
      <div class="relative shrink-0" ref="dropdownRef">
        <button
          @click="isOpenCat = !isOpenCat"
          class="flex h-full cursor-pointer items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm text-gray-700 hover:border-primary transition-all whitespace-nowrap"
          :class="{ 'border-primary ring-2 ring-primary/20': isOpenCat }"
        >
          <span class="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span>{{ selectedCategory.label }}</span>
          <svg
            class="w-3 h-3 text-gray-400 transition-transform"
            :class="{ 'rotate-180': isOpenCat }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <Transition name="dropdown">
          <div
            v-if="isOpenCat"
            class="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-border rounded-2xl shadow-lg overflow-hidden min-w-50"
          >
            <div
              class="px-3 py-2 text-[11px] font-semibold tracking-widest text-gray-400 uppercase border-b border-border"
            >
              Категория
            </div>
            <div
              v-for="category in categories"
              :key="category.value"
              @click="selectCategory(category)"
              class="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm text-gray-700 hover:bg-blue-50 transition-colors border-b border-border last:border-0"
              :class="{
                'bg-blue-50 text-blue-600 font-medium':
                  category.value === selectedCategory.value,
              }"
            >
              <div class="flex flex-col">
                <span class="text-sm md:text-base">{{ category.label }}</span>
              </div>
              <svg
                v-if="category.value === selectedCategory.value"
                class="ml-auto w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </Transition>
      </div>

      <div class="relative shrink-0" ref="dropdownRef">
        <button
          @click="isOpen = !isOpen"
          class="flex h-full cursor-pointer items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm text-gray-700 hover:border-primary transition-all whitespace-nowrap"
          :class="{ 'border-primary ring-2 ring-primary/20': isOpen }"
        >
          <span class="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span>{{ selectedRegion.label }}</span>
          <svg
            class="w-3 h-3 text-gray-400 transition-transform"
            :class="{ 'rotate-180': isOpen }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <Transition name="dropdown">
          <div
            v-if="isOpen"
            class="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-border rounded-2xl shadow-lg overflow-hidden min-w-50"
          >
            <div
              class="px-3 py-2 text-[11px] font-semibold tracking-widest text-gray-400 uppercase border-b border-border"
            >
              Регион
            </div>
            <div
              v-for="region in regions"
              :key="region.value"
              @click="selectRegion(region)"
              class="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm text-gray-700 hover:bg-blue-50 transition-colors border-b border-border last:border-0"
              :class="{
                'bg-blue-50 text-blue-600 font-medium':
                  region.value === selectedRegion.value,
              }"
            >
              <div class="flex flex-col">
                <span class="text-sm md:text-base">{{ region.label }}</span>
                <span class="text-[10px] md:text-xs text-gray-400">{{
                  region.value
                }}</span>
              </div>
              <svg
                v-if="region.value === selectedRegion.value"
                class="ml-auto w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Поиск -->
    <div class="relative flex-1">
      <input
        name="search"
        v-model="search"
        type="text"
        placeholder="Поиск товара..."
        class="w-full px-4 py-2 bg-primary-light border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
      />

      <div
        v-if="filteredProducts.length"
        class="absolute w-full bg-white border rounded shadow mt-1 max-h-70 overflow-y-auto z-40"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// ─── Регионы ───────────────────────────────────────────────────────────────
const regions = [
  {
    label: "Ташкент",
    value: "TASHKENT",
  },
  {
    label: "Самарканд",
    value: "SAMARKAND",
  },
  {
    label: "Нукус",
    value: "NUKUS",
  },
  {
    label: "Бухара",
    value: "BUKHARA",
  },
  {
    label: "Фергана",
    value: "FERGANA",
  },
];

// categories
const categories = [
  {
    label: "Все",
    value: "all",
  },
  {
    label: "ГиД БРМ",
    value: "brm",
  },
  {
    label: "ГиД Полимер",
    value: "polymer",
  },
  {
    label: "КиП",
    value: "kip",
  },
  {
    label: "БиФ",
    value: "bif",
  },
  {
    label: "XPS",
    value: "xps",
  },
  {
    label: "SP-ТДО",
    value: "sptdo",
  },
  {
    label: "СК",
    value: "sk",
  },
  {
    label: "СК-2",
    value: "sk2",
  },
];

const isOpen = ref(false);
const selectedRegion = ref(
  regions.find((r) => r.value === localStorage.getItem("selectedRegion")) ||
    regions[0],
);
const isOpenCat = ref(false);
const selectedCategory = ref(
  categories.find(
    (c) => c.value === localStorage.getItem("selectedCategory"),
  ) || categories[0],
);
const dropdownRef = ref(null);

const selectCategory = (category) => {
  selectedCategory.value = category;
  localStorage.setItem("selectedCategory", category.value);
  isOpenCat.value = false;
  fetchProducts();
};

function selectRegion(region) {
  selectedRegion.value = region;
  localStorage.setItem("selectedRegion", region.value);
  isOpen.value = false;
  fetchProducts();
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false;
  }
}

// ─── Продукты ──────────────────────────────────────────────────────────────
const data = ref([]);

async function fetchProducts() {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/products?sheet=${selectedRegion.value.value}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (res.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    data.value = await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  fetchProducts(); // первая загрузка
});

onUnmounted(() => document.removeEventListener("click", handleClickOutside));

const props = defineProps({
  addedProducts: Array,
});

const search = ref("");

const filteredProducts = computed(() => {
  if (!search.value) return [];
  return data.value.filter((product) => {
    const isAdded = props.addedProducts.some((p) => p.id === product.id);
    const matchesCategory =
      selectedCategory.value.value === "all" ||
      product.category === selectedCategory.value.value;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.value.toLowerCase());

    return !isAdded && matchesCategory && matchesSearch;
  });
});

const emit = defineEmits(["add-product"]);

const addProduct = (product) => {
  search.value = "";
  emit("add-product", product);
};
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
