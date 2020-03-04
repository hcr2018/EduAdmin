<template>
  <!-- --------------------数据编辑或者添加表单组件----------------------- -->
  <div class="pad20">
    <el-form
      :model="currentItemData"
      :rules="newsFormRules"
      ref="newsForm"
      size="small"
      label-width="80px"
    >
      <div class="flex_mid">
        <el-tooltip class="item" effect="dark" content="显示在列表前面的图片,点击可修改" placement="top-start">
          <el-upload
            :multiple="false"
            :on-change="newsImgUpload"
            :show-file-list="false"
            :auto-upload="false"
            action
          >
            <img :src="currentItemData.icon" width="100px" height="100px" />
          </el-upload>
        </el-tooltip>
        <div class="flex_1 m-l-30">
          <div class="flex_dom">
            <el-form-item style="width:50%;" label="保密级别">
              <el-slider
                class="m-l-30"
                v-model="currentItemData.Right"
                :format-tooltip="formatTooltipFunc"
                :marks="common.docRightmarks"
                :min="0"
                :max="5"
              ></el-slider>
            </el-form-item>
            <el-form-item label="附件地址" style="width:50%;">
              <el-upload
                style="width:100%;"
                :multiple="false"
                :on-change="uploadEnclosure"
                :show-file-list="false"
                :auto-upload="false"
                action
              >
                <el-input placeholder="点击上传" v-model="currentItemData.Downfile"></el-input>
              </el-upload>
            </el-form-item>
          </div>
          <el-form-item label="标题" prop="Title" class="m-t-20">
            <el-input placeholder="请输入内容" v-model="currentItemData.Title"></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="副标题">
        <el-input placeholder="请输入内容" v-model="currentItemData.Description"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <Tinymce ref :height="400" v-model="currentItemData.Content"></Tinymce>
      </el-form-item>
    </el-form>
    <div class="center-end m-v-15">
      <el-button @click="cancleUpdate" class="m-r-30">取 消</el-button>
      <el-button type="primary" @click="saveNewsFormData">保 存</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { editNewsRow, addNewsRow } from "@/api/news";
import common from "@/utils/common";
import $ImgAPI from "@/api/ImgAPI";
export default {
  name: "newsForm",
  props: {
    // 表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    platform: {
      typ: Number,
      default: 0
    },
    college: {
      typ: Number,
      default: 0
    }
  },
  components: {
    Tinymce
  },
  data() {
    return {
      common, 
      // 表单验证
      newsFormRules: {
        Title: [{ required: true, message: "标题不能为空", trigger: "blur" }]
      },
      currentPlatfrom: 0,
      currentItemData: {
        CollegeID: 0,
        Platform: 0,
        Content:""
      }
    };
  },
  watch: {
    formItemData(newvar) {
      this.setData();
    },
    platform(newvar) {
      this.setData();
    },
    college(newvar) {
      this.setData();
    }
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      this.currentItemData = this.formItemData; 
    },

    formatTooltipFunc(value) {
      if (this.common.docRightmarks[value]) {
        return "允许下载" + this.common.docRightmarks[value].label + "的资料";
      }
      return "";
    },
    // 上传的图片
    async newsImgUpload(file) {
      let res = await $ImgAPI.UploadImg("news", file.raw);
      if (res.code == 200) {
        this.currentItemData.icon = res.data;
      }
    },
    // 上传附件之前的验证
    beforeUploadEnclosure(type) {
      let isRightType = false;
      switch (type) {
        case "image/jpg":
          isRightType = true;
          break;
        case "image/jpeg":
          isRightType = true;
          break;
        case "image/png":
          isRightType = true;
          break;
        case "image/gif":
          isRightType = true;
          break;
        case "image/pdf":
          isRightType = true;
          break;
        case "image/doc":
          isRightType = true;
          break;
        case "image/docx":
          isRightType = true;
          break;
        case "image/xls":
          isRightType = true;
          break;
        case "image/xlsx":
          isRightType = true;
          break;
        case "image/ppt":
          isRightType = true;
          break;
        case "image/pptx":
          isRightType = true;
          break;
        case "image/rar":
          isRightType = true;
          break;
        case "image/zip":
          isRightType = true;
          break;
        default:
          isRightType = false;
          break;
      }
      console.log(isRightType);
      if (!isRightType) {
        this.$message(
          "文件仅支持jpg/jpeg/png/gif/pdf/doc/docx/xls/xlsx/ppt/pptx/rar/zip等格式!"
        );
      }
      return isRightType;
    },
    // 上传附件
    async uploadEnclosure(file) {
      // 上传附件之前的验证
      let RightType = this.beforeUploadEnclosure(file.raw.type);
      if (RightType) {
        let res = await $ImgAPI.UploadImg("news", file.raw);
        if (res.code == 200) {
          this.currentItemData.Downfile = res.data;
        }
      }
    },
    // 添加或编辑数据
    saveNewsFormData() {
      // 验证表单数据
      console.log("  this.currentItemData:",  this.currentItemData)
       this.currentItemData.Platform = this.platform;
       this.currentItemData.CollegeID = this.college;
      this.$refs.newsForm.validate(async valid => {
        if (valid) {
          if (this.currentItemData.Id > 0) {
            // 编辑数据
            let res = await editNewsRow(
              this.currentItemData.Id,
              "",
              this.currentItemData
            );
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.currentItemData = res.data;
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$emit("updateRowData", res.data, 1);
            }
          } else {
            // 添加数据
            let res = await addNewsRow("", "", this.currentItemData);
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.currentItemData = res.data;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.$emit("updateRowData", res.data, 0);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 取消编辑或者添加
    cancleUpdate() {
      this.$emit("updateRowData");
    }
  }
};
</script> 
<style scoped>
</style>