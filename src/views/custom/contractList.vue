<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <!-- 查询表单 -->
      <div>
        <el-form :inline="true">
          <div class="between-center">
            <div class="flex_1">
              <!-- <el-form-item label="所属校区">
                <el-select v-model="currentPlatform" class="wid140" placeholder="请选择所属校区">
                  <el-option label="全部" :value="0" />
                  <el-option
                    v-for="(item) in $store.getters.app.platformList"
                    :key="item.Id"
                    :label="item.Label"
                    :value="item.Id"
                  />
                </el-select>
              </el-form-item>-->
              <el-form-item label="签订日期">
                <el-date-picker
                  v-model="searchDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="common.datePickerOptions"
                  style="width:220px"
                />
              </el-form-item>
              <el-form-item label="招生老师">
                <el-input
                  v-model="platformworklabel"
                  placeholder="招生老师名字"
                  class="wid150"
                  @input="$forceUpdate()"
                  @keyup.enter.native="searchSubmit"
                />
              </el-form-item>
              <el-form-item label="内容">
                <el-input
                  v-model="searchNameOrTel"
                  placeholder="请输入客户姓名或电话"
                  class="wid160"
                  @input="$forceUpdate()"
                  @keyup.enter.native="searchSubmit"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchSubmit">查询</el-button>
              </el-form-item>
            </div>
            <el-form-item>
              <div class="m-t--9">
                <el-button type="primary" @click="downloadExcelConstrct()">导出Excel</el-button>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <!-- 列表 -->
      <div class="flex_1">
        <el-table
          id="contract_table"
          ref="refElTabel"
          :data="contractList"
          border
          tooltip-effect="light"
          style="width: 100%"
          height="100%"
          @selection-change="contractSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column prop="StudentID" width="70" label="学员编号" />
          <el-table-column prop="AddTime" width="130" :formatter="TimeFormatter" label="报名时间" />
          <el-table-column label="合同名称" width="210" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span
                class="color-1890ff font-w6 cursor"
                @click="editContract(scope.$index, scope.row)"
              >{{ scope.row.Title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="PlatformLabel" width="110" label="归属校区" />
          <el-table-column prop="StudentLabel" width="120" label="客户姓名" fixed />
          <el-table-column prop="Telephone" width="120" label="客户电话" />

          <el-table-column
            prop="CourseLabel"
            width="220"
            label="报名课程"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="CoursePrice" width="70" label="课程价格" />
          <el-table-column prop="ShijiPrice" width="70" label="实收学费" />
          <el-table-column prop="QiankuanPrice" width="70" label="欠款金额" />
          <el-table-column prop="PayMethod" width="100" label="付款方式" />
          <el-table-column prop="Comments" label="备注" width="200" :show-overflow-tooltip="true" />
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" @click="deleteContractRecord(scope.row.Id,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="between-center m-v-10">
        <div>
          <el-pagination
            background
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
            @current-change=" currentPageChange"
          />
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <div>
      <custom-contract-dialog ref="refContractDialog" @updateContractData="updateContractList" />
    </div>
  </div>
</template>

<script>
import {
  getContractList,
  getCustomContract,
  addCustomContract,
  deleCustomContract,
  updateCustomContract
} from "@/api/contract";
import customContractDialog from "@/views/custom/component/customContractDialog";
import myDialog from "@/components/myDialog/myDialog";
import common from "@/utils/common";
export default {
  name: "contractList",
  components: {
    customContractDialog
  },
  data() {
    return {
      common,
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 40,
      // 查询内容-客户姓名或电话
      searchNameOrTel: "",
      // 查询内容-签订日期
      searchDate: null,
      // 查询内容-平台
      currentPlatform: 0, // 0 代表全部
      // 控制合同订单模态框
      contractFormDialog: false,
      // 合同表单需要的客户信息
      contractFormData: {},
      // 客户合同信息列表
      contractList: [],
      // 对客户合同的操作，1-立即报名，2-续报课程，0-查看详情
      contractOperationType: 1,
      // 当前操作的合同index
      currentContractIndex: null,
      platformworklabel: "", // 招生老师名字,
      // 客户的姓名
      customName: "",
      // 保存选中的合同列表
      mulSelectContract: ""
    };
  },

  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = paths[paths.length - 1];
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
    }
    this.getContractList();
  },

  methods: {
    // 选项改变
    contractSelectionChange(val) {
      // 操作多选
      this.mulSelectContract = "";
      this.mulSelectContract = JSON.stringify(val); // 多选的行会存入multipleSelection数组中
    },
    // 导出数据
    downloadExcelConstrct() {
      // 判断是否有选中项，有选中则导出选中，没有则后台导出全部
      if (this.mulSelectContract) {
        const datas = JSON.parse(this.mulSelectContract);
        datas.forEach(item => {
          item.AddTime = this.common.dateFormat(item.AddTime, 2);
        });
        const fieldTitle = [
          "学员编号",
          "报名时间",
          "合同名称",
          "归属校区",
          "客户姓名",
          "客户电话",
          "报名课程",
          "课程价格",
          "实收学费",
          "欠款金额",
          "付款方式",
          "备注"
        ];
        const fieldName = [
          "StudentID",
          "AddTime",
          "Title",
          "PlatformLabel",
          "StudentLabel",
          "Telephone",
          "CourseLabel",
          "CoursePrice",
          "ShijiPrice",
          "QiankuanPrice",
          "PayMethod",
          "Comments"
        ];
        this.common.downloadExcel(datas, fieldTitle, fieldName);
      } else {
        let startDate;
        let endDate;
        if (this.searchDate && this.searchDate.length == 2) {
          startDate = parseInt(this.searchDate[0] / 1000);
          endDate = parseInt(this.searchDate[1] / 1000 + 3600 * 24 - 1);
        }
        const params =
          "platformworklabel=" +
          this.platformworklabel +
          "&download=true&token=" +
          sessionStorage.token +
          "&start=" +
          startDate +
          "&end" +
          endDate;
        window.open(
          "/api/contract/getContractList/" +
            this.currentPlatform +
            "?" +
            params,
          "_blank"
        );
      }
    },
    // 格式化内容
    TimeFormatter(row, column) {
      return this.common.dateFormat(row[column.property], 2);
    },
    // 条件搜索
    searchSubmit() {
      this.nowPage = 1;
      this.getContractList();
    },
    // 强制刷新
    change(e) {
      this.$forceUpdate();
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getContractList();
    },
    // 获取合同信息列表
    async getContractList() {
      let startDate;
      let endDate;
      if (this.searchDate && this.searchDate.length == 2) {
        startDate = parseInt(this.searchDate[0] / 1000);
        endDate = parseInt(this.searchDate[1] / 1000 + 3600 * 24 - 1);
      }
      const res = await getContractList(this.currentPlatform, {
        querycontent: this.searchNameOrTel,
        start: startDate,
        end: endDate,
        platformworklabel: this.platformworklabel,
        offset: (this.nowPage - 1) * this.rows,
        limit: this.rows
      });
      if (res.code == 200) {
        this.contractList = res.data ? res.data : [];
        this.allRows = res.title;
      }
    },
    // 编辑合同表单的详情信息
    editContract(index, row) {
      this.currentContractIndex = index;
      this.$refs.refContractDialog.getContractFormData(row, 0);
    },
    // 追加合同之后更新合同列表数据
    updateContractList(type, rowData) {
      // type=0编辑，type=1添加
      if (type == 0) {
        this.contractList.splice(this.currentContractIndex, 1, rowData);
      }
    },
    // 删除合同
    deleteContractRecord(id, index) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await deleCustomContract(id);
          if (res.code == 200) {
            this.$message("删除成功!");
            this.contractList.splice(index, 1);
          }
        })
        .catch(() => {
          return false;
        });
    },

    // 导出Excel表格事件
    exportContract() {
      this.common.exportExcel("#contract_table", "合同列表");
    }
  }
};
</script>
<style scoped>
.boxShadow1 {
  box-shadow: 0px 2px 2px 0px rgba(4, 0, 0, 0.3);
}
.boxShadow2 {
  box-shadow: 0px 2px 13px 0px rgba(81, 109, 158, 0.1);
}
</style>
