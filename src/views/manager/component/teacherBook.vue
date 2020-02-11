<template>
  <div class="p_both10 p-t-5">
    <el-form :inline="true" class="demo-form-inline m-b-5">
      <el-form-item label="课程大类">
        <el-input
          v-model="searchBookCourseKindLabel"
          @keyup.enter.native="searchSubmit"
          placeholder="请输入课程大类"
        ></el-input>
      </el-form-item>
      <el-form-item label="科目名称">
        <el-input v-model="searchContent" @keyup.enter.native="searchSubmit" placeholder="请输入科目名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 科目列表 -->
    <div>
      <el-table
        :data="subjectList"
        border
        style="width: 100%"
        @selection-change="bookSelectedChange"
        ref="refSubjectTable"
      >
        <el-table-column prop="Id" label="ID" width="60"></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="Label" label="名称"></el-table-column>
        <el-table-column prop="Topic" label="章节数" width="80"></el-table-column>
        <el-table-column prop="Coursekind" label="所属课程类别"></el-table-column>
      </el-table>
      <div class="m-v-15 between-center">
        <el-pagination
          background
          @current-change=" currentPageChange"
          :current-page.sync="nowPage"
          :page-size="rows"
          layout="total,prev, pager, next, jumper"
          :total="allRows"
        ></el-pagination>
        <el-button type="primary" @click="saveTeacherBook">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script> 
import {
  setTeachBook 
} from '@/api/manager'
import {
  queryBookList 
} from '@/api/book'
export default {
  name: "setRight",
  data() {
    return {
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 10,
      // 科目的表格数据
      subjectList: [],
      // 条件查询-科目名称
      searchContent: "",
      // 条件查询-课程大类Label
      searchBookCourseKindLabel: "",
      //当前编辑的老师的个人表单数据
      teacherInfoForm: {},
      //存储当前选中的老师已经关联的科目id
      allBookidSelected: [],
      // 当前数据页的所有id
      nowPageBookId: []
    };
  },
  methods: {
    // 父组件触发的方法，获取老师的信息
    getTeacherRowData(rowData) {
      // 初始化数据
      this.allBookidSelected = [];
      this.allRows = 0;
      this.nowPage = 1;
      this.rows = 10;
      this.searchContent = "";
      this.searchBookCourseKindLabel = "";
      this.teacherInfoForm = {};
      this.teacherInfoForm = { ...rowData };
      this.subjectList = null;
      if (this.teacherInfoForm.TeachBooks) {
        this.allBookidSelected = this.teacherInfoForm.TeachBooks.split(",").map(
          Number
        );
      }
      this.getAllBookList();
    },
    // 查询符合条件的课程
    searchSubmit() {
      this.nowPage = 1;
      this.getAllBookList();
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getAllBookList();
    },
    // 获取科目数据
    async getAllBookList() {
      let that = this;
      this.nowPageBookId = [];
      let res = await  queryBookList({
        limit: that.rows,
        offset: (that.nowPage - 1) * that.rows,
        label: that.searchContent,
        coursekind: that.searchBookCourseKindLabel
      });
      if (res.code == 200) {
        that.allRows = res.title;
        that.subjectList = res.data ? res.data : [];
        // 遍历老师已经选择过的科目，默认选中状态
        that.subjectList.forEach(bookItem => {
          that.nowPageBookId.push(bookItem.Id);
          that.allBookidSelected.forEach(bookid => {
            if (bookItem.Id == bookid) {
              that.$nextTick(() => {
                that.$refs.refSubjectTable.toggleRowSelection(bookItem, true);
              });
            }
          });
        });
      }
    },
    // 改变选项是进行的操作
    bookSelectedChange(seletedItem) {
      // 存储当前已经选择的科目Id
      let nowSeletedBookIds = [];
      // 遍历当前页已选中的选项
      seletedItem.forEach(item => {
        nowSeletedBookIds.push(item.Id);
      });
      // 遍历已选中的所有Id
      this.allBookidSelected = this.allBookidSelected.filter((value, index) => {
        if (!this.nowPageBookId.includes(value)) {
          return value;
        }
      });
      this.allBookidSelected = this.allBookidSelected.concat(nowSeletedBookIds);
    },
    //保存老师关联的科目
    async saveTeacherBook() {
      let booksid = [];
      booksid = this.allBookidSelected.map(String);
      let res = await setTeachBook(
        this.teacherInfoForm.Id,
        booksid,
        false
      );
      if (res.code == 200) {
        this.$message("设置成功!");
        this.teacherInfoForm = res.data;
        this.$emit("subClickEvent", 0, res.data);
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.refSubjectTable.doLayout();
    }, 2000);
  }
};
</script>  
<style scoped>
</style>