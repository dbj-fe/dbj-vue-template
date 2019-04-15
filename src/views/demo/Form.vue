<template>
  <div class="form-container">
    <div class="form-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path: '/test'}">
          XX管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>新建XX</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-body">
      <el-form
        ref="form"
        :model="formData"
        label-width="180px"
      >
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-header-col">
              信息1<span class="tip">价格信息会在生成物料清单及报价时显示</span>
            </div>
          </div>
          <div class="form-section-body">
            <el-form-item label="活动名称">
              <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="活动区域">
              <el-select
                v-model="formData.region"
                placeholder="请选择活动区域"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="活动性质">
              <el-checkbox-group v-model="formData.type">
                <el-checkbox
                  label="美食/餐厅线上活动"
                  name="type"
                />
                <el-checkbox
                  label="地推活动"
                  name="type"
                />
                <el-checkbox
                  label="线下主题活动"
                  name="type"
                />
                <el-checkbox
                  label="单纯品牌曝光"
                  name="type"
                />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="格局"
              prop="pattern"
            >
              <ul class="form-items-horizonal">
                <li>
                  <el-input
                    v-model="formData.bedroom"
                    placeholder="0"
                  >
                    <template slot="suffix">
                      室
                    </template>
                  </el-input>
                </li>
                <li>
                  <el-input
                    v-model="formData.livingRoom"
                    placeholder="0"
                  >
                    <template slot="suffix">
                      厅
                    </template>
                  </el-input>
                </li>
                <li>
                  <el-input
                    v-model="formData.kitchen"
                    placeholder="0"
                  >
                    <template slot="suffix">
                      厨
                    </template>
                  </el-input>
                </li>
                <li>
                  <el-input
                    v-model="formData.bathroom"
                    placeholder="0"
                  >
                    <template slot="suffix">
                      卫
                    </template>
                  </el-input>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="特殊资源">
              <el-radio-group v-model="formData.resource">
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线下场地免费" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式">
              <el-input
                v-model="formData.desc"
                type="textarea"
              />
            </el-form-item>
          </div>
        </div>
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-header-col">
              信息1
            </div>
          </div>
          <div class="form-section-body">
            <el-form-item label="活动名称">
              <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="活动区域">
              <el-select
                v-model="formData.region"
                placeholder="请选择活动区域"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="活动性质">
              <el-checkbox-group v-model="formData.type">
                <el-checkbox
                  label="美食/餐厅线上活动"
                  name="type"
                />
                <el-checkbox
                  label="地推活动"
                  name="type"
                />
                <el-checkbox
                  label="线下主题活动"
                  name="type"
                />
                <el-checkbox
                  label="单纯品牌曝光"
                  name="type"
                />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源">
              <el-radio-group v-model="formData.resource">
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线下场地免费" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式">
              <el-input
                v-model="formData.desc"
                type="textarea"
              />
            </el-form-item>
          </div>
        </div>
        <div class="form-btns-wrapper">
          <el-button type="primary">
            确定
          </el-button>
          <el-button>取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "DemoForm",
  data() {
    return {
      formData: {
        name: "",
        region: "",
        type: [],
        resource: "",
        desc: "",
        bedroom: "",
        livingRoom: "",
        kitchen: "",
        bathroom: ""
      }
    };
  }
};
</script>
