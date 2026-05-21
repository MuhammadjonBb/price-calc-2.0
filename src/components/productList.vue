<template>
  <div class="xl:p-6 md:p-3 p-1 text-text-main bg-surface min-h-screen">
    <div
      class="max-w-full mx-auto bg-surface border border-border shadow-2xl rounded-2xl lg:p-6 md:p-4 p-3 mb-10"
    >
      <div
        class="flex justify-between flex-col sm:flex-row md:flex-row gap-4 mb-6"
      >
        <router-link
          to="/price-calc/orders/"
          class="flex items-center p-2 px-4 text-blue-500 self-center outline rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
        >
          <h2 class="font-lg font-bold font-gray-800">
            Сохраненные заказы
          </h2></router-link
        >
        <h2 class="md:text-2xl text-xl font-bold">
          Расчет маржи и дорожных расходов
        </h2>
        <button
          @click="logout"
          class="bg-red-500 flex self-end items-center text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
        >
          <img src="../assets/img/exit.svg" alt="Выйти" class="w-5 mr-1" />
          Выйти
        </button>
      </div>

      <div class="grid gap-4 mb-4" v-if="isDesktop">
        <transition-group name="fade" tag="div" class="grid gap-3 relative">
          <div
            key="header"
            class="grid grid-cols-[24%_10%_6%_8%_8%_14%_13%_13%_4%] bg-blue-50 pt-4 pb-2 rounded-t-xl xl:font-semibold font-medium px-4 md:text-sm"
          >
            <div class="pr-1">Наименование</div>
            <div class="pr-1">СС Без НДС</div>
            <div class="pr-1">Ед. изм.</div>
            <div class="pr-1" v-if="isDesktopLarge">Количество</div>
            <div class="pr-1" v-else>Кол-во</div>
            <div class="pr-1">Маржа (%)</div>
            <div class="pr-1 max-w-9/10">Цена без доставки (Маржа + НДС)</div>
            <div class="pr-1 max-w-9/10">Цена с учетом доставки</div>
            <div class="pr-1">Сумма</div>
          </div>

          <!-- <div
          v-if="!products.length"
          class="text-gray-900 text-center p-4 mt-2 border-dashed border-2 border-gray-600  rounded-lg"
        >
          Добавьте товары для расчета
        </div> -->
          <productRow
            v-for="(product, index) in products"
            :key="product.id || index"
            :product="product"
            @update:finalPrice="setFinalPrice"
            @update:removeProduct="removeProduct"
          />

          <div class="grid grid-cols-2 gap-4" key="actions">
            <div key="search" class="flex flex-col gap-2">
              <h3 class="font-semibold text-lg">
                <img
                  src="../assets/img/search.svg"
                  alt="Поиск"
                  class="inline w-8 mr-0.5"
                />
                Поиск
              </h3>
              <productSearch
                @add-product="addProduct"
                :added-products="products"
              />
            </div>
            <div class="flex gap-2 justify-end">
              <button
                class="flex items-center self-end cursor-pointer outline -outline-offset-1 text-red-600 md:px-4 py-2.5 px-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                @click="
                  products = [];
                  roadExpense = '';
                  setFinalPrice();
                "
              >
                <!-- <img
                  src="../assets/img/clear.svg"
                  alt="Очистить"
                  class="w-5 md:w-7 inline mr-0.5"
                /> -->
                Очистить все
              </button>
              <button
                @click="openModal"
                class="self-end cursor-pointer bg-blue-500 text-white md:px-4 py-2.5 px-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Сохранить заказ
              </button>

              <OrderModal
                v-if="isModalOpen"
                @close="isModalOpen = false"
                @save="handleSave"
                @generate-kp="onGenerateKP"
              />
            </div>
          </div>
        </transition-group>
      </div>
      <!-- MOBILE -->
      <div v-else class="text-sm md:text-md">
        <!-- <div
          class="text-gray-900 text-center p-4 mt-2 border-d ashed border-2 border-gray-600 rounded-lg"
        >
          Калькулятор оптимизирован для десктопной версии. Пожалуйста,
          используйте его на компьютере для лучшего опыта.
        </div> -->
        <transition-group name="fade" tag="div" class="grid gap-1 relative">
          <productRow
            v-for="(product, index) in products"
            :key="product.id || index"
            :product="product"
            @update:finalPrice="setFinalPrice"
            @update:removeProduct="removeProduct"
          />
        </transition-group>
        <div class="flex flex-col gap-2 mt-2 md:text-sm">
          <h3 class="font-semibold text-sm">
            <img
              src="../assets/img/search.svg"
              alt="Поиск"
              class="inline w-8 mr-0.5"
            />
            Поиск
          </h3>
          <productSearch @add-product="addProduct" :added-products="products" />
          <div>
            <button
              @click="openModal"
              class="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              Сохранить заказ
            </button>

            <OrderModal
              v-if="isModalOpen"
              @close="isModalOpen = false"
              @save="handleSave"
              @generate-kp="onGenerateKP"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="grid grid-cols-1 2xl:grid-cols-2 gap-4 md:mt-6 mt-3 max-w-full mx-auto text-xs md:text-sm xl:text-xl"
    >
      <div
        class="flex flex-col gap-2 shadow-xl rounded-2xl md:p-6 p-3 border border-border"
      >
        <h3 class="font-semibold lg:text-lg text-sm">
          <img
            src="../assets/img/truck.svg"
            alt="Доставка"
            class="inline w-8 mr-0.5"
          />
          Дорожный расход:
        </h3>
        <div class="flex flex-col 2xl:flex-row justify-between gap-2">
          <input
            placeholder="Дорожный расход"
            name="roadExpense"
            type="text"
            class="w-full px-4 py-2 bg-primary-light border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            @input="setFinalPrice"
            v-model="formattedValue"
          />
        </div>
      </div>
      <div
        class="flex flex-col gap-2 shadow-xl rounded-2xl md:p-6 p-3 border border-border"
      >
        <h3 class="font-semibold lg:text-lg">Итого:</h3>
        <div>
          Количество наименований:
          <strong>{{ products.length }}</strong>
        </div>
        <div>
          Общая стоимость
          <span v-show="parseFloat(roadExpense) > 0">с доставкой</span>:
          <strong>{{ formatPrice(totalCost) }}</strong> сум
        </div>
        <div v-if="parseFloat(roadExpense) > 0">
          Общая стоимость без доставки:
          <strong>{{ formatPrice(totalCost - roadExpense) }} </strong> сум
        </div>
        <div>
          Средняя маржа:
          <strong>{{ formatPrice(avgMargin) }} %</strong>
        </div>
        <div>
          Прибыль:
          <strong class="text-green-500">
            {{ formatPrice(totalProfit) }}
          </strong>
          сум
        </div>
        <div>
          Дорожный расход:
          <strong class="text-orange-500">{{
            formatPrice(roadExpense)
          }}</strong>
          сум
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import productRow from "./productRow.vue";
import productSearch from "./productSearch.vue";
import OrderModal from "./orderModal.vue";
import { formatPrice } from "../utils/format.js";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { generateKP } from "../utils/generateKP.js";

const router = useRouter();
const products = ref([
  // {
  //   name: 'OSB 9mm',
  //   minPrice: 100,
  //   marginPrice: 120,
  //   finalPrice: 130,
  //   unit: 'м2',
  //   amount: 1,
  //   deliveryPrice: 10
  // },
]);
const roadExpense = ref("");

// Загружаем данные из Local Storage при загрузке страницы
onMounted(() => {
  if (localStorage.getItem("products")) {
    products.value = JSON.parse(localStorage.getItem("products"));
  }
  if (localStorage.getItem("roadExpense")) {
    roadExpense.value = parseFloat(localStorage.getItem("roadExpense"));
  }
});

// Функция для расчета итоговой цены с учетом маржи и дорожных расходов
const setFinalPrice = () => {
  const totalMarginPrice = products.value.reduce(
    (sum, product) => sum + product.marginPrice * product.amount,
    0,
  ); // Суммируем цену с маржой для всех продуктов, умножая на количество
  for (const product of products.value) {
    const productPriceSumm = product.marginPrice * product.amount; // Сумма для конкретного продукта (цена с маржой * количество)
    const productShare = totalMarginPrice
      ? productPriceSumm / totalMarginPrice
      : 0; // Доля конкретного продукта в общей сумме цен с маржой
    const deliveryCost = roadExpense.value
      ? productShare * roadExpense.value
      : 0; // Доля дорожного расхода для конкретного продукта
    product.deliveryPrice =
      productPriceSumm / product.amount + deliveryCost / product.amount; // Цена после доставки для конкретного продукта (с учетом его доли в дорожных расходах)
    product.finalPrice = productPriceSumm + deliveryCost; // Итоговая цена для конкретного продукта (цена с маржой + его доля в дорожных расходах)
  }
};

// Функция для добавления продукта в список
const addProduct = (product) => {
  products.value.push({
    ...product,
    deliveryPrice: 0,
    marginPrice: 0,
    amount: 1,
    finalPrice: 0,
    margin: 0,
  });
  setFinalPrice(); // Пересчитываем итоговую цену после добавления продукта
};

// Функция для удаления продукта из списка
const removeProduct = (product) => {
  const index = products.value.findIndex((p) => p.id === product.id);
  if (index !== -1) {
    products.value.splice(index, 1);
    setFinalPrice(); // Пересчитываем итоговую цену после удаления продукта
  }
};

// Используем Local Storage для сохранения данных при перезагрузке страницы
if (localStorage.getItem("products")) {
  products.value = JSON.parse(localStorage.getItem("products"));
  roadExpense.value = parseFloat(localStorage.getItem("roadExpense"));
}
// Сохраняем данные в Local Storage при изменении продуктов или дорожных расходов
watch(
  products,
  (newProducts) => {
    localStorage.setItem("products", JSON.stringify(newProducts));
    localStorage.setItem("roadExpense", roadExpense.value);
  },
  { deep: true },
);

// Форматируем значение дорожного расхода для отображения с пробелами
const formattedValue = computed({
  get() {
    if (!roadExpense.value) return "";
    return new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 2,
    }).format(roadExpense.value);
  },
  set(val) {
    // Убираем пробелы и всё кроме цифр
    roadExpense.value = val.replace(/\s/g, "").replace(/[^\d]/g, "");
  },
});

// Вычисляем общую стоимость товаров
const totalCost = computed(() => {
  return products.value.reduce((sum, product) => sum + product.finalPrice, 0);
});

// Вычисляем среднюю маржу
const avgMargin = computed(() => {
  if (products.value.length === 0) return 0;
  const totalMargin = products.value.reduce(
    (sum, product) => sum + parseFloat(product.margin || 0),
    0,
  );

  return totalMargin / products.value.length;
});
// Вычисляем общую прибыль
const totalProfit = computed(() => {
  return products.value.reduce((sum, product) => {
    const profitPerUnit =
      (product.marginPrice / 1.12 - product.minPrice) * product.amount; // Прибыль с учетом количества
    return sum + profitPerUnit;
  }, 0);
});

const isDesktop = computed(() => {
  return window.innerWidth >= 1024; // Условие для определения десктопной версии (можно настроить по своему усмотрению)
});

const isDesktopLarge = computed(() => {
  return window.innerWidth >= 1440; // Условие для определения десктопной версии (можно настроить по своему усмотрению)
});

// TODO: improve
const logout = () => {
  router.push("/price-calc/login");
  localStorage.removeItem("token");
};

// Модальное окно для сохранения заказа
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const handleSave = async (data) => {
  try {
    // тут ты склеиваешь мету + товары из калькулятора
    const order = {
      ...data, // данные из формы (имя, агент, комментарий, статус)
      products: products.value, // твои товары
      roadExpense: roadExpense.value, // дорожные расходы
    };

    await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(order),
    });

    toast.success("Заказ сохранен");
    isModalOpen.value = false;
  } catch (e) {
    toast.error("Ошибка при сохранении заказа");
    console.error(e);
  }
};

const onGenerateKP = () => {
  generateKP(products.value);
  toast.success("КП успешно сгенерировано");
};
</script>
