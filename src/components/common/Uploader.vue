<template>
  <el-upload
    class="uploader"
    :action="uploadServerUrl"
    :data="uploadData"
    :before-upload="beforeUpload"
    :on-progress="uploadProgress"
    :on-success="uploadSuccess"
    :show-file-list="false"
    :accept="acceptType"
  >
    <slot v-if="$slots.default" />
    <div
      v-else-if="type == 'image'"
      class="uploader-img-wrapper"
      :class="{hasImg: imageSrc}"
    >
      <img
        v-if="imageSrc"
        :src="imageSrc"
      >
      <div class="uploader-tip-wrapper">
        <i>+</i>
        <div class="title">
          {{ btnText2 }}
        </div>
        <div
          v-if="tip"
          class="tip"
        >
          {{ tip }}
        </div>
      </div>
    </div>
    <template v-else>
      <a
        class="uploader-btn"
        href="javascript:void(0)"
      >
        <i class="icon-upload" />上传文件</a>
      <div
        v-if="tip"
        slot="tip"
        class="uploader-tip"
      >
        {{ tip }}
      </div>
    </template>
  </el-upload>
</template>

<script>
/**
 * type {"image"|"resource"|"video"} 必填，上传资源的类型，image:图片文件，video:视频文件，resource:其他资源文件
 *
 * prefix {string} 生成文件key的前缀，请根据业务取名字
 */
import { getUploadToken } from "../../service";
import { getFileKey, getFileMd5 } from "@/utils/util";
import lodash from "lodash";
export default {
  name: "Uploader",
  props: [
    "type",
    "prefix",
    "fileType",
    "maxSize",
    "tip",
    "md5",
    "accept",
    "btnText",
    "fileUrl"
  ],
  data() {
    return {
      name: "",
      size: 0,
      fileKey: "",
      uploadServerUrl: "https://dbj-test.oss-cn-beijing.aliyuncs.com",
      accessServerUrl: "",
      imageSrc: "",
      uploadData: {
        OSSAccessKeyId: "",
        policy: "",
        signature: "",
        success_action_status: "200", //让服务端返回200,不然，默认会返回204
        key: ""
      }
    };
  },
  computed: {
    acceptType() {
      if (this.accept) {
        return this.accept;
      }
      if (this.type == "image") {
        return "image/jpg,image/jpeg,image/png,image/bmp";
      }
      return "";
    },
    btnText2() {
      return (this.imageSrc ? "替换" : "上传") + (this.btnText || "图片");
    }
  },
  watch: {
    fileUrl(val) {
      if (val) {
        this.imageSrc = val;
      }
    }
  },
  mounted() {
    if (this.fileUrl) {
      this.imageSrc = this.fileUrl;
    }
  },
  methods: {
    beforeUpload(file) {
      this.fileKey = getFileKey(file.name, this.prefix || "DBJ");
      return new Promise((resolve, reject) => {
        if (!this.type || !/(image|video|resource)/.test(this.type)) {
          this.$message.error(
            "上传组件必须填写type属性，取值有image、video、resource"
          );
          reject();
          return;
        }
        if (this.fileType) {
          let reg = new RegExp("\\." + this.fileType + "$", "i");
          if (lodash.indexOf(this.fileType, ",") >= 0) {
            let arr = this.fileType.split(",");
            arr = arr.map(item => "\\." + item);
            reg = new RegExp("(" + arr.join("|") + ")$", "i");
          }
          if (!reg.test(file.name)) {
            this.$message.error("文件格式不对");
            reject();
            return;
          }
        } else {
          if (this.type == "image") {
            if (!/(\.jpg|\.png|\.bmp|\.jpeg)$/i.test(file.name)) {
              this.$message.error("文件格式不对");
              reject();
              return;
            }
          }
        }
        if (this.maxSize) {
          if (file.size > this.maxSize) {
            this.$message.error("文件过大");
            reject();
            return;
          }
        }
        getUploadToken(this.type.toUpperCase())
          .then(res => {
            let { data } = res;
            this.uploadData.OSSAccessKeyId = data.accessid;
            this.uploadData.policy = data.policy;
            this.uploadData.signature = data.signature;
            this.uploadData.key = data.dir + "/" + this.fileKey;
            this.uploadServerUrl = data.host;
            this.accessServerUrl = data.ossUrl;
            this.name = file.name;
            this.size = file.size;
            this.$emit(
              "before-upload",
              this.accessServerUrl,
              this.fileKey,
              this.size,
              this.name
            );
            resolve();
          })
          .catch(e => {
            reject();
          });
      });
    },
    uploadProgress(event, file, fileList) {
      let { percent = 0, total, loaded } = event;
      this.$emit("progress", percent, total, loaded);
    },
    uploadSuccess(res, file, fileList) {
      if (this.type == "image") {
        this.imageSrc = this.accessServerUrl + this.fileKey;
      }
      if (this.md5) {
        getFileMd5(file.raw, md5 => {
          this.$emit(
            "success",
            this.accessServerUrl,
            this.fileKey,
            this.size,
            md5
          );
        });
      } else {
        this.$emit("success", this.accessServerUrl, this.fileKey, this.size);
      }
    }
  }
};
</script>


<style>
.uploader-img-wrapper {
  width: 232px;
  height: 232px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  cursor: pointer;
}

.uploader-img-wrapper img {
  max-width: 232px;
  max-height: 232px;
}

.uploader-tip-wrapper {
  padding: 0 24px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.uploader-tip-wrapper i {
  display: inline-block;
  text-align: center;
  line-height: 20px;
  width: 24px;
  height: 24px;
  background: #ffa800;
  color: #fff;
  font-size: 24px;
  border-radius: 14px;
}

.uploader-tip-wrapper .title {
  color: #333;
}

.uploader-tip-wrapper .tip {
  font-size: 12px;
  color: #999;
  line-height: 20px;
}

.uploader-img-wrapper:hover .uploader-tip-wrapper i {
  background: #ffba00;
}

.uploader-img-wrapper.hasImg .uploader-tip-wrapper {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
}

.uploader-img-wrapper.hasImg .uploader-tip-wrapper .title {
  color: #fff;
}

.uploader-img-wrapper.hasImg:hover .uploader-tip-wrapper {
  display: flex;
}

.uploader-btn {
  font-size: 12px;
  color: #333;
}

.uploader-btn i {
  font-size: 16px;
  vertical-align: -3px;
}

.uploader-tip {
  color: #999;
  font-size: 12px;
}
</style>
