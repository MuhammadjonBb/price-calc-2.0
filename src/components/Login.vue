<template>
  <div class="min-h-screen bg-black flex items-center justify-center px-4">
    <!-- Card -->
    <div
      class="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 transition-all duration-300"
    >
      <!-- Title -->
      <h1
        class="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 sm:mb-8"
      >
        Вход
      </h1>

      <!-- Input -->
      <div class="space-y-4">
        <div class="flex flex-col justify-between items-center gap-2">
          <input
            v-model="login"
            type="text"
            placeholder="Введите логин"
            @keyup.enter="handleLogin"
            class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
          />
          <div class="flex justify-between items-center gap-2 w-full">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Введите пароль"
              @keyup.enter="handleLogin"
              class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            />
            <button
              @click="showPassword = !showPassword"
              class="text-sm text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none"
            >
              <div class="w-10 h-10 flex items-center justify-center">
                <img
                  v-show="showPassword"
                  src="../assets/img/eye-hidepassword.svg"
                  alt="Показать"
                />
                <img
                  v-show="!showPassword"
                  src="../assets/img/eye-showpassword.svg"
                  alt="Скрыть"
                />
              </div>
            </button>
          </div>
        </div>

        <!-- Button -->
        <button
          @click="handleLogin"
          class="w-full bg-black text-white py-3 rounded-xl text-sm sm:text-base font-medium hover:opacity-90 active:scale-[0.98] transition duration-200 cursor-pointer"
        >
          Войти
        </button>
      </div>

      <!-- Error -->
      <p
        v-if="error"
        class="text-red-500 text-sm text-center mt-4 animate-pulse"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

const password = ref("");
const login = ref("");
const error = ref("");
const showPassword = ref(false);
const router = useRouter();

// Функция для обработки входа
const handleLogin = async (e) => {
  e.preventDefault();

  await toast.promise(
    fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: login.value.trim(),
        password: password.value.trim(),
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ошибка при входе");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      router.push("/");
    }),
    {
      loading: "Выполняется вход...",
      success: "Вход выполнен успешно",
      error: (err) => err.message,
    },
  );
};
</script>
