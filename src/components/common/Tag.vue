<template>
  <span
    class="tag"
    :style="{
      backgroundColor: bgColor,
      color: fColor,
      borderColor: color
    }"
  >
    <slot />
  </span>
</template>

<script>
export default {
  name: "Tag",
  props: {
    color: {
      type: String,
      default: "#ffa800"
    },
    stroke: {
      type: Boolean,
      default: false
    },
    fColor: {
      type: String,
      default: function() {
        return this.stroke ? this.color : "#fff";
      }
    }
  },
  computed: {
    bgColor() {
      return this.stroke ? "transparent" : this.color;
    }
  }
};
</script>

<style>
.tag {
  display: inline-block;
  height: 18px;
  line-height: 16px;
  font-size: 12px;
  padding: 0 4px;
  background-color: transparent;
  color: #ffa800;
  border: 1px solid #ffa800;
  text-align: center;
  vertical-align: 2px;
}
</style>
