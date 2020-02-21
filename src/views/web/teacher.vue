<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <div class="flex_1 m-t-20 overflow_auto my_scrollbar p-r-10 p-l-20 p-v-15">
        <div class="m-b-10" v-for="(item,index) in bannerList" :key="index">
          <div class="flex_mid cardBorder">
            <el-upload
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return uploadBannerImg(file,fileList,index)}"
            >
              <img v-if="item.image" :src="item.image" style="width: 160px; height: 160px" />
              <i
                v-else
                slot="default"
                class="el-icon-plus"
                style="width: 160px; height: 160px"
              >&nbsp;点击上传</i>
            </el-upload>

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
            </el-form>

            <div class="dele_banner" @click="deleBannerItem(index)">
              <i class="el-icon-error font24 color-999"></i>
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
      bannerList: [],
      currentPlatform: 0
    };
  },

  methods: {
    async GetIndexBanner() {
      let res = await GetIndexItem(this.currentPlatform + "/teacher", "");
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
        this.$forceUpdate();
      }
    },
    // 保存banner列表
    async saveBannerList() {
      let res = await SetIndexItem(
        this.currentPlatform + "/teacher",
        "",
        this.bannerList
      );
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
      let res = await SetIndexItem(
        this.currentPlatform + "/teacher",
        "",
        newBannerList
      );
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
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = paths[paths.length - 1];
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
    }
    this.GetIndexBanner();
  }
};
</script>
<style scoped>
.dele_banner {
  position: absolute;
  right: 15px;
  top: 5px;
}
.cardBorder {
  -webkit-box-shadow: 0 1px 5px 0 #dedede;
  box-shadow: 0 1px 5px 0 #dedede;
  padding: 20px 70px 20px 20px;
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
}
.el-upload {
  border: 1px dashed #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
