<template>
  <div>
    <el-table
      :data="collegeItem.Children"
      border
      tooltip-effect="light"
      style="width: 100%"
      height="100%"
    >
      <el-table-column prop="Id" label="ID" width="50" />
      <el-table-column prop="Label" label="课程类别名称" width="250" />
      <el-table-column prop="Descritpion" :show-overflow-tooltip="true" label="描述" />
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" @click="modifyCourseKind(scope.$index, scope.row)">修改</el-button>
          <el-button type="warning" @click="delCourseKind(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form
      ref="refCourseKindForm"
      :model="courseKindItem"
      :rules="courseFormRules"
      style="padding:10px 0px 0px 0px"
      label-width="120px"
      size="small"
    >
      <div class="flex_dom">
        <el-button type="warning" @click="currenteditEnable=true;courseKindItem = {};">新增</el-button>
        <el-form-item label="课程类别名：" style="width:500px">
          <el-input v-model="courseKindItem.Label" :disabled="currenteditEnable==false" />
        </el-form-item>
        <el-form-item label="备注说明：" style="width:100%">
          <el-input v-model="courseKindItem.Descritpion" :disabled="currenteditEnable==false" />
        </el-form-item>
        <div style="display:flex;width:200px">
          <el-button
            type="primary"
            :disabled="editForm"
            v-show="currenteditEnable"
            class="m-l-40"
            @click="saveCourseKind"
          >确 认</el-button>
          <!-- <el-button v-show="currenteditEnable" @click="currenteditEnable=false">取 消</el-button> -->
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import common from "@/utils/common";
import { addCourseKind, editCourseKind, deleteCourseKind } from "@/api/course";

import $ImgAPI from "@/api/ImgAPI";
export default {
  props: {
    // 校区的表单数据
    collegePropItem: {
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
      common,
      currenteditEnable: this.editEnable,

      // collegeID
      collegeItem: {},
      // 表单验证
      courseFormRules: {
        Label: [
          { required: true, message: "课程类别名称不能为空", trigger: "blur" }
        ]
      },
      // 搜索科目时通过课程类别的名称查找
      courseKindLabel: "",
      // 课程的选项数据
      courseKindItem: {},

      // 图片加载
      editForm: false
    };
  },
  watch: {
    collegePropItem(newvar) {
      this.collegeItem = this.collegePropItem;
      this.courseKindItem = {};
      // this.collegeChangeGetCourseKind(0);
    }
  },
  mounted() {
    this.collegeItem = this.collegePropItem;
  },
  methods: {
    // 保存课程数据
    async saveCourseKind() {
      this.$refs.refCourseKindForm.validate(async valid => {
        if (valid) {
          this.$confirm("确定保存吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            this.courseKindItem.TCollegeID = this.collegeItem.Id;
            let res;
            if (this.courseKindItem.Id > 0) {
              res = await editCourseKind(
                this.courseKindItem.Id,
                "",
                this.courseKindItem
              );
              if (!this.collegeItem.Children) {
                this.collegeItem.Children = [];
              }
              let kindIndex = 0;
              this.collegeItem.Children.forEach(element => {
                if (element.Id == res.data.Id) {
                  this.collegeItem.Children[kindIndex] = res.data;
                }
                kindIndex++;
              });
              this.$message("修改成功 !");
            } else {
              res = await addCourseKind("", "", this.courseKindItem);
              if (!this.collegeItem.Children) {
                this.collegeItem.Children = [];
              }
              this.collegeItem.Children.push(res.data);
              this.$message("添加成功 !");
            }
            this.courseKindItem = {};

            this.$store.dispatch("app/getCollegeWithCourseKind");
          });
        } else {
          return false;
        }
      });
    },
    async delCourseKind(index, updateCourseKind) {
      if (updateCourseKind.Id > 0) {
        this.$confirm("确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          let res = await deleteCourseKind(updateCourseKind.Id, "", "");
          this.collegeItem.Children.splice(index, 1);
           this.courseKindItem = {};
          this.$store.dispatch("app/getCollegeWithCourseKind");
        });
      }
    },
    // 给课程关联教材
    modifyCourseKind(index, updateCourseKind) {
      this.currenteditEnable = true;
      this.courseKindItem = updateCourseKind;
      this.$forceUpdate();
    }
  }
};
</script>
