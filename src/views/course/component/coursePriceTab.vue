<template>
  <div>
    <el-form style="padding:10px 0px 0px 0px" label-width="80px" size="small">
      <el-form-item label="绑定教材">
        <div style="display:flex">
          <el-input v-model="searchSubjectContent" placeholder="请输入教材名称" class="m-r-12 flex_1" />
          <el-button type="primary" @click="getBookList">查询</el-button>
        </div>
      </el-form-item>
      <el-form-item label="可选科目">
        <div class="addSubject flex_dom flex_wrap">
          <p v-for="(item,index) in subjectListOps" :key="item.Id">
            {{ item.Label }}
            <i class="el-icon-circle-plus" @click="addSubjectToSourse(item,index)" />
          </p>
        </div>
      </el-form-item>
    </el-form>
    <vxe-grid
      border
      resizable
      :data.sync="coursePriceList"
      :edit-config="{trigger: 'click', mode: 'row'}"
      :columns="coursePriceColumnTitle"
    />
    <div class="between-center m-v-15">
      <el-button type="primary" @click="insertColumns">新增课程有效期</el-button>
      <el-button type="primary" @click="saveCoursePrice">保存</el-button>
    </div>
  </div>
</template>
<script>
import { saveCoursePriceList, getCoursePriceList } from "@/api/course";
import { queryBookList } from "@/api/book";
export default {
  props: {
    // 校区的表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    editEnable: {
      typ: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 学院默认选中第一项
      collegeIndex: 0,
      currentItemData: {},
      // 课程的价格列表数据
      coursePriceList: [],
      // 设置价格表格列字段
      coursePriceColumnTitle: [],
      // 存储价格的列名称
      priceColumnTitle: [],

      tableColumnValue: [],
      // 存储课程大类下查找的科目
      subjectListOps: [],
      CourseKindsOps: [],
      // 查找教材搜索内容
      searchSubjectContent: ""
    };
  },
  watch: {
    formItemData(newvar) {
      this.currentItemData = this.formItemData;
    }
  },
  mounted() {
    this.currentItemData = this.formItemData;
  },
  methods: {
    //  选中学院后回调
    collegeChangeGetCourseKind(index) {
      this.subjectListOps = [];
      this.currentItemData.TCourseKindID = null;
      this.currentItemData.TCollegeID = this.$store.getters.app.collegeWithCourseKind[
        index
      ].Id;
      this.CourseKindsOps = [
        ...this.$store.getters.app.collegeWithCourseKind[index].Children
      ];
      if (this.CourseKindsOps.length > 0) {
        this.currentItemData.TCourseKindID = this.CourseKindsOps[0].Id;
        this.courseKindLabel = this.CourseKindsOps[0].Label;
        // this.getBookList();
      }
    },
    saveCourse: function() {
      this.$refs.refCourseForm.validate(async valid => {
        if (valid) {
          const res = await editCourse(
            this.currentItemData.Id,
            "",
            this.currentItemData
          );
          if (res.code == 200) {
            this.$message("修改成功 !");
            this.$emit("subClickEvent", 1, res.data);
          }
        } else {
          return false;
        }
      });
    },
    // 查找课程大类下的教材
    async getBookList() {
      this.subjectListOps = [];
      let params = { coursekind: this.courseKindLabel };
      if (this.searchSubjectContent) {
        params = { label: this.searchSubjectContent };
      }
      const res = await queryBookList("", params);
      if (res.code == 200) {
        this.subjectListOps = res.data ? res.data : [];
      }
    },
    // 获取科目价格
    async getCoursePrice() {
      // 初始化数据
      this.coursePriceColumnTitle = [
        { title: "ID", field: "Id", width: 70 },
        { title: "科目名称", field: "Label" }
      ];
      this.priceColumnTitle = [];
      this.coursePriceList = [];
      const res = await getCoursePriceList(this.formItemData.Id);
      if (res.code == 200) {
        for (const items of res.data.Children) {
          for (const item in items) {
            if (
              this.priceColumnTitle.indexOf(item) == -1 &&
              item != "Id" &&
              item != "Label" &&
              item != "TCourseHasBookId"
            ) {
              this.priceColumnTitle.push(item);
            }
          }
        }
        if (this.priceColumnTitle.length > 0) {
          this.priceColumnTitle.forEach(name => {
            this.coursePriceColumnTitle.push({
              editRender: { name: "input" },
              field: name,
              title: name + "天"
            });
            this.tableColumnValue.push(name);
          });
        }
        this.coursePriceList = res.data.Children;
      }
    },
    // 新增课程有效期列
    insertColumns() {
      this.$prompt("请输入有效期名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.$message("新增成功");
          this.coursePriceColumnTitle.push({
            editRender: { name: "input" },
            field: value,
            title: value + "天"
          });
          this.tableColumnValue.push(value);
          // 添加列后,将字段添加到数据表中
          for (const items of this.coursePriceList) {
            items[value] = null;
          }
        })
        .catch(() => {});
    },
    // 保存价格
    saveCoursePrice() {
      for (const items of this.coursePriceList) {
        for (const item in items) {
          if (items[item] == null || items[item] == "") {
            this.$alert("价格不能为空哦！", "提示", {
              confirmButtonText: "确定",
              type: "warning",
              callback: action => {}
            });
            return;
          }
        }
      }
      this.$confirm("只可提交一次,确认提交吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const urlParams = "?id=" + this.formItemData.Id;
          const res = await saveCoursePriceList(
            urlParams,
            this.coursePriceList
          );
          if (res.code == 200) {
            this.$message("设置成功");
            this.getCoursePrice();
          }
        })
        .catch(e => {});
    }
  }
};
</script>
<style scoped>
</style>
