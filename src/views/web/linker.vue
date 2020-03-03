<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <div class="flex_1 m-t-20 overflow_auto my_scrollbar">
        <div class="m-b-10" v-for="(item,index) in dataList" :key="index">
          <div class="flex_mid cardBorder bg-ccc">
            <el-form label-width="90px" :model="item" style="width:100%">
              <div class="flex_dom">
                <el-form-item label="网站名称" style="width:400px">
                  <el-input v-model="item.label" placeholder="填写友情链接名"></el-input>
                </el-form-item>
                <el-form-item label="网站地址" class="m-l-20" style="width:500px">
                  <el-input v-model="item.href" placeholder="友情链接的网址"></el-input>
                </el-form-item>
                <el-form-item label="备注" style="width:100%">
                  <el-input v-model="item.title" placeholder="说明"></el-input>
                </el-form-item>
              </div>
            </el-form>

            <div class="dele_banner" @click="deleBannerItem(index)">
              <i class="el-icon-error font24 color-999"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="m-v-15">
        <el-button type="primary" @click="addBannerItem">添加友情链接</el-button>
        <el-button type="success" @click="saveBannerList">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { GetIndexItem, SetIndexItem } from "@/api/website";

export default {
  name: "linker",
  data() {
    return {
      // 列表
      dataList: [],
      currentPlatform: 0
    };
  },

  methods: {
    async GetIndexBanner() {
      let res = await GetIndexItem(this.currentPlatform + "/linker", "");
      if (res.code == 200) {
        this.dataList = res.data ? res.data : [];
      }
    },
    // 保存banner列表
    async saveBannerList() {
      let res = await SetIndexItem(
        this.currentPlatform + "/linker",
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
.el-upload {
  border: 1px dashed #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
