<template>
  <!-- --------------------数据编辑或者添加表单组件----------------------- -->
  <div class="pad20">
    <el-form
      :model="formItemData"
      :rules="newsFormRules"
      ref="newsForm"
      size="small"
      label-width="80px"
    >
      <div class="flex_mid m-b-20">
        <el-tooltip class="item" effect="dark" content="显示在列表前面的图片,点击可修改" placement="top-start">
          <el-upload
            :multiple="false"
            :on-change="newsImgUpload"
            :show-file-list="false"
            :auto-upload="false"
            action
          >
            <img :src="formItemData.icon" width="100px" height="100px" />
          </el-upload>
        </el-tooltip>
        <div class="flex_1 m-l-30">
          <div class="flex_dom">
            <el-form-item label="类别">
              <el-select v-model="formItemData.KindId" placeholder="请选择类别">
                <el-option
                  :label="item.Label"
                  :key="index"
                  :value="item.value"
                  v-for="(item,index) in newsKindOptions"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="附件">
              <el-upload
                :multiple="false"
                :on-change="uploadEnclosure"
                :show-file-list="false"
                :auto-upload="false"
                action
              >
                <el-input placeholder="附件地址" v-model="formItemData.Downfile"></el-input>
              </el-upload>
            </el-form-item>
          </div>
          <el-form-item label="标题" prop="Title">
            <el-input placeholder="请输入内容" v-model="formItemData.Title"></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="副标题">
        <el-input placeholder="请输入内容" v-model="formItemData.Description"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <Tinymce ref :height="400" v-model="formItemData.Content"></Tinymce>
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
    editEnable: {
      typ: Boolean,
      default: false
    }
  },
  components: {
    Tinymce
  },
  data() {
    return {
      common,
      // 类型的选项
      newsKindOptions: [
        {
          value: 1,
          Label: "企业动态"
        },
        {
          value: 2,
          Label: "就业动态"
        },
        {
          value: 3,
          Label: "行业动态"
        }
      ],
      // 表单验证
      newsFormRules: {
        Title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 上传的图片
    async newsImgUpload(file) {
      let res = await $ImgAPI.UploadImg("news", file.raw);
      if (res.code == 200) {
        this.formItemData.icon = res.data;
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
          this.formItemData.Downfile = res.data;
        }
      }
    },
    // 添加或编辑数据
    saveNewsFormData() {
      // 验证表单数据
      this.$refs.newsForm.validate(async valid => {
        if (valid) {
          if (this.formItemData.Id > 0) {
            // 编辑数据
            let res = await editNewsRow(
              this.formItemData.Id,
              "",
              this.formItemData
            );
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.formItemData = res.data;
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$emit("updateRowData", res.data, 1);
            }
          } else if (this.formItemData.Id == 0) {
            // 添加数据
            let res = await addNewsRow("", "", this.formItemData);
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.formItemData = res.data;
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
  },
  mounted() {}
};
</script> 
<style scoped>
</style>