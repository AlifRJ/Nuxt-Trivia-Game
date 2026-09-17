import { ref, watch, onUnmounted, type Ref } from "vue";

export function useDragScroll() {
  const el = ref<HTMLElement | null>(null);
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  const onDown = (e: MouseEvent) => {
    if (!el.value) return;
    isDragging = true;
    startX = e.pageX - el.value.offsetLeft;
    scrollLeft = el.value.scrollLeft;
    el.value.style.cursor = "grabbing";
    el.value.style.userSelect = "none";
  };

  const onUp = () => {
    if (!el.value) return;
    isDragging = false;
    el.value.style.cursor = "grab";
    el.value.style.userSelect = "";
  };

  const onMove = (e: MouseEvent) => {
    if (!isDragging || !el.value) return;
    e.preventDefault();
    const x = e.pageX - el.value.offsetLeft;
    el.value.scrollLeft = scrollLeft - (x - startX);
  };

  // Mengatur event listener ketika elemen target dipasang/diubah
  watch(el, (targetEl, prevEl) => {
    if (prevEl) {
      prevEl.removeEventListener("mousedown", onDown);
      prevEl.removeEventListener("mousemove", onMove);
    }

    if (targetEl) {
      targetEl.addEventListener("mousedown", onDown);
      targetEl.addEventListener("mousemove", onMove);
      targetEl.style.cursor = "grab";
    }
  });

  // Listener global mouseup
  if (typeof window !== "undefined") {
    window.addEventListener("mouseup", onUp);
  }

  // Cleanup event listener saat komponen di-unmount
  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("mouseup", onUp);
    }
    if (el.value) {
      el.value.removeEventListener("mousedown", onDown);
      el.value.removeEventListener("mousemove", onMove);
    }
  });

  return el;
}
