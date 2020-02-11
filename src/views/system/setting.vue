<template>
  <div v-cloak class="font16 hgt_full" style="height:100%">
    <div class="flex_column hgt_full">
      <el-form label-width="80px" class="demo-ruleForm" size="small">
        <el-form-item label="后台登陆页标题">
          <el-input v-model="systemForm.name" placeholder="可以输入多个号码，用英文逗号,隔开" />
        </el-form-item>
        <el-form-item label="后台登陆页背景">
          <el-input v-model="systemForm.loginBg" type="textarea" :row="3" placeholder="短信内容，不宜太长。" />
        </el-form-item>
      </el-form>
    </div> 
    <platformRowDetail v-bind:platformInfoData="platformRowData" />
  </div>
</template>

<script> 
import platformRowDetail from "@/views/system/component/platformRowDetail";
import myDialog from "@/components/myDialog/myDialog";
// import $AppHttp from "@/service/AppAPI";
export default {
  name: "setting",
  components: {
    myDialog, 
    platformRowDetail
  },
  data() {
    return {
      // 更多操作弹窗
      systemForm: {},
      // 模态框获得的单条数据
      platformRowData: {},
      // 当前操作平台的索引
      currentPlatformIndex: null
    };
  },
  mounted() {},
  methods: {
    // 打开校区的弹出框
    openPlatformDialog(type) {
      // type=1新增，type=0编辑
      if (type) {
        this.$refs.refPlatformDialog.getPlatformRowData({ id: 0 });
      } else {
        this.$refs.refPlatformDialog.getPlatformRowData({
          ...this.platformRowData
        });
      }
    },
    // 追加数据后更新列表
    updatePlatformList(type, rowData) {
      // type=1新增，type=0编辑
      if (type) {
        this.$store.getters.platformList;
      } else {
        this.$set(this.$store.getters.app.platformList, this.currentPlatformIndex, rowData);
        // 更新展示的基本信息
        this.$refs.refPlatformDetail.getPlatformRowData({ ...rowData });
        // this.platformRowData = { ...rowData };
      }
    },
    // 获取所有平台的信息
    getAllPlatform() {
      this.$store.dispatch("app/getPlatformList").then(() => {});
    },
    // 打开更多操作的弹出框
    openMoreOperationDialog(index, row) {
      this.$refs.refPlatformDetail.getPlatformRowData(row);
      // this.platformRowData = {};
      this.currentPlatformIndex = index;
      // this.platformRowData = row;
      this.moreOperationDialog = true;
    }
  }
};
</script>
<style scoped>
</style>
