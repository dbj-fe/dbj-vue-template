<template>
  <div
    v-if="data.length > 0"
    class="image-card-list"
    :class="{'no-check': !checkable}"
  >
    <image-card
      v-for="(item, idx) in data"
      :key="idx"
      :item="item"
      :idx="idx"
      :id-key="props.id"
      :image-key="props.image"
      :name-key="props.name"
      :flag="props.flag"
      :infos="props.infos"
      :commands="props.commands"
      :tags="props.tags"
      :views="props.views"
    >
      <slot
        slot="imgAppend"
        name="imgAppend"
        :data="item"
      />
      <slot
        slot="info"
        name="info"
        :item="item"
        :index="idx"
      />
    </image-card>
  </div>
  <empty-tip
    v-else
    :title="emptyTitle"
    :tip="emptyText"
  />
</template>

<script>
import EmptyTip from "@/components/common/EmptyTip";
import ImageCard from "@/components/common/ImageCard";
export default {
  name: "ImageCardList",
  components: { EmptyTip, ImageCard },
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    props: {
      type: Object,
      default: function() {
        return {};
      }
    },
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    checkable: {
      type: Boolean,
      default: false
    },
    deletable: {
      type: Boolean,
      default: false
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: ""
    },
    emptyTitle: {
      type: String,
      default: ""
    }
  }
};
</script>

<style>
.image-card-list {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
}

.image-card-list.no-check .image-card__inner {
  cursor: auto;
}
</style>

