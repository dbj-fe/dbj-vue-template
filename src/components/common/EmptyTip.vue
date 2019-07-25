<template>
  <div
    v-if="!loading"
    class="empty-tip-container"
  >
    <div
      class="empty-tip-body"
      :class="noImg ? 'no-img' : ''"
    >
      <img
        v-if="!noImg"
        src="../../images/empty@2x.png"
      >
      <p
        v-if="title"
        class="title"
      >
        {{ title }}
      </p>
      <p
        v-if="tip"
        class="tip"
      >
        {{ tip }}
      </p>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "EmptyTip",
  props: ["title", "tip", "noImg", "btnText", "loading"]
};
</script>


<style>
.empty-tip-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 20px;
}

.empty-tip-body {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.empty-tip-body img {
  display: block;
  width: 306px;
  height: 290px;
}

.empty-tip-body .title {
  margin-top: 20px;
  font-size: 18px;
  color: #666666;
}

.empty-tip-body .tip {
  margin-top: 12px;
  font-size: 14px;
  color: #999999;
}

.empty-tip-body .el-button {
  margin-top: 20px;
}
</style>
