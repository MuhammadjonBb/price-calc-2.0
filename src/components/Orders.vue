<template>
  <div class="xl:p-6 md:p-3 p-1 text-text-main bg-surface min-h-screen">
    <div
      class="max-w-full mx-auto bg-surface border border-border shadow-2xl rounded-2xl lg:p-6 md:p-4 p-3 mb-10"
    >
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Сохраненные заказы</h1>
      </div>

      <ul class="flex flex-col gap-2">
        <li
          v-for="order in orders"
          :key="order._id"
          class="grid grid-cols-6 gap-4 lg:text-md text-sm items-center py-3 px-4 text-text-main rounded-lg shadow-md border border-border bg-surface"
        >
          <div class="">
            {{ new Date(order.createdAt).toLocaleString() }}
          </div>
          <h2 class="">{{ order.name }}</h2>
          <div>{{ order.agent }}</div>
          <div>{{ formatPrice(totalProducts(order)) }} сум</div>
          <div>{{ order.comment }}</div>
          <div>{{ order.statusCode }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { formatPrice } from "../utils/format.js";

const orders = ref(null);

onMounted(() => {
  getOrders();
});

const totalProducts = (order) => {
  return order.products.reduce((total, product) => total + product.amount, 0);
};

const getOrders = async () => {
  try {
    const response = await fetch("http://localhost:3000/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    orders.value = await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};
</script>
