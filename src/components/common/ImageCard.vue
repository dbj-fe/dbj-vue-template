<template>
  <el-card
    class="image-card"
    :class="{
      'is-checked': isChecked
    }"
  >
    <div
      class="image-card__inner"
      @click="handleCardClick"
    >
      <img
        v-if="flag"
        v-show="flagShow"
        class="image-card__flag"
        :src="flag.img"
      >
      <div
        class="image-card__pic"
        @click="handleImageClick"
      >
        <span
          v-if="$parent.checkable"
          class="image-card__checkbox"
          :class="{
            'is-radio': $parent.isRadio
          }"
          type="checkbox"
        />
        <img
          v-if="item[currentImgKey || imageKey]"
          :src="`${item[currentImgKey || imageKey]}?x-oss-process=image/resize,m_lfit,h_448,w_448`"
        >
        <img
          v-else
          :src="currentEmptyImg || defaultEmptyImg"
        >
        <slot name="imgAppend" />
      </div>
      <div class="image-checked-border" />
      <div class="image-card__info-wrapper">
        <div
          class="image-card__title-wrapper"
          :class="{'has-tags--item': hasTags}"
        >
          <div class="image-card__views-wrapper">
            <h3>{{ item[nameKey] }}</h3>
            <div
              v-if="hasViews"
              class="image-card__views"
              @click="e => e.stopPropagation()"
            >
              <span
                v-for="(view, idx2) in views"
                v-if="viewShow(view)"
                :key="idx2"
                class="image-card__view"
                @mousemove="handleViewOver(view)"
                @mouseout="handleViewOut"
              >{{ view.text }}</span>
            </div>
          </div>
          <div
            v-if="tags.length"
            class="image-card__tags"
          >
            <span
              v-for="(tag, idx2) in tags"
              v-if="tagShow(tag)"
              :key="idx2"
              class="image-card__tag"
              :style="tagStyle(tag)"
            >{{ tag.text }}</span>
          </div>
        </div>
        <div
          v-for="(info, idx2) in infos"
          :key="idx2"
          class="image-card__item-info"
          :title="lodash.get(item, info.prop)"
        >
          <span v-if="info.label">{{ info.label }}：</span>{{ lodash.get(item, info.prop) || '暂无' }}
        </div>
        <slot name="info" />
      </div>
      <div
        class="image-card__dropdown"
        @click="e => e.stopPropagation()"
      >
        <el-dropdown
          v-if="commands.length > 0"
          :visible-arrow="false"
          trigger="click"
          size="medium"
          @command="editItem"
        >
          <i class="icon-expand" />
          <el-dropdown-menu slot="dropdown">
            <template v-for="(command, idx2) in commands">
              <el-dropdown-item
                v-if="!command.prop || (command.prop && item[command.prop] == command.showValue)"
                :key="idx2"
                :command="command.value"
              >
                {{ command.text }}
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div
        v-if="$parent.deletable"
        class="image-card__del-btn"
        @click="$parent.$emit('delete', item, idx)"
      >
        <i class="icon-closed" />
      </div>
    </div>
  </el-card>
</template>

<script>
import lodash from "lodash";
import defaultEmptyImg from "@/images/no-pic@2x.png";

export default {
  name: "ImageCard",
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      }
    },
    idx: {
      type: Number,
      default: -1
    },
    idKey: {
      type: String,
      default: "id"
    },
    imageKey: {
      type: String,
      default: "image"
    },
    nameKey: {
      type: String,
      default: "name"
    },
    flag: {
      type: Object,
      default: function() {
        return null;
      }
    },
    infos: {
      type: Array,
      default: function() {
        return [];
      }
    },
    commands: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tags: {
      type: Array,
      default: function() {
        return [];
      }
    },
    views: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      currentImgKey: "",
      currentEmptyImg: ""
    };
  },
  computed: {
    lodash() {
      return lodash;
    },
    defaultEmptyImg() {
      return defaultEmptyImg;
    },
    model: {
      get() {
        return this.$parent.value;
      },
      set(val) {
        this.$parent.$emit("input", val);
      }
    },
    isChecked() {
      return this.model.indexOf(this.item[this.idKey]) > -1;
    },
    flagShow() {
      if (this.flag) {
        let val = lodash.get(this.item, this.flag.prop);
        if (val == this.flag.showValue) {
          return true;
        }
      }
      return false;
    },
    hasTags() {
      return this.tags.some(tag => this.tagShow(tag));
    },
    hasViews() {
      return this.views.some(view => this.viewShow(view));
    }
  },
  methods: {
    handleCardClick() {
      if (this.$parent.checkable) {
        if (this.$parent.isRadio) {
          this.model = [this.item[this.idKey]];
        } else {
          this.model = lodash.xor(this.model, [this.item[this.idKey]]);
        }
      }
    },
    handleImageClick() {
      this.$parent.$emit("image-click", this.item);
    },
    tagShow(tag) {
      if (tag) {
        let val = lodash.get(this.item, tag.prop);
        if (val == tag.showValue) {
          return true;
        }
      }
      return false;
    },
    tagStyle(tag) {
      let { stroke = false, color = "#ffa800" } = tag;
      if (stroke) {
        return {
          border: `1px solid ${color}`,
          color: color
        };
      }
      return {
        border: `1px solid ${color}`,
        "background-color": color
      };
    },
    viewShow(view) {
      if (view) {
        let val = lodash.get(this.item, view.prop);
        if (val == view.showValue) {
          return true;
        }
      }
      return false;
    },
    editItem(cmd) {
      this.$parent.$emit("command", cmd, this.item);
    },
    handleViewOver(view) {
      if (typeof view.image !== "undefined") {
        this.currentImgKey = view.image;
        this.currentEmptyImg = view.emptyImg;
      }
    },
    handleViewOut() {
      this.currentImgKey = "";
      this.currentEmptyImg = "";
    }
  }
};
</script>

<style>
.image-card.el-card {
  width: 226px;
  padding: 0;
  margin-right: 16px;
  margin-bottom: 16px;
  border: 1px solid #f2f2f2;
  position: relative;
  border-radius: 0;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.04);
  overflow: visible;
}

.image-card .el-card__body {
  padding: 0;
  line-height: 0;
}

.image-card__inner {
  position: relative;
  cursor: pointer;
}

.image-card__pic {
  width: 224px;
  height: 224px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
}

.image-card__pic::before {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.02);
}

.image-card__pic img {
  max-width: 224px;
  max-height: 224px;
}

.image-card__flag {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
}

.image-card__info-wrapper {
  padding: 12px 16px;
  overflow: hidden;
}

.image-card__title-wrapper {
  line-height: 18px;
  margin-bottom: 8px;
  height: 45px;
}

.image-card__title-wrapper h3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  height: 36px;
  font-size: 14px;
  font-weight: normal;
  word-break: break-all;
}

.image-card__views-wrapper {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  justify-content: space-between;
}

.image-card__views {
  flex: none;
  margin-left: 4px;
}

.image-card__view {
  color: #999;
  border: 1px solid #999;
  display: inline-block;
  font-size: 12px;
  line-height: 16px;
  padding: 0 2px;
  vertical-align: middle;
  cursor: pointer;
  margin-left: 4px;
  user-select: none;
}

.image-card__view:hover {
  color: #ffa800;
  border-color: #ffa800;
}

.image-card__title-wrapper.has-tags--item h3 {
  display: block;
  white-space: nowrap;
  flex: 1;
  height: 18px;
}

.image-card__title-wrapper.has-tags--item .image-card__tags {
  display: block;
}

.image-card__tags {
  line-height: 12px;
  margin-top: 8px;
  display: none;
}

.image-card__tag {
  display: inline-block;
  padding: 2px 6px;
  margin-right: 8px;
  font-size: 12px;
  color: #ffffff;
  line-height: 12px;
}

.image-card__item-info {
  font-size: 12px;
  line-height: 18px;
  margin-top: 4px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-card__dropdown {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.image-card__dropdown .el-dropdown {
  font-size: 24px;
  color: #999;
  line-height: 1px;
}

.image-card__dropdown .el-dropdown:hover {
  color: #ffa800;
}

.image-card__checkbox {
  position: absolute;
  z-index: 100;
  top: 12px;
  right: 12px;
  display: none;
  background-color: #fff;
  border: 1px solid #ffa800;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  transition: background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
  cursor: pointer;
}

.image-card__checkbox::after {
  box-sizing: content-box;
  content: "";
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
  position: absolute;
  height: 10px;
  width: 4px;
  left: 6px;
  top: 2px;
  transform: rotate(45deg) scaleY(0);
  transform-origin: center;
  transition: transform 0.15s ease-in 0.05s;
}

.image-card__checkbox.is-radio {
  transition: none;
}

.image-card__checkbox.is-radio::after {
  border: none;
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: rotate(0deg) translate(-50%, -50%) scale(0);
  transition: transform 0.15s ease-in;
}

.image-card:hover .image-card__checkbox {
  display: block;
}

.image-checked-border {
  display: none;
  position: absolute;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid #ffa800;
  border-radius: 0;
  pointer-events: none; /*使该层不响应鼠标事件*/
  transition: all 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}

.image-card.is-checked .image-card__checkbox {
  display: block;
  background-color: #ffa800;
  border-color: #ffa800;
}

.image-card.is-checked .image-card__checkbox::after {
  transform: rotate(45deg) scaleY(1);
}

.image-card.is-checked .image-card__checkbox.is-radio::after {
  transform: rotate(0deg) translate(-50%, -50%) scale(1);
}

.image-card.is-checked .image-checked-border {
  display: block;
}

.image-card__del-btn {
  width: 18px;
  height: 18px;
  position: absolute;
  z-index: 21;
  top: -9px;
  right: -9px;
  background: #999;
  border-radius: 50%;
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  display: none;
}

.image-card__del-btn:hover {
  background: #666;
}

.image-card:hover .image-card__del-btn {
  display: flex;
}
</style>

