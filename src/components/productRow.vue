<template>
  <div
    class="grid lg:grid-cols-[24%_10%_6%_8%_8%_14%_13%_13%_4%] grid-cols-[24%_10%_4%_8%_8%_14%_13%_13%_6%] lg:text-md text-sm items-center py-3 px-4 text-text-main rounded-lg shadow-md border border-border bg-surface"
    v-if="isDesktop"
  >
    <div class="max-w-9/10">
      {{ product.name }}
    </div>

    <div>{{ formatPrice(minPrice) }} сум</div>
    <div>
      {{ product.unit }}
    </div>
    <div class="flex flex-row">
      <input
        name="amount"
        type="number"
        v-model.number="product.amount"
        @input="setAmount"
        class="w-full px-4 xl:max-w-3/4 max-w-9/10 py-2 bg-primary-light border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        :class="
          isNegativeAmount
            ? 'bg-red-100 border-red-400 focus:border-red-400 focus:ring-red-200'
            : 'bg-primary-light border-border focus:border-primary focus:ring-primary/20'
        "
      />
    </div>
    <div class="flex flex-row">
      <input
        name="margin"
        type="number"
        @input="setMargin"
        :class="
          isNegativeMargin
            ? 'bg-red-100 border-red-400 focus:border-red-400 focus:ring-red-200'
            : 'bg-primary-light border-border focus:border-primary focus:ring-primary/20'
        "
        class="w-full px-4 xl:max-w-3/4 max-w-9/10 py-2 bg-primary-light border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        v-model.number="product.margin"
      />
    </div>
    <div class="flex gap-2 pr-1">
      <!-- {{ formatPrice(product.marginPrice) }} сум -->
      <input
        name="marginPrice"
        type="number"
        v-model.number="product.marginPrice"
        @input="setPrice"
        class="w-full xl:max-w-3/4 max-w-9/10 px-4 py-2 bg-primary-light border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
      />
      <span class="block content-center">сум</span>
    </div>
    <div class="text-blue-500 font-semibold">
      {{ formatPrice(product.deliveryPrice) }} сум
    </div>
    <div class="">{{ formatPrice(product.finalPrice) }} сум</div>
    <div class="flex justify-end">
      <button
        @click="removeProduct"
        class="bg-red-500 text-white px-4 py-1.5 md:px-3 md:py-2 rounded-md cursor-pointer hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        <span v-if="isDesktopLarge">Удалить</span>
        <span v-else
          ><img src="../assets/img/delete.svg" alt="Удалить" class="w-5"
        /></span>
      </button>
    </div>
  </div>
  <!-- MOBILE -->
  <div
    v-else
    class="flex flex-col text-text-main rounded-lg border border-border shadow-md bg-surface mb-4 text-sm md:text-sm p-3 md:p-5"
  >
    <h2 class="text-sm md:text-lg font-semibold">Наименование</h2>
    <div class="mb-2">
      {{ product.name }}
    </div>

    <div class="mb-2">
      <span class="font-semibold mr-1">CC без НДС:</span>
      {{ formatPrice(minPrice) }} сум
    </div>
    <div class="mb-2">
      <span class="font-semibold mr-1">Ед. изм.: </span> {{ product.unit }}
    </div>
    <div class="flex flex-col gap-0.5 mb-2">
      <span class="font-semibold">Количество:</span>
      <input
        name="amount"
        type="number"
        v-model.number="product.amount"
        @input="setAmount"
        class="w-full px-4 max-w-3/4 py-2 bg-primary-light border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        :class="
          isNegativeAmount
            ? 'bg-red-100 border-red-400 focus:border-red-400 focus:ring-red-200'
            : 'bg-primary-light border-border focus:border-primary focus:ring-primary/20'
        "
      />
    </div>
    <div class="flex flex-col gap-0.5 mb-2">
      <span class="font-semibold"> Маржа: (%) </span>
      <input
        name="margin"
        type="number"
        @input="setMargin"
        :class="
          isNegativeMargin
            ? 'bg-red-100 border-red-400 focus:border-red-400 focus:ring-red-200'
            : 'bg-primary-light border-border focus:border-primary focus:ring-primary/20'
        "
        class="w-full px-4 max-w-3/4 py-2 bg-primary-light border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        v-model.number="product.margin"
      />
    </div>
    <div class="flex flex-col gap-0.5 pr-1 mb-2">
      <span class="font-semibold">Цена без доставки (Маржа + НДС)</span>
      <!-- {{ formatPrice(product.marginPrice) }} сум -->
      <div class="flex gap-2">
        <input
          name="marginPrice"
          type="number"
          v-model.number="product.marginPrice"
          @input="setPrice"
          class="w-full max-w-3/4 px-4 py-2 bg-primary-light border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
        <span class="block content-center">сум</span>
      </div>
    </div>
    <div class="flex flex-col gap-0.5 mb-2">
      <span class="font-semibold"> Цена с учетем доставки:<br /></span>
      {{ formatPrice(product.deliveryPrice) }} сум
    </div>
    <div class="mb-2">
      <span class="font-semibold">Сумма:<br /></span>
      {{ formatPrice(product.finalPrice) }} сум
    </div>
    <div class="flex justify-end">
      <button
        @click="removeProduct"
        class="bg-red-500 text-white px-4 py-1.5 rounded-md cursor-pointer hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatPrice } from "../utils/format.js";

const props = defineProps({
  product: Object,
});

const emit = defineEmits(["update:finalPrice"], ["update:removeProduct"]);
const minPrice = computed(() => props.product.minPrice.toFixed(2));

const setMargin = (event) => {
  const value = event.target.value;
  props.product.marginPrice = (
    (props.product.minPrice / (1 - value / 100)) *
    1.12
  ).toFixed(2);
  emit("update:finalPrice");
};

const setPrice = () => {
  props.product.margin = (
    ((props.product.marginPrice / 1.12 - props.product.minPrice) /
      (props.product.marginPrice / 1.12)) *
    100
  ).toFixed(2);
  emit("update:finalPrice");
};

const setAmount = (event) => {
  const value = event.target.value;
  props.product.amount = value;
  emit("update:finalPrice");
};

const removeProduct = () => {
  emit("update:removeProduct", props.product);
};

const isNegativeMargin = computed(() => {
  return props.product.margin < 0 || props.product.margin > 100;
});

const isNegativeAmount = computed(() => {
  return props.product.amount < 0;
});

const isDesktop = computed(() => {
  return window.innerWidth >= 1024; // Условие для определения десктопной версии (можно настроить по своему усмотрению)
});

const isDesktopLarge = computed(() => {
  return window.innerWidth >= 1440; // Условие для определения десктопной версии (можно настроить по своему усмотрению)
});
</script>
