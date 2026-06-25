<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
        @click.self="$emit('update:modelValue', false)"
      >
        <div
          class="bg-white rounded-xl border border-gray-200 w-full max-w-md sm:max-w-lg shadow-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <!-- Тело -->
          <div class="p-5 sm:p-7 flex items-start gap-3 sm:gap-4">
            <div
              class="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-50 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 sm:w-6 sm:h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                />
              </svg>
            </div>
            <div>
              <h3
                id="modal-title"
                class="text-base sm:text-lg font-medium text-gray-900 mb-1"
              >
                Очистить все?
              </h3>
              <p class="text-sm sm:text-base text-gray-500 leading-relaxed">
                Будут удалены список продуктов и дорожный расход. Это действие
                нельзя отменить.
              </p>
            </div>
          </div>

          <!-- Футер -->
          <div
            class="px-5 sm:px-7 pb-5 sm:pb-7 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end"
          >
            <button
              class="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
              @click="$emit('update:modelValue', false)"
            >
              Отмена
            </button>
            <button
              class="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              @click="handleConfirm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                />
              </svg>
              Очистить всё
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup>
defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "confirm"]);

function handleConfirm() {
  emit("confirm");
  emit("update:modelValue", false);
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .bg-white {
  transform: scale(0.96) translateY(8px);
}
</style>
