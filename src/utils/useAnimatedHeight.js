import { ref, onMounted, onUnmounted } from "vue";

export function useAnimatedHeight(targetRef) {
  const height = ref("auto");
  let observer = null;

  onMounted(() => {
    observer = new ResizeObserver(() => {
      if (targetRef.value) {
        height.value = targetRef.value.offsetHeight + 50 + "px";
      }
    });
    if (targetRef.value) observer.observe(targetRef.value);
  });

  onUnmounted(() => observer?.disconnect());

  return { height };
}
