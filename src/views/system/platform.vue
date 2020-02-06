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
        <div slot="left_content"  >
          <platformRowDetail :editEnable="false"  v-bind:platformInfoData="platformRowData" />
        </div>
        <div slot="right_content" class="p_both20 p-b-20">暂无其他操作~</div>
      </my-dialog>
      <!-- 校区信息弹出框 -->
      <el-dialog
        :visible.sync="editDialog"
        width="740px" 
        :title="platformRowData.Id>0?'编辑'+platformRowData.Label:'新增校区'"
      >
        <div class="around-center hgt60 bge0e3ea">
          <platformRowDetail  :platformInfoData="platformRowData" /> 
          <div>
            <el-button @click="isShowPlatformDialog=false">取 消</el-button>
            <el-button type="primary" class="m-l-40" @click="saveplatformInfoData">确 认</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- <platform-row-dialog v-bind:visible="editDialog"  v-bind:platformInfoData="platformRowData"  @subClickEvent="updatePlatformList" /> -->
    </div>
  </div>
</template>

<script>
// import platformRowDialog from "@/views/system/component/platformRowDialog";
import platformRowDetail from "@/views/system/component/platformRowDetail";
import myDialog from "@/components/myDialog/myDialog";
// import $AppHttp from "@/service/AppAPI";
export default {
  name: "Platform",
  components: {
    myDialog,
    // platformRowDialog,
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
    openPlatformDialog(hasIn) {
      if (hasIn == null) {
      } else {
      }
      this.editDialog = true;
    },
    // 追加数据后更新列表
    updatePlatformList(type, rowData) {
      // type=1新增，type=0编辑
      if (type) {
        this.$store.getters.platformList;
      } else {
        // 更新展示的基本信息
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
    },
     // 保存客户信息
    saveplatformInfoData() {
      this.$refs.refPlatForm.validate(async valid => {
        if (valid) {
          this.platformInfoData.MasterID = this.masterID;
          if (
            this.platformInfoData.Id == null ||
            this.platformInfoData.Id == 0
          ) {
            // 新增
            let res = await  addPlatform(this.platformInfoData);
            if (res.code == 200) {
              // 添加成功之后要触发父组件信息列表修改
              this.$emit("subClickEvent", 1, res.data);
              this.common.go_alert("添加成功 !");
              this.isShowPlatformDialog = false;
            }
          } else {
            // 修改
            let res = await  updatePlatform(
              this.platformInfoData.Id,
              this.platformInfoData
            );
            if (res.code == 200) {
              this.platformInfoData = res.data;
              // 修改成功之后要触发父组件信息列表修改
              this.$emit("subClickEvent", 0, res.data);
              this.common.go_alert("修改成功");
              this.isShowPlatformDialog = false;
            }
          }
        } else {
          return false;
        }
      });
    },
  }
};
</script>
<style scoped>
</style>
