<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <div class="flex_1">
        <el-table
          height="100%"
          :data="$store.getters.app.platformList"
          tooltip-effect="light"
          border
          style="width: 100%"
          ref="refElTabel"
        >
          <el-table-column prop="Id" label="ID" width="50"></el-table-column>
          <el-table-column prop="Label" label="站点名称" width="110">
            <template slot-scope="scope">
              <span
                class="color-2e77f8 font-w6 cursor"
                @click="openMoreOperationDialog(scope.$index, scope.row)"
              >{{scope.row.Label}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="MasterLabel" label="负责人" width="120"></el-table-column>
          <el-table-column prop="Telephone" label="联系电话" width="100"></el-table-column>
          <el-table-column prop="Address" label="地址" :show-overflow-tooltip="true" width="200"></el-table-column>
          <el-table-column prop="Description" label="备注" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </div>
      <div class="between-center m-v-15">
        <el-button type="primary" @click="openPlatformDialog(1)">新增站点</el-button>
      </div>
    </div>
    <!-- 弹出框 -->
    <div>
      <!-- 更多操作弹窗 -->
      <my-dialog
        :visible.sync="moreOperationDialog"
        :closeShow="true"
        :title="platformRowData.Label"
      >
        <!-- 展示站点的基本信息 -->
        <div slot="left_content" class="p_both20 p-b-20">
          <platform-row-detail ref="refPlatformDetail"></platform-row-detail>
          <div class="text-center m-t-30">
            <el-button type="primary" @click="openPlatformDialog(0)">编辑</el-button>
          </div>
        </div>
        <div slot="right_content" class="p_both20 p-b-20">暂无其他操作~</div>
      </my-dialog>
      <!-- 站点信息弹出框 -->
      <platform-row-dialog ref="refPlatformDialog" @subClickEvent="updatePlatformList"></platform-row-dialog>
    </div>
  </div>
</template>

<script>
import platformRowDialog from "@/views/system/component/platformRowDialog";
import platformRowDetail from "@/views/system/component/platformRowDetail";
import myDialog from "@/components/myDialog/myDialog";
// import $AppHttp from "@/service/AppAPI";
export default {
  name: "platform",
  components: {
    myDialog,
    platformRowDialog,
    platformRowDetail
  },
  data() {
    return {
      // 更多操作弹窗
      moreOperationDialog: false,
      // 模态框获得的单条数据
      platformRowData: {},
      // 当前操作平台的索引
      currentPlatformIndex: null
    };
  },
  methods: {
    // 打开站点的弹出框
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
    //追加数据后更新列表
    updatePlatformList(type, rowData) {
      // type=1新增，type=0编辑
      if (type) {
        this.$store.getters.platformList;
      } else {
        this.$set(this.common.platformList, this.currentPlatformIndex, rowData);
        // 更新展示的基本信息
        this.$refs.refPlatformDetail.getPlatformRowData({ ...rowData });
        this.platformRowData = { ...rowData };
      }
    },
    // 获取誉财所有平台的信息
    getAllPlatform() {
      this.$store.dispatch("app/getPlatformList").then(() => {
        this.$refs.refElTabel.doLayout();
      });
    },
    // 打开更多操作的弹出框
    openMoreOperationDialog(index, row) {
      this.$refs.refPlatformDetail.getPlatformRowData({ ...row });
      this.platformRowData = {};
      this.currentPlatformIndex = index;
      this.platformRowData = { ...row };
      this.moreOperationDialog = true;
    }
  },
  mounted() {
    this.getAllPlatform();
  
  }
};
</script>
<style scoped>
</style>