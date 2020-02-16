<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <!-- 查询表单 -->
      <div class="p-t-20">
        <el-form :inline="true">
          <el-form-item label="身份类型">
            <el-select v-model="searchRoleVal" class="wid140" placeholder="请选择身份类型">
              <el-option
                :label="item.Label"
                :key="index"
                :value="item.value"
                v-for="(item,index) in common.managerRoleList"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="请输入搜索内容"
              v-model="searchVal"
              @keyup.enter.native="getAllManagerOfPlatform"
              class="input-with-select"
            >
              <el-select
                v-model="searchConditionVal"
                slot="prepend"
                placeholder="请选择查询条件"
                class="wid90"
              >
                <el-option
                  :label="item.Label"
                  :key="index"
                  :value="item.value"
                  v-for="(item,index) in searchConditionOptions"
                ></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAllManagerOfPlatform">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 用户列表 -->
      <div class="flex_1">
        <el-table
          height="100%"
          :data="teacherList"
          tooltip-effect="light"
          border
          style="width: 100%"
          ref="refElTabel"
        >
          <el-table-column width="80" label="头像">
            <template slot-scope="scope">
              <img :src="scope.row.face" class="wid28" />
            </template>
          </el-table-column>
          <el-table-column prop="Id" label="ID" width="50"></el-table-column>
          <el-table-column label="姓名" width="120">
            <template slot-scope="scope">
              <span
                class="color-1890ff font-w6 cursor"
                @click="openMoreOperationDialog(scope.$index, scope.row)"
              >{{scope.row.Realname}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="身份" width="80">
            <template slot-scope="scope">
              <span>{{common.FormatSelect(common.managerRoleList,scope.row.role)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Sex" width="50" label="性别"></el-table-column>
          <el-table-column prop="tel" label="电话号码" width="100"></el-table-column>
          <el-table-column prop="info" label="个人描述" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="danger" @click="resetPassword(scope.$index, scope.row)">重置密码</el-button>
              <el-button
                v-show="scope.row.Status==1"
                type="info"
                @click="setTeacherStatus(scope.$index, scope.row,0)"
              >禁用</el-button>
              <el-button
                v-show="scope.row.Status==0"
                type="success"
                @click="setTeacherStatus(scope.$index, scope.row,1)"
              >启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 用户操作 -->
      <div class="between-center m-v-15">
        <el-button type="primary" @click="openNewItem()">新增用户</el-button>
        <div>
          <el-pagination
            background
            @current-change=" getDataChangePage"
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 老师信息的弹出框 -->

    <!-- 更多操作弹窗 -->
    <my-dialog
      :visible.sync="moreOperationDialog"
      :close-show="true"
      :title="currentRowData.Realname"
    >
      <!-- 展示校区的基本信息 -->
      <div slot="left_content">
        <teacher-row-detail v-bind:formItemData="currentRowData" />
      </div>
      <div slot="right_content" class="p_both20 p-b-20">
        <el-tabs v-model="activElTab" @tab-click="changDialogTab">
          <el-tab-pane label="权限设置" name="qxsz" id="qxsz">
            <set-right :formItemData="currentRowData"></set-right>
          </el-tab-pane>
          <el-tab-pane label="所教科目" name="sjkm" id="sjkm">
            <teacherBook :formItemData="currentRowData"></teacherBook>
          </el-tab-pane>
        </el-tabs>
      </div>
    </my-dialog>

    <!-- 新增校区信息弹出框 -->
    <el-dialog
      :visible.sync="editDialog"
      width="500px"
      :title="currentRowData.Id>0?'编辑'+currentRowData.Label:'新增校区'"
    >
      <teacher-row-detail :editEnable="true" :formItemData="currentRowData" />
    </el-dialog>
  </div>
</template>

<script>
import common from "@/utils/common";
import {
  getManagerList,
  setStateManager,
  resetPasswordManager,
  getManagerPower
} from "@/api/manager";
import { getAllManagerOfPlatform } from "@/api/platform";
import myDialog from "@/components/myDialog/myDialog";
import teacherRowDialog from "@/views/system/component/teacherRowDialog";
import teacherRowDetail from "@/views/system/component/teacherRowDetail";
import setRight from "@/views/system/component/setRight";
import teacherBook from "@/views/system/component/teacherBook";
export default {
  name: "managerList",
  components: {
    myDialog,
    teacherRowDialog,
    teacherRowDetail,
    setRight,
    teacherBook
  },
  data() {
    return {
      common,
      // 搜索用户条件选择的选项
      searchConditionOptions: [
        {
          value: "realname",
          Label: "姓名"
        },
        {
          value: "username",
          Label: "昵称"
        },

        {
          value: "tel",
          Label: "电话"
        }
      ],
      // 搜索的输入值，内容，类型，角色
      searchVal: "",
      searchConditionVal: "",
      searchRoleVal: "",
      // 存放用户列表数据
      teacherList: [],
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页获取数据的总条数
      rows: 10,
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
      currentPlatform:0
    };
  },
  methods: {
    // 获取用户信息的列表
    async getAllManagerOfPlatform() {
      let offsetRow = (this.nowPage - 1) * this.rows;
      let searchCondition = this.searchConditionVal;
      let searchVal = this.searchVal;
      let res = await getAllManagerOfPlatform( this.currentPlatform, {
        limit: this.rows,
        offset: offsetRow,
        role: this.searchRoleVal,
        [searchCondition]: searchVal
      });
      // 获取数据的总条数
      if (res.code == 200) {
        this.allRows = 0;
        this.teacherList = [];
        if (res.data) {
          this.allRows = res.title;
          this.teacherList = res.data;
        }
      }
    },

    // 分页获取数据
    getDataChangePage(val) {
      this.nowPage = val;
      this.getAllManagerOfPlatform();
    },
    // 禁用或启用账户
    setTeacherStatus(index, row, status) {
      let msg;
      if (status == 0) {
        msg = "确认禁用该账户?";
      } else if (status == 1) {
        msg = "确认启用该账户?";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await setStateManager(
            row.Id,
            { status: status },
            false,
            true
          );
          if (res.code == 200) {
            this.$set(this.teacherList, index, res.data);
          }
        })
        .catch(() => {});
    },
    // 打开校区的弹出框
    openNewItem() {
      this.editDialog = true;
      this.currentRowData = {};
    },
    // 重置密码
    resetPassword(index, row) {
      this.$confirm("确认重置该账户密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await resetPasswordManager(row.Id);
          if (res.code == 200) {
            this.$alert("当前密码是:" + res.title, "密码", {
              confirmButtonText: "确定",
              callback: action => {
                this.$set(this.teacherList, index, res.data);
              }
            });
          }
        })
        .catch(() => {});
    },
    // 打开更多操作的弹出框
    openMoreOperationDialog(index, row) {
      this.currentTeacherIndex = index;
      this.currentRowData = row;
      this.moreOperationDialog = true;
    },
    // // 打开老师的弹出框
    // openTeacherDialog(type) {
    //   // type=1新增，type=0编辑
    //   if (type) {
    //     this.$refs.refTeacherDialog.getTeacherRowData({ id: 0 });
    //   } else {
    //     this.$refs.refTeacherDialog.getTeacherRowData({
    //       ...this.currentRowData
    //     });
    //   }
    // },

    // // 打开更多操作的模态框
    // moreOperationOfTeacher(index, row) {
    //   // 打开默认显示老师信息页面
    //   this.currentRowData = {};
    //   this.managerRightsMap = {};
    //   this.activElTab = "qxsz";
    //   this.currentTeacherIndex = index;
    //   this.currentRowData = row;
    //   this.moreOperationDialog = true;
    //   // this.$refs.refTeacherDetail.getTeacherRowData(row);
    // },
    // 切换tabs标签页在调用函数
    changDialogTab(tab) {
      if (tab.$attrs.id == "qxsz") {
        // 权限设置
        // this.$refs.refsetRight.getRowDataAddPower(
        //   this.currentRowData,
        //   this.managerRightsMap
        // );
      } else if (tab.$attrs.id == "sjkm") {
        // 给老师设置科目
        // this.$refs.refteacherBook.getTeacherRowData(this.currentRowData);
      }
    },
    // 修改或编辑老师个人信息后更新老师数据列表
    updateTeacherList(type, rowData) {
      // type=1添加，type=0修改，
      if (type == 1) {
        this.teacherList.unshift(rowData);
      } else if (type == 0) {
        this.currentRowData = { ...rowData };
        this.$set(this.teacherList, this.currentTeacherIndex, rowData);
        this.$refs.refTeacherDetail.getTeacherRowData({ ...rowData });
      }
    }
  },
  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
 this.currentPlatform= paths[paths.length - 1] 
    this.getAllManagerOfPlatform();
    // setTimeout(() => {
    //   this.$refs.refElTabel.doLayout();
    // }, 2000);
  },
  created() {
    this.searchConditionVal = this.searchConditionOptions[0].value;
    this.searchRoleVal = this.common.managerRoleList[0].value;
  }
};
</script>
<style  scope>
</style>