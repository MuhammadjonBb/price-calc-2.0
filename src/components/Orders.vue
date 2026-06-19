<template>
  <div class="xl:p-6 md:p-3 p-1 text-text-main bg-surface min-h-screen">
    <div
      class="max-w-full mx-auto bg-surface border border-border shadow-2xl rounded-2xl lg:p-6 md:p-4 p-3 mb-10 tex-sm"
    >
      <div class="p-4 flex justify-between gap-2 items-center">
        <h1 class="text-2xl font-bold">Сохраненные заказы</h1>
        <router-link
          class="flex self-center underline text-blue-500 hover:text-blue-700"
          to="/price-calc/"
          >Назад</router-link
        >
      </div>
      <div
        v-if="isDesktop"
        class="grid grid-cols-7 gap-4 lg:text-md text-sm items-center py-3 px-4 text-text-main"
      >
        <div class="font-bold">Дата создания</div>
        <div class="font-bold">Название</div>
        <div class="font-bold">Контрагент</div>
        <div class="font-bold">Итоговая сумма</div>
        <div class="font-bold">Комментарий</div>
        <div class="font-bold">Статус</div>
      </div>
      <ul class="flex flex-col gap-2" v-if="isDesktop">
        <li
          v-for="order in orders"
          :key="order._id"
          class="grid grid-cols-7 gap-4 lg:text-md text-sm items-center py-3 px-4 text-text-main rounded-lg shadow-md border border-border bg-surface"
        >
          <div class="">
            {{ new Date(order.createdAt).toLocaleString() }}
          </div>
          <h2 class="">{{ order.name }}</h2>
          <div>{{ order.agent }}</div>
          <div>{{ formatPrice(totalSum(order)) }} сум</div>
          <div>{{ order.comment }}</div>
          <div>{{ getStatusText(order.statusCode) }}</div>
          <div class="flex justify-between items-center gap-2">
            <button
              @click="openOrder(order._id)"
              class="bg-primary text-white px-4 py-1.5 md:px-3 md:py-2 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span v-if="isDesktopLarge">Открыть</span>
              <span v-else
                ><img src="../assets/img/delete.svg" alt="Открыть" class="w-5"
              /></span>
            </button>
            <button
              @click="deleteOrder(order._id)"
              class="bg-red-500 text-white px-4 py-1.5 md:px-3 md:py-2 rounded-md cursor-pointer hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <span v-if="isDesktopLarge">Удалить</span>
              <span v-else
                ><img src="../assets/img/delete.svg" alt="Удалить" class="w-5"
              /></span>
            </button>
          </div>
        </li>
      </ul>
      <!-- MOBILE -->
      <div v-else class="flex flex-col gap-4">
        <div
          v-for="order in orders"
          :key="order._id"
          class="flex flex-col gap-2 p-4 border border-border rounded-lg shadow-md bg-surface"
        >
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold">{{ order.name }}</h2>
            <div>{{ new Date(order.createdAt).toLocaleString() }}</div>
          </div>
          <div><b>Контрагент:</b> {{ order.agent }}</div>
          <div>
            <b>Итоговая сумма:</b> {{ formatPrice(totalSum(order)) }} сум
          </div>
          <div><b>Комментарий:</b> {{ order.comment }}</div>
          <div><b>Статус:</b> {{ getStatusText(order.statusCode) }}</div>
          <div class="flex justify-end items-center gap-2">
            <button
              @click="openOrder(order._id)"
              class="bg-primary text-white px-4 py-1.5 md:px-3 md:py-2 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Открыть
            </button>
            <button
              @click="deleteOrder(order._id)"
              class="bg-red-500 text-white px-4 py-1.5 md:px-3 md:py-2 rounded-md cursor-pointer hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
      <div v-if="!ifOrders" class="text-center text-gray-500 py-10">
        Нет сохраненных заказов
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { formatPrice } from "../utils/format.js";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

const router = useRouter();
const orders = ref(null);

onMounted(() => {
  getOrders();
});

const totalSum = (order) => {
  return order.products.reduce((total, product) => {
    return total + product.deliveryPrice * product.amount;
  }, 0);
};

const ifOrders = computed(() => {
  return orders.value && orders.value.length > 0;
});

const getOrders = async () => {
  try {
    const response = await fetch("http://192.168.100.33:3000/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Если неавторизован, перенаправляем на страницу входа
        router.push("/price-calc/login");
      }
      throw new Error("Failed to fetch orders");
    }
    orders.value = await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(
      `http://192.168.100.33:3000/orders/${orderId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Если неавторизован, перенаправляем на страницу входа
        router.push("/price-calc/login");
      }
      throw new Error("Failed to delete order");
    }
    const getOrderName = orders.value.find(
      (order) => order._id === orderId,
    ).name;
    // После удаления заказа, обновляем список заказов
    toast.success(`Заказ \`${getOrderName}\` успешно удален`);
    getOrders();
  } catch (error) {
    toast.error("Ошибка при удалении заказа");
    console.error("Error deleting order:", error);
  }
};

const getStatusText = (statusCode) => {
  switch (statusCode) {
    case "0":
      return "Новый";
    case "1":
      return "В процессе";
    case "2":
      return "Завершен";
    default:
      return "Неизвестный статус";
  }
};

const openOrder = (orderId) => {
  // Логика для открытия заказа, например, переход на страницу с деталями заказа

  localStorage.setItem(
    "products",
    JSON.stringify(
      orders.value.find((order) => order._id === orderId).products,
    ),
    localStorage.setItem(
      "roadExpense",
      orders.value.find((order) => order._id === orderId).roadExpense,
    ),
  );
  router.push(`/price-calc/`);
};

const isDesktop = computed(() => {
  return window.innerWidth >= 1024; // Условие для определения десктопной версии (можно настроить по своему усмотрению)
});

const isDesktopLarge = computed(() => {
  return window.innerWidth >= 1440; // Условие для определения десктопной версии (можно настроить по своему усмотрению)
});
</script>
