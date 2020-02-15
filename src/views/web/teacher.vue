<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <div class="flex_1 m-t-20 overflow_auto p-r-30 border-dfe6ec p-l-20 p-v-15">
        <div class="m-b-10" v-for="(item,index) in bannerList" :key="index">
          <div class="flex_mid">
            <el-image style="width: 160px; height: 160px" fit="cover" :src="item.image"></el-image>
            <div>
              <el-form label-width="90px" :model="item">
                <div class="flex_mid">
                  <el-form-item label="姓名">
                    <el-input v-model="item.label" placeholder="老师姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="跳转地址：" class="m-l-20">
                    <el-input v-model="item.href" placeholder="请输入连接地址"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="简介">
                  <el-input type="textarea" v-model="item.title" placeholder="老师姓名"></el-input>
                </el-form-item>
                <div class="flex_mid">
                  <el-form-item>
                    <el-upload
                      :auto-upload="false"
                      action
                      :show-file-list="false"
                      :on-change="function(file, fileList){return uploadBannerImg(file,fileList,index)}"
                    >
                      <el-button type="success">上传图片</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label-width="30px">
                    <el-button type="danger" @click="deleBannerItem(index)">删 除</el-button>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div class="m-v-15">
        <el-button type="primary" @click="addBannerItem">新 增</el-button>
        <el-button type="success" @click="saveBannerList">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { GetIndexItem, SetIndexItem } from "@/api/website";
import $ImgHttp from "@/api/ImgAPI";
export default {
  name: "webTeacher",
  data() {
    return {
      // banner列表
      bannerList: []
    };
  },

  methods: {
    async GetIndexBanner() {
      let res = await GetIndexItem("banner", "");
      if (res.code == 200) {
        this.bannerList = res.data ? res.data : [];
      }
    },
    // 图片上传
    async uploadBannerImg(file, fileList, index) {
      let res = await $ImgHttp.UploadImg("teacher", file.raw);
      if (res.code == 200) {
        this.bannerList[index].image = res.data;
        this.$message({
          message: "上传成功",
          type: "success"
        });
      }
    },
    // 保存banner列表
    async saveBannerList() {
      let res = await SetIndexItem("teacher", "", this.bannerList);
      if (res.code == 200) {
        this.$message({
          message: "保存成功",
          type: "success"
        });
      }
    },
    // 添加banner
    addBannerItem() {
      this.bannerList.unshift({});
    },
    // 删除banner
    async deleBannerItem(index) {
      let newBannerList = [...this.bannerList];
      newBannerList.splice(index, 1);
      let res = await SetIndexItem("teacher", "", newBannerList);
      if (res.code == 200) {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.bannerList.splice(index, 1);
      }
    }
  },
  mounted() {
    this.GetIndexBanner();
  }
};
</script>
<style scoped>
</style>
