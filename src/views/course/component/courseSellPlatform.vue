<template>
  <div>
    <div class="marg20  ">
    <span   >打钩了的校区被禁止售卖这门课程。</span>
    <hr/>
    </div>
    <div class="flex_wrap flex_mid p-b-5 border-b-e0">
      <div
        v-for="item in $store.getters.app.platformList"
        :key="item.Id"
        class="quan_xian_item m-b-10"
      >
        <el-checkbox
          @change="checked=>changeRight(checked,item)"
          v-model="item.Selected"
        >{{item.Label}}</el-checkbox>
      </div>
    </div>
      <div class="around-center m-v-15">
      <el-button type="primary" @click="saveRight">保 存</el-button>
    </div>
  </div>
</template>
<script>
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import { addCourse, editCourse } from "@/api/course";
import common from "@/utils/common";
export default {
  components: {
    myImageViewer
  },
  data() {
    return {
      common,
      // 课程的表单数据
      courseRow: {},
      // 是否显示模态框
      isShowCourseDialog: false,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 学院默认选中第一项
      collegeIndex: 0
      //
    };
  },

  methods: {
    // 打开模态框时获取所有的权限选择
    async getAllManagerPower(index) {
      this.managerRightsMap = [];
      let res = await getManagerRight(this.currentFormData.Id);
      if (res.code == 200) {
        this.managerRightsMap = res.data ? res.data : [];
      }
    },
    changeRight(checked, itemObj) {
      let item = { index: itemObj.Value };
      if (checked) {
        item.Selected = 1;
      } else {
        item.Selected = -1;
      }
      this.currentManagerRights[itemObj.Value] = item;
    },
    //保存用户的权限设置
    async saveRight() {
      let res = await setManagerRight(
        this.currentFormData.Id,
        "",
        this.currentManagerRights
      );
      if (res.code == 200) {
        this.$message("设置成功!");
        this.$emit("subClickEvent", 0, res.data);
      }
    }
  }
};
</script>
<style scoped>
.el-tag {
  margin-right: 10px;
  margin-bottom: 5px;
}
.addSubject > p {
  margin-right: 10px;
}
.quan_xian_item {
  width: calc(100% / 2);
}
</style>