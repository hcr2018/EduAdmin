<template>
  <!-- --------------------新闻数据编辑或者添加表单组件----------------------- -->
  <div class="pad20">
    <el-form
      :model="newsFormData"
      :rules="newsFormRules"
      ref="newsForm"
      size="small"
      label-width="80px"
    >
      <div class="center m-b-20">
        <el-tooltip class="item" effect="dark" content="显示在新闻列表前面的图片,点击可修改" placement="top-start">
          <el-upload
            :multiple="false"
            :on-change="newsImgUpload"
            :show-file-list="false"
            :auto-upload="false"
            action
          >
            <img :src="newsFormData.icon" width="100px" height="100px" />
          </el-upload>
        </el-tooltip>
        <div class="flex_1 m-l-30">
          <div class="center">
            <el-form-item label="类别">
              <el-select v-model="newsFormData.KindId" placeholder="请选择类别">
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
                <el-input placeholder="附件地址" v-model="newsFormData.Downfile"></el-input>
              </el-upload>
            </el-form-item>
          </div>
          <el-form-item label="新闻标题" prop="Title">
            <el-input placeholder="请输入内容" v-model="newsFormData.Title"></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="副标题">
        <el-input placeholder="请输入内容" v-model="newsFormData.Description"></el-input>
      </el-form-item>
      <el-form-item label="新闻内容">
        <Tinymce ref v-if="tinymceShow" :height="400" v-model="newsFormData.Content"></Tinymce>
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
import { UploadImgNews } from "@/api/upload";
export default {
  name: "newsFormData",
  components: {
    Tinymce
  },
  data() {
    return {
      common,
      // 新闻的表单数据
      newsFormData: {},
      // 新闻类型的选项
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
          { required: true, message: "新闻标题不能为空", trigger: "blur" }
        ]
      },
      // 控制富文本的显示
      tinymceShow: false
    };
  },
  methods: {
    // 获取数据进行添加编辑
    getFormData(data) {
      this.tinymceShow = true;
      this.newsFormData = {};
      this.newsFormData = data;
    },
    // 上传新闻的图片
    async newsImgUpload(file) {
      let res = await UploadImgNews(file.raw);
      if (res.code == 200) {
        this.newsFormData.icon = res.data;
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
        this.common.go_alert(
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
        let res = await UploadImgNews(file.raw);
        if (res.code == 200) {
          this.newsFormData.Downfile = res.data;
        }
      }
    },
    // 添加或编辑数据
    saveNewsFormData() {
      // 验证表单数据
      this.$refs.newsForm.validate(async valid => {
        if (valid) {
          if (this.newsFormData.Id > 0) {
            // 编辑数据
            let res = await editNewsRow(
              this.newsFormData.Id,
              this.newsFormData
            );
            if (res.code == 200) {
              this.common.go_alert("修改成功 !");
              this.$emit("updateRowData", res.data, 0);
            }
          } else if (this.newsFormData.Id == 0) {
            // 添加数据
            let res = await addNewsRow(this.newsFormData);
            if (res.code == 200) {
              this.common.go_alert("添加成功 !");
              this.$emit("updateRowData", res.data, 1);
            }
          }
          this.tinymceShow = false;
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