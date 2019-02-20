<template>
  <div class="pic-wrapper" :style="containerStyle">
    <img v-if="src" :src="src" :style="imgStyle" />
    <img v-else src="../../images/no-pic@2x.png" :style="imgStyle" />
  </div>
</template>

<script>
export default {
  name: "Pic",
  props: ["src", "width", "height"],
  computed: {
    w() {
      return this.width || 120;
    },
    h() {
      return this.height || 120;
    },
    imgStyle() {
      return {
        maxWidth: this.w + "px",
        maxHeight: this.h + "px"
      };
    },
    containerStyle() {
      return {
        width: this.w + "px",
        height: this.h + "px"
      };
    }
  }
};
</script>

<style>
.pic-wrapper {
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

