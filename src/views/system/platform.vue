<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <div class="flex_1">
        <el-table
          ref="refElTabel"
          height="100%"
          :data="$store.getters.app.platformList"
          tooltip-effect="light"
          border
          style="width: 100%"
        >
          <el-table-column prop="Id" label="ID" width="50" />
          <el-table-column prop="Label" label="校区名称" width="110">
            <template slot-scope="scope">
              <span
                class="color-2e77f8 font-w6 cursor"
                @click="openMoreOperationDialog(scope.$index, scope.row)"
              >{{ scope.row.Label }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="MasterLabel" label="负责人" width="120" />
          <el-table-column prop="Telephone" label="联系电话" width="100" />
          <el-table-column prop="Address" label="地址" :show-overflow-tooltip="true" width="200" />
          <el-table-column prop="Description" label="备注" :show-overflow-tooltip="true" />

           
        </el-table>
      </div>
      <div class="between-center m-v-15">
        <el-button type="primary" @click="openPlatformDialog(null)">新增校区</el-button>
      </div>
    </div>
    <!-- 弹出框 -->
    <div>
      <!-- 更多操作弹窗 -->
      <my-dialog
        :visible.sync="moreOperationDialog"
        :close-show="true"
        :title="platformRowData.Label"
      >
        <!-- 展示校区的基本信息 -->
        <div slot="left_content">
          <platformRowDetail :editEnable="false" v-bind:platformInfoData="platformRowData" />
        </div>
        <div slot="right_content" class="p_both20 p-b-20">暂无其他操作~</div>
      </my-dialog>


      <!-- 新增校区信息弹出框 -->
      <el-dialog
        :visible.sync="editDialog"
        width="500px"
        :title="platformRowData.Id>0?'编辑'+platformRowData.Label:'新增校区'"
      >
        <platformRowDetail
          ref="refPlatForm"
          :editEnable.sync="editDialog"
          :platformInfoData="platformRowData"
          @subClickEvent="updatePlatformList"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import platformRowDetail from "@/views/system/component/platformRowDetail";
import myDialog from "@/components/myDialog/myDialog";
export default {
  name: "Platform",
  components: {
    myDialog,
    platformRowDetail
  },
  data() {
    return {
      // 更多操作弹窗
      moreOperationDialog: false,
      // 更多操作弹窗
      editDialog: false,
      // 模态框获得的单条数据
      platformRowData: {},
      // 当前操作平台的索引
      currentPlatformIndex: null
    };
  },
  mounted() {
    this.getAllPlatform();
  },
  methods: {
    // 打开校区的弹出框
    openPlatformDialog(currentdata) {
      if (currentdata == null) {
        this.editDialog = true;
        this.platformRowData = {};
      } else {
        this.editDialog = false;
        this.platformRowData = currentdata;
      }
      this.editDialog = true;
    },
    // 追加数据后更新列表
    updatePlatformList(type, rowData) {
      // type=0新增，type=1编辑
        console.log(type,rowData)
        
      if (type===1) {

  this.$set(this.common.platformList, this.currentPlatformIndex, rowData);

        this.$store.getters.platformList;
      } else {
        // 更新展示的基本信息
         this.common.platformList.unshift(rowData);
        // this.$refs.refPlatformDetail.getPlatformRowData({ ...rowData });
        this.platformRowData = { ...rowData };
      }
    },
    // 获取所有平台的信息
    getAllPlatform() {
      this.$store.dispatch("app/getPlatformList").then(() => {});
    },
    // 打开更多操作的弹出框
    openMoreOperationDialog(index, row) {
      this.currentPlatformIndex = index;
      this.platformRowData = { ...row };
      this.moreOperationDialog = true;
    }
  }
};
</script>
<style scoped>
</style>
