<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <div class="flex_1 m-t-20 overflow_auto my_scrollbar p-r-20 p-l-20 p-v-15">
        <div class="m-b-20" v-for="(item,index) in dataList" :key="index">
          <div class="cardBorder bg-ccc">
            <el-upload
              :auto-upload="false"
              action
              class="wid_100 flex_dom bg-ddd"
              :show-file-list="false"
              :on-change="function(file, fileList){return uploadBannerImg(file,fileList,index)}"
            >
              <img v-if="item.image" :src="item.image" style="width:auto; height: 160px" />
              <i
                v-else
                slot="default"
                class="el-icon-plus flex_1"
                style="width: 100%; height: 160px"
              >&nbsp;点击上传</i>
            </el-upload>
            <el-form :inline="true" :model="item" class="demo-form-inline m-t-10">
              <el-form-item label="标题">
                <el-input v-model="item.label" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="跳转地址：">
                <el-input v-model="item.href" placeholder="请输入连接地址"></el-input>
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
  name: "webBanner",
  data() {
    return {
      // banner列表
      dataList: [],
      currentPlatform: 0
    };
  },

  methods: {
    async GetIndexBanner() {
      let res = await GetIndexItem(this.currentPlatform + "/banner", "");
      if (res.code == 200) {
        this.dataList = res.data ? res.data : [];
      }
    },
    // 图片上传
    async uploadBannerImg(file, fileList, index) {
      let res = await $ImgHttp.UploadImg("banner", file.raw);
      if (res.code == 200) {
        this.dataList[index].image = res.data;
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
        this.currentPlatform + "/banner",
        "",
        this.dataList
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
      this.dataList.unshift({});
    },
    // 删除banner
    async deleBannerItem(index) {
      this.$confirm("这里删除后还需要点击保存按钮，确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        this.dataList.splice(index, 1);
        this.$message({
          message: "删除成功,请最后点击保存按钮",
          type: "success"
        });
      });
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
  right: 5px;
  top: 5px;
}
.cardBorder {
  -webkit-box-shadow: 0 1px 5px 0 #dedede;
  box-shadow: 0 1px 5px 0 #dedede;
  padding: 20px 30px 0px 20px;
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
}
.cardBorder >>> .el-upload {
  width: 100%;
}
.el-icon-plus {
  border: 1px dashed #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  position: relative;

  overflow: hidden;
}
</style>
