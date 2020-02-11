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
                class="color-1890ff font-w6 cursor"
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
        <el-button type="primary" @click="openNewItem( )">新增校区</el-button>
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
          <platformRowDetail v-bind:formItemData="platformRowData" />
        </div>
        <div slot="right_content" class="p_both20 p-b-20">
          <el-tabs v-model="activElTab" @tab-click="changDialogTab">
            <el-tab-pane id="gjjl" label="跟进记录" name="gjjl">
              <custom-track :custom-data="customFormData" @subClickEvent="updateCustomRecentTrack" />
            </el-tab-pane>
            <el-tab-pane id="gmjl" label="购买记录" name="gmjl">
              <custom-buy-record :customData="customFormData" />
            </el-tab-pane>
            <el-tab-pane id="htdd" label="合同订单" name="htdd">
              <custom-contract-list :customData="customFormData" />
            </el-tab-pane>
            <el-tab-pane id="cjlr" label="成绩录入" name="cjlr">
              <scoreEntry :customData="customFormData" />
            </el-tab-pane>
            <el-tab-pane id="dazl" label="档案资料" name="dazl">
              <scoreEntry :customData="customFormData" />
            </el-tab-pane>
          </el-tabs>~
        </div>
      </my-dialog>

      <!-- 新增校区信息弹出框 -->
      <el-dialog
        :visible.sync="editDialog"
        width="500px"
        :title="platformRowData.Id>0?'编辑'+platformRowData.Label:'新增校区'"
      >
        <platformRowDetail :editEnable="true" :formItemData="platformRowData" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import platformRowDetail from "@/views/system/component/platformRowDetail";
import myDialog from "@/components/myDialog/myDialog";
export default {
  name: "setPlatform",
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
    openNewItem() {
      this.editDialog = true;
      this.platformRowData = {};
    },

    // 获取所有平台的信息
    getAllPlatform() {
      this.$store.dispatch("app/getPlatformList").then(() => {});
    },
    // 打开更多操作的弹出框
    openMoreOperationDialog(index, row) {
      this.currentPlatformIndex = index;
      this.platformRowData = row;
      this.moreOperationDialog = true;
    }
  }
};
</script>
<style scoped>
</style>
