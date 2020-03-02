<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <el-tabs @tab-click="handleClick">
        <el-tab-pane
          v-for="item in $store.getters.app.collegeWithCourseKind"
          :label="item.Label"
          :key="item.Id"
        ></el-tab-pane>
      </el-tabs>
      <el-table
        ref="refElTabel"
        tooltip-effect="light"
        :data="newsListTable"
        border
        style="width: 100%"
        height="100%"
      >
        <el-table-column prop="Id" label="ID" width="50"></el-table-column>
        <el-table-column prop="Title" label="资料名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="保密级别" width="100">
          <template slot-scope="scope">
            <span>{{common.FormatSelect(newsKindOptions,scope.row.KindId)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Creattime" :formatter="TimeFormatter" label="发布时间" width="130"></el-table-column>
        <el-table-column prop="AuthorLabel" label="发布人" width="100"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="editNewsRow(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteNewsRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="between-center m-v-15">
        <el-button type="primary" @click="newsAdd">添加资料</el-button>
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
    <!-- 弹出框 -->
    <div>
      <my-dialog
        :closeShow="true"
        title="资料详情编辑"
        :showLeft="false"
        :visible.sync="newsFormDialog"
        :closeLeft="false"
      >
        <div slot="right_content">
          <docFormData ref="newsForm" :platform="currentPlatform" :formItemData="newsFormData" @updateRowData="updateNewsList"></docFormData>
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import common from "@/utils/common";
import docFormData from "@/views/web/component/docFormData";
import { getNewsList, deleNewsRow } from "@/api/news";
export default {
  name: "newsList",
  components: {
    myDialog,
    docFormData
  },
  data() {
    return {
      common,
      currentCollege: 0,
      // 资料类型的选项
      newsKindOptions: [
        {
          value: 0,
          Label: "公开资料"
        },
        {
          value: 1,
          Label: "内部资料"
        },
        {
          value: 2,
          Label: "隐秘资料"
        },
        {
          value: 3,
          Label: "保密资料"
        },
        {
          value: 4,
          Label: "绝密资料"
        }
      ],
      // 资料的数据列表
      newsListTable: [],
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 30,
      // 显示隐藏模态框
      newsFormDialog: false,
      // 模态框获得的单条数据
      newsFormData: null,
      currentPlatform: 0,
    
      // 当前索引
      currentNewsIndex: null
    };
  },

  methods: {
   
    handleClick(item) {
      this.currentCollege = 0;
      let selectIndex = 0;
      if (item != null) {
        selectIndex = item.index;
      }
      let collegeItem = this.$store.getters.app.collegeWithCourseKind[
        selectIndex
      ];
      if (collegeItem) {
        this.currentCollege = collegeItem.Id;
      }
      this.getNewsList();
    },
    // 获取资料的数据列表
    async getNewsList() {
      let offsetRow = (this.nowPage - 1) * this.rows;
      let newParams = {
        college: this.currentCollege,
        platform: this.currentPlatform,
        needPublic: true,
        simple: 1,
        limit: this.rows,
        offset: offsetRow
      };
      let res = await getNewsList("", newParams);
      if (res.code == 200) {
        this.newsListTable = [];
        if (res.data) {
          this.newsListTable = res.data;
        }
        this.allRows = res.title;
      }
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getNewsList();
    },
    // 删除资料数据
    deleteNewsRow: function(index, row) {
      this.$confirm("你确定要删除吗？删了之后找不回来哦", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.currentNewsIndex = index;
          let res = await deleNewsRow(row.Id);
          if (res.code == 200) {
            this.getNewsList();
            this.$message({
              message: "删除成功 ",
              type: "success"
            });
          }
        })
        .catch(() => {});
    },
    // 打开编辑弹窗获取用户数据
    editNewsRow(index, row) {
      this.newsFormDialog = true;
      this.currentNewsIndex = index;
      this.newsFormData = row;
    },
    // 显示列表的时候格式化时间
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue, 2);
    },
    // 点击新增资料
    newsAdd() {
      this.newsFormDialog = true;
      this.newsFormData = {
        icon: "upload/news/defaultNewsIcon.jpg",
        Id: 0,
        Downfile: "",
        Title: "",
        Description: "",
        Content: "",
        KindId: null
      };
    },
    // 编辑或者添加之后更新表格数据-资料列表
    updateNewsList(rowData, isType) {
      // isType编辑还是添加
      if (isType == 1) {
        this.$set(this.newsListTable, this.currentNewsIndex, rowData);
      } else if (isType == 0) {
        this.newsListTable.unshift(rowData);
      }
      this.newsFormDialog = false;
    }
  },

  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = paths[paths.length - 1];
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
    }
    setTimeout(this.handleClick, 1000);

    // this.getNewsList();
  }
};
</script>
<style scope >
.selectStyle {
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  color: #606266;
  font-size: 14px;
}
.selectStyle::-ms-expand {
  display: none;
}
</style>

