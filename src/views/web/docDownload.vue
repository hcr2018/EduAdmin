<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <div class="flex_1">
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
          <el-table-column label="资料类型" width="100">
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
      </div>
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
          <newsFormData ref="newsForm" :formItemData="newsFormData" @updateRowData="updateNewsList"></newsFormData>
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import common from "@/utils/common";
import newsFormData from "@/views/web/component/newsFormData";
import { getNewsList, deleNewsRow } from "@/api/news";
export default {
  name: "newsList",
  components: {
    myDialog,
    newsFormData
  },
  data() {
    return {
      common,
      // 资料类型的选项
      newsKindOptions: [
        {
          value: 100,
          Label: "软件下载"
        },
        {
          value: 101,
          Label: "培训资料"
        },
        {
          value: 102,
          Label: "运营资料"
        },
        {
          value: 103,
          Label: "教学资料"
        },
        {
          value: 104,
          Label: "课件下载"
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
      // 当前索引
      currentNewsIndex: null
    };
  },
  methods: {
    // 获取资料的数据列表
    async getNewsList() {
      let offsetRow = (this.nowPage - 1) * this.rows;
      let newParams = {
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
   
    this.getNewsList();
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

