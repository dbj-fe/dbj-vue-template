<template>
  <div
    v-if="load"
    class="lazy-load"
  >
    <slot />
  </div>
</template>

<script>
/**
 * 懒加载组件，只有组件显示的时候才去加载，
 * 并且仅加载一次，再次显示时不会重复加载
 */
export default {
  name: "LazyLoad",
  props: ["visible"],
  data() {
    return {
      load: false
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.load = true;
        }
      }
    }
  }
};
</script>

<style>
.lazy-load {
  width: 100%;
  height: 100%;
}
</style>
