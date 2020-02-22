<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <!-- 学院列表 -->

      <el-table
        height="100%"
        :data="$store.getters.app.collegeWithCourseKind"
        tooltip-effect="light"
        border
        style="width: 100%"
        ref="refElTabel"
      >
        <el-table-column width="80" label="学院logo">
          <template slot-scope="scope">
            <img :src="scope.row.face" class="wid28" />
          </template>
        </el-table-column>
        <el-table-column prop="Id" label="ID" width="50"></el-table-column>
        <el-table-column label="学院名称" width="120">
          <template slot-scope="scope">
            <span
              class="color-1890ff font-w6 cursor"
              @click="openMoreOperationDialog(scope.$index, scope.row)"
            >{{scope.row.Label}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Descritpion" label="备注" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <!-- 用户操作 -->
      <div class="between-center m-v-15">
        <el-button type="primary" @click="addCollege()">新增学院</el-button>
        <!-- <div>
          <el-pagination
            background
            @current-change=" getDataChangePage"
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
          ></el-pagination>
        </div>-->
      </div>
    </div>

    <!-- 老师信息的弹出框 -->

    <!-- 更多操作弹窗 -->
    <my-dialog :visible.sync="moreOperationDialog" :close-show="true" :title="currentRowData.Label">
      <!-- 展示校区的基本信息 -->
      <div slot="left_content">
        <collegeRowDetail :formItemData="currentRowData" />
      </div>
      <div slot="right_content" class="p_both20 p-b-20">
        <el-tabs v-model="activElTab">
          <el-tab-pane label="所含课程大类" name="qxsz" id="qxsz">
            <courseKind :collegePropItem="currentRowData" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </my-dialog>

    <!-- 新增校区信息弹出框 -->
    <el-dialog
      :visible.sync="editDialog"
      width="500px"
      :title="currentRowData.Id>0?'编辑'+currentRowData.Label:'新增学院'"
    >
      <collegeRowDetail :editEnable="true" :formItemData="currentRowData" />
    </el-dialog>
  </div>
</template>

<script>
import common from "@/utils/common";

import myDialog from "@/components/myDialog/myDialog";
import collegeRowDetail from "@/views/course/component/collegeRowDetail";
import courseKind from "@/views/course/component/courseKind";
export default {
  name: "managerList",
  components: {
    myDialog,
    collegeRowDetail,
    courseKind
  },
  data() {
    return {
      common,
      // 搜索用户条件选择的选项
      collegeList: [
        {
          Id: 7,
          Label: "姓名"
        },
        {
          Id: 8,
          Label: "昵称"
        },

        {
          Id: 9,
          Label: "电话"
        }
      ],
      // 搜索的输入值，内容，类型，角色
      currentCollege: 8,
      searchConditionVal: "",
      searchRoleVal: "",
      // 存放用户列表数据
      teacherList: [],
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页获取数据的总条数
      rows: 30,
      // 模态框获得的单条数据
      currentRowData: {},
      // 当前选中行的数据索引
      currentTeacherIndex: null,
      // 点开弹出默认显示老师信息
      activElTab: "qxsz",
      editDialog: false,
      // 更多操作弹框展示
      moreOperationDialog: false,
      // 当前用户所有的权限数据
      managerRightsMap: {},
      //当前所在校区
      currentPlatform: 0
    };
  },
  methods: {
    addCollege() {
      this.editDialog = true;
      this.currentRowData = {};
    },
    // 打开更多操作的弹出框
    openMoreOperationDialog(index, row) {
      this.currentTeacherIndex = index;
      this.currentRowData = row;

      if (this.currentRowData.Platform) {
        this.currentRowData.platformSelect = [];
        this.currentRowData.platformSelect = this.currentRowData.Platform.split(
          ","
        ).map(Number);
      }

      this.moreOperationDialog = true;
    }
  },
  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = paths[paths.length - 1];
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
    }
  }
};
</script>
<style  scope>
</style>