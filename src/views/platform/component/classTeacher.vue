<template>
  <div class="p_both10 p-t-5">
    <div class="flex_1 m-l-20">
      <vxe-table
        ref="ClassTeacherTable"
        size="mini"
        border
        :edit-rules="ClassOpenTableRules"
        :fit="true"
        @edit-disabled="editDisabledRow"
        :data="teacherList"
        :edit-config="{trigger: 'dblclick', mode: 'row',showIcon:false, activeMethod: activeTeacherRow}"
      >
        <vxe-table-column
          field="teacher_label"
          title="老师名称"
          :edit-render="{type: 'default'}"
          width="110"
        >
          <template v-slot:edit="{row,rowIndex}">
            <el-select
              v-model="row.teacher_label"
              @change="(val)=>{return changeTeacher(val, row,rowIndex)}"
            >
              <el-option
                v-for="(item,index) in teacherOptionList"
                :key="index"
                :label="item.Realname"
                :value="item.Realname"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>

        <vxe-table-column
          field="book_label"
          title="教教材目"
          :edit-render="{type: 'default'}"
          width="220"
          show-overflow
        >
          <template v-slot:edit="{row,rowIndex}">
            <el-select
              v-model="row.book_label"
              @change="(val)=>{return changeTeachingBook(val, row,rowIndex)}"
            >
              <el-option
                v-for="(item,index) in  teacheingBookOptions"
                :key="index"
                :label="item.Label"
                :value="item.Label"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="total_time"
          title="总课时"
          :edit-render="{type: 'default'}"
          width="80"
        >
          <template v-slot:edit="{ row }">
            <el-input-number v-model="row.total_time" :min="0"></el-input-number>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" show-overflow>
          <template v-slot="{ row,rowIndex }">
            <el-button v-if="row.id<0" @click="deleTeacherRow(row,rowIndex)">删除</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <div class="between-center m-v-15">
        <el-button @click="insertTeacherRow()">添加老师</el-button>
        <el-button type="primary" @click="saveClassOpenFormData">保 存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getAllClass,
  editClassInfo,
  addClassInfo,
  getOneClass,
  addClassOpenData,
  getClassOpenData,
  getTimeTableByMonth,
  addTimeTableBy,
  addTimeTag,
  getTimeTag,
  addClassStu,
  getClassStu,
  handOutTask,
  getAllClassTaskRecord
} from "@/api/class";
import {
  GetStudentDataTrackAnalysis,
  getCustomTracks,
  addcustomTracks,
  uploadImgInTracks,
  replyTracks,
  receiveSmsTrack,
  getTrackList,
  getCustomBuyCouseRecord,
  addCustomBuyCourseRecord,
  customAllowDoExercise,
  deleteBuyCourse,
  getCustomInfoList,
  addCustomInfo,
  editCustomInfo,
  resetCustomPassword,
  setCustomAccountStatus,
  checkTelephone,
  setStar,
  batchChangeManager
} from "@/api/custom";
import common from "@/utils/common";
export default {
  name: "ClassStudent",
  props: {
    // 校区的表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
  },
  watch: {
    formItemData(newval) {
      this.getClassAllStuList();
    }
  },
  data() {
    return {
      common,
      // 搜索表单数据
      stuSearchForm: {
        searchPhone: "",
        searchName: ""
      },
      // 搜索表单验证
      stuSearchFormRules: {
        searchPhone: [
          {
            pattern: /^\d{5,11}$/,
            message: "请输入正确的手机号，且不得少于5位数",
            trigger: "blur"
          }
        ]
      },
      // 老师所教的科目
      teacheingBookOptions: [],
      // 查找学员的列表-查找结果
      serachStuList: [],
      // 选中的要加入班级的学员
      checkBoxAddStu: [],
      // 是否显示添加学员模块
      ShowSearchForm: false,
      // 是否显示搜索学员的搜索结果模块
      showSrarchStuResult: false,
      // 获取班级的所有学员
      classAllStuList: [],
      // 复选框所选中的学员ID
      checkBoxStuID: [],
      teacherList: [],
      ClassOpenTableRules: {
        teacher_label: [{ required: true, message: "授课课时不能为空" }],
        book_label: [{ required: true, message: "授课科目不能为空" }],
        total_time: [{ required: true, message: "总课时不能为空" }]
      }
    };
  },
  methods: {
    // 保存开班申请的所有数据
    saveClassOpenFormData() {
      // 验证表单数据
      this.$refs.classOpenForm.validate(valid => {
        if (valid) {
          this.$refs.ClassTeacherTable.validate(async valid => {
            if (valid) {
              let rowdata;
              rowdata.kksq_image = JSON.stringify(rowdata.kksq_image);
              if (isNaN(rowdata.opentime)) {
                rowdata.opentime = Math.floor(
                  rowdata.opentime.getTime() / 1000
                );
              } else {
                rowdata.opentime = rowdata.opentime / 1000;
              }
              if (isNaN(rowdata.endtime)) {
                rowdata.endtime = Math.floor(rowdata.endtime.getTime() / 1000);
              } else {
                rowdata.endtime = rowdata.endtime / 1000;
              }
              let res = await addClassOpenData(
                this.classRowData.Id,
                "",
                rowdata
              );
              if (res.code == 200) {
                if (res.data) {
                  res.data.kksq_image = JSON.parse(res.data.kksq_image);
                  res.data.opentime = res.data.opentime * 1000;
                  res.data.endtime = res.data.endtime * 1000;
                  this.isEditImgIcon = false;
                  // this. = res.data;
                }
                this.$message({
                  message: "保存成功！",
                  type: "success"
                });
              }
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 改变科目的时候保存科目Id
    changeTeachingBook(val, row, rowIndex) {
      this.teacheingBookOptions.forEach(item => {
        if (item.Label == val) {
          row.book_id = item.Id;
        }
      });
      this.teacherList.splice(rowIndex, 1, row);
    },
    // 插入行
    insertTableRow(row) {
      let newItem = {
        id: -this.teacherList.length - 1
      };
      this.teacherList.push(newItem);
    },
    // 禁止编辑以前添加的老师
    editDisabledRow({ row, column }) {
      console.log(row, "11111");
      this.common.go_alert("禁止编辑");
    },
    // 可以编辑的行数
    activeTeacherRow({ row, rowIndex }) {
      console.log(row, "2222");
      if (row.id <= 0) {
        return rowIndex == rowIndex;
      }
    },
    // id小于0的行可以删除
    deleTeacherRow(row, rowIndex) {
      this.teacherList.splice(rowIndex, 1);
    },
    // 改变科目的时候保存科目Id
    changeTeachingBook(val, row, rowIndex) {
      this.teacheingBookOptions.forEach(item => {
        if (item.Label == val) {
          row.book_id = item.Id;
        }
      });
      this.teacherList.splice(rowIndex, 1, row);
    },
    // 获取班级的所有学员
    async getClassAllStuList() {
      this.serachStuList = [];
      this.ShowSearchForm = false;
      this.showSrarchStuResult = false;
      let res = await getClassStu(this.formItemData.Id);
      this.classAllStuList = res.data ? res.data : [];
    },
    // 查找学员
    searchStudent() {
      // 验证表单数据
      if (!this.stuSearchForm.searchPhone && !this.stuSearchForm.searchName) {
        this.$message("必须填写学生手机号或姓名之后才能查询哦！");
        return false;
      }
      this.$refs.stuSearchForm.validate(async valid => {
        if (valid) {
          let res = await getCustomInfoList("", {
            limit: 10000,
            tel: this.stuSearchForm.searchPhone,
            realname: this.stuSearchForm.searchName
          });
          if (res.code == 200) {
            if (res.data) {
              this.serachStuList = res.data;
              this.showSrarchStuResult = true;
            } else {
              this.serachStuList = [];
              this.$message("没有找到该学员哦！");
            }
          }
        } else {
          return false;
        }
      });
    },
    // 向班级添加学员
    async addStudentToClass() {
      if (this.checkBoxAddStu.length < 1) {
        this.$message("还没有选中要添加的学员哦！");
        return;
      }
      let newStu = [...this.checkBoxAddStu];
      if (this.classAllStuList.length > 0) {
        this.classAllStuList.forEach(stuItem => {
          let index = newStu.indexOf(stuItem.ID);
          if (index != -1) {
            newStu.splice(index, 1);
          }
        });
      }
      if (newStu.length == 0) {
        this.$message("该学员已经添加过了哦,换个试试吧！");
        this.checkBoxAddStu = [];
        return;
      }
      let res = await addClassStu(this.formItemData.Id, "", newStu);
      if (res.code == 200) {
        this.$message("添加成功！");
        // 清空搜索和选中的学员数据
        this.checkBoxAddStu = [];
        this.serachStuList = [];
        this.stuSearchForm.searchPhone = "";
        this.ShowSearchForm = false;
        this.showSrarchStuResult = false;
        this.classAllStuList = [];
        if (res.data && res.data.length > 0) {
          this.classAllStuList = res.data;
        }
      }
    },
    // 当复选框发生改变时获取所选中的项
    changeSelectStu(selsetItem) {
      this.checkBoxStuID = [];
      selsetItem.forEach(item => {
        this.checkBoxStuID.push(item.id);
      });
    },
    // 移除班级学员
    removeClassStu() {
      if (this.checkBoxStuID.length == 0) {
        this.$message("还没有勾选学员哦！");
      } else {
        console.log(this.checkBoxStuID);
      }
    }
  },
  mounted() {}
};
</script> 
<style scoped>
</style> 