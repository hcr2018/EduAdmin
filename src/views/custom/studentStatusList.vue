
<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <!-- 查询表单 -->
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="所属站点">
            <el-select v-model="searchPlatformVal" class="wid140" placeholder="请选择所属站点">
              <el-option :value="0" label="全部"></el-option>
              <el-option
                :label="item.Label"
                :key="item.Id"
                :value="item.Id"
                v-for="(item) in common.platformList"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学员名称">
            <el-input
              class="wid150"
              v-model="searchRealnameVal"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入学员名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 列表 -->
      <div class="flex_1">
        <el-table
          :data="studentStatusList"
          border
          tooltip-effect="light"
          height="100%"
          style="width: 100%"
          ref="refElTabel"
        >
          >
          <el-table-column prop="UniversityLabel" label="高校学院" width="220" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span
                class="color-2e77f8 font-w6 cursor"
                @click="openMoreOperationDialog(scope.$index, scope.row)"
              >{{scope.row.UniversityLabel}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="UniversityMajor" label="报读专业" width="200"></el-table-column>
          <el-table-column prop="XueLiShuXing" label="学历属性" width="100"></el-table-column>
          <el-table-column prop="XueJi" label="学籍编号" width="100"></el-table-column>
          <el-table-column prop="RealName" label="姓名" width="100"></el-table-column>
          <el-table-column prop="Sex" label="性别" width="50"></el-table-column>
          <el-table-column prop="ZhunKaoZheng" label="准考证号" width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="IDCard" label="身份证号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="Telephone" label="电话" width="100"></el-table-column>
          <el-table-column prop="ShiFouTuoGuan" label="托管" width="50"></el-table-column>
          <el-table-column prop="ShijiPrice" width="95" label="实际缴费(￥)"></el-table-column>
        </el-table>
      </div>
      <div class="between-center m-v-15">
        <div>
          <el-pagination
            background
            @current-change=" currentPageChange"
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <div>
      <!-- 更多操作弹出框-->
      <my-dialog
        :visible.sync="isShowMoreOperationDialog"
        :closeShow="true"
        :title="'学籍-' + stuStautsRowData.RealName"
      >
        <div slot="left_content" class="p_both20 p-b-20">
          <stu-status-row-detail ref="refStuStatusDetail"></stu-status-row-detail>
          <div class="text-center m-t-30">
            <el-button type="primary" @click="editStuStatus">编辑</el-button>
          </div>
        </div>
        <div slot="right_content" class="p_both20 p-b-20">暂无更多操作~</div>
      </my-dialog>
      <!-- 编辑学籍弹出框 -->
      <stu-status-row-dialog ref="refStuStatusDialog" @subClick="updateStuStatusList"></stu-status-row-dialog>
    </div>
  </div>
</template>

<script>
import {  
  getStudentStatusList
} from "@/api/custom";
 
import myDialog from "@/components/myDialog/myDialog";
import stuStatusRowDetail from "@/views/custom/component/stuStatusRowDetail";
import stuStatusRowDialog from "@/views/custom/component/stuStatusRowDialog";
export default {
  name: "contractList",
  components: {
    myDialog,
    stuStatusRowDetail,
    stuStatusRowDialog
  },
  data() {
    return {
      // 根据平台查询学籍
      searchPlatformVal: 0, //0 代表全部
      // 根据姓名查询学籍
      searchRealnameVal: "",
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 20,
      //学籍列表数据
      studentStatusList: [],
      // 控制更多操作的模态框
      isShowMoreOperationDialog: false,
      // 当前的操作学籍的索引
      currentstuStautsIndex: null,
      // 当前的操作学籍的数据
      stuStautsRowData: {}
    };
  },

  methods: {
    // 条件查询学籍
    searchSubmit() {
      this.nowPage = 1;
      this.getStudentStatusList();
    },
    // 获取客户学籍列表
    async getStudentStatusList() {
      let offsetRow = (this.nowPage - 1) * this.rows;
      let res = await getStudentStatusList(
        this.searchPlatformVal,
        {
          realname: this.searchRealnameVal,
          limit: this.rows,
          offset: offsetRow
        }
      );
      if (res.code == 200) {
        this.studentStatusList = res.data ? res.data : [];
        this.allRows = res.title;
      }
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getStudentStatusList();
    },
    // 格式化显示日期
    TimeFormatter(row, column) {
      return this.common.dateFormat(row[column.property]);
    },
    // 打开更多操作的模态框
    async openMoreOperationDialog(index, row) {
      this.currentstuStautsIndex = index;
      this.stuStautsRowData = row;
      this.isShowMoreOperationDialog = true;
      this.$refs.refStuStatusDetail.getStuStatusRowData(row);
    },
    // 编辑学籍数据
    editStuStatus(index, row) {
      this.$refs.refStuStatusDialog.getStuStatusFormData(
        this.stuStautsRowData,
        0
      );
    },
    // 添加或者编辑成功后更新学籍数据列表
    updateStuStatusList(type, rowData) {
      if (type == 1) {
        this.studentStatusList.unshift(rowData);
      } else if (type == 0) {
        this.stuStautsRowData={...rowData}
        this.$set(this.studentStatusList, this.currentstuStautsIndex, rowData);
        this.$refs.refStuStatusDetail.getStuStatusRowData(rowData);
      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.$refs.refElTabel.doLayout();
    }, 2000);
    this.getStudentStatusList();
  }
};
</script> 
<style scoped>
</style> 