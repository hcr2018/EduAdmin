<template>
  <div class="flex_dom p_both10 p-t-5">
    <div class="flex_column" style="width:200px;min-height:550px;max-height:680px;">
      <p class="text-center">班级学员</p>
      <div class="is-scroll-left m-t-15 border-e0 overflow_auto flex_1 p_both20">
        <!-- <el-checkbox
          class="m-t-20"
          :indeterminate="isCheckAllStatus"
          v-model="stucheckAll"
          @change="stuCheckAllChange"
        >全选</el-checkbox>-->
        <div class="m-t-10 flex_mid" :key="index" v-for="(item,index) in classAllStuOptions">
          <!-- <el-checkbox
            v-model="checkedStus"
            @change="checkStuChange"
            class="flex_1"
            :label="item.id"
          >{{item.Realname}}</el-checkbox>-->
          <p class="flex_1">{{item.Realname}}</p>
          <p
            class="font12 cursor m-l-10 bg-339967 color-fff wid60 text-center hgt20 l-h-20 radius3"
          >作业情况</p>
        </div>
      </div>
    </div>
    <div class="m-t-30 m-l-20 flex_1">
      <div v-if="!disableHandOut" class="m-b-40">
        <el-form
          :model="handOutWorkForm"
          ref="refhandOutWorkForm"
          :rules="handOutWorkFormRules"
          label-width="80px"
        >
          <div class="between-center">
            <el-form-item label="教材" label-width="60px" prop="subjectId" class="flex_1 hgt50">
              <el-select
                v-model="handOutWorkForm.subjectId"
                @change="changSubject"
                placeholder="请选择科目"
              >
                <el-option
                  :label="item.book_label"
                  :key="index"
                  :value="item.book_id"
                  v-for="(item,index) in classSubjectList"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作业组卷" prop="taskId" class="flex_1 hgt50">
              <el-select
                v-model="handOutWorkForm.taskId"
                @change="changSubject"
                placeholder="请选择科目"
              >
                <el-option
                  :label="item.Label"
                  :key="index"
                  :value="item.Id"
                  v-for="(item,index) in taskExamOptions"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="center-end">
            <el-form-item>
              <el-button type="primary" @click="saveHandOutWork" class="border0">确认分发</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div>
        <p class="font-w6 color-2e77f8 text-center p-b-10 border-b-e5ecf7 m-t-20">分 发 记 录</p>
        <el-table
          ref="refElTabel"
          :data="allTaskRecord"
          style="width: 100%"
          border
          tooltip-effect="light"
        >
          <el-table-column prop="ExerciseID" label="编号" width="55"></el-table-column>
          <el-table-column prop="Creattime" label="发放时间" width="90">
            <template slot-scope="scope">
              <span>{{common.dateFormat(scope.row.Creattime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Label" label="作业名称" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import common from '@/utils/common'
import {
  getManagerList, 
  setStateManager,
  resetPasswordManager,
   getManagerPower
} from '@/api/manager'
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
  getCourseList,
  GetCourseOfKind,
  setCourseUpperShelf,
  addCourse,
  editCourse,
  GetSubjectByCourse,
  getCourseTravelBrochure,
  updateCourseTravelBrochure,
  getCoursePriceList,
  saveCoursePriceList,
  getSubjectChapter,
  getExamList,
  addExam,
  editExam,
  getZhangOfSubject, 
  saveExamQuestions,
  getDoWrongQuseStuList,
  getTopWrongQuseList
} from '@/api/course'

export default {
  name: "handOutWork",
  data() {
    return {
      common,
      // 班级的数据
      classRowData: {},
      // 班级分发作业的列表
      allTaskRecord: [],
      // 班级所有的学员
      classAllStuOptions: [],
      // 所有学员的ID
      allStuIds: [],
      // 全选学生
      stucheckAll: false,
      // 已选中的学生
      checkedStus: [],
      // 全选的状态
      isCheckAllStatus: true,
      // 科目的搜索内容表单
      handOutWorkForm: {},
      // 班级科目
      classSubjectList: [],
      // 考卷选项
      taskExamOptions: [],
      // 禁止分发作业
      disableHandOut: true,
      // 搜索表单的验证
      handOutWorkFormRules: {
        subjectId: [{ required: true, message: "请选择科目", trigger: "blur" }],
        taskId: [{ required: true, message: "请选择作业", trigger: "blur" }]
      }
    };
  },
  methods: {
    //获取班级的基本信息
    getClassRow(formData) {
      this.taskExamOptions = [];
      this.classSubjectList = [];
      this.classAllStuOptions = [];
      this.checkedStus = [];
      this.allStuIds = [];
      this.allTaskRecord = [];
      this.isCheckAllStatus = false;
      this.stucheckAll = false;
      this.disableHandOut = true;
      this.classRowData = {};
      this.classRowData = { ...formData };
      this.getClassAllStuList();
      this.getClassTeacher();
      this.allClassTaskRecord();
    },
    // 获取班级的分发记录
    async allClassTaskRecord() {
      let res = await getAllClassTaskRecord(this.classRowData.Id);
      if (res.code == 200) {
        this.allTaskRecord = res.data ? res.data : [];
      }
    },
    // 获取班级老师
    async getClassTeacher() {
      let res = await getClassOpenData(this.classRowData.Id);
      if (res.code == 200) {
        if (res.data && res.data.teacherList) {
          if (res.data.teacherList.length > 0) {
            res.data.teacherList.forEach(item => {
              if (item.teacher_id == this.$store.state.userInformation.Id) {
                this.classSubjectList.push(item);
              }
            });
            if (this.classSubjectList.length > 0) {
              this.disableHandOut = false;
            }
          }
        }
      }
    },
    // 改变科目获取组卷
    changSubject(val) {
      this.getExerciseByTaskExam();
    },
    // 获取具体章节的组卷
    async getExerciseByTaskExam() {
      let urlParams = this.handOutWorkForm.subjectId + "/" + 5;
      let res = await  getExamList(urlParams, {
        limit: 100000000
      });
      if (res.code == 200) {
        this.taskExamOptions = res.data ? res.data : [];
        if (this.taskExamOptions.length == 0) {
          this.$message("该科目下还没有作业组卷哦！");
        }
      }
    },
    // 获取班级的所有学员
    async getClassAllStuList() {
      let res = await  getClassStu(this.classRowData.Id);
      if (res.code == 200) {
        this.classAllStuOptions = res.data ? res.data : [];
        this.classAllStuOptions.forEach(item => {
          this.allStuIds.push(item.id);
        });
      }
    },
    // 点击全选切换选中数据
    stuCheckAllChange(val) {
      if (val) {
        this.classAllStuOptions.forEach(item => {
          this.checkedStus.push(item.id);
        });
      } else {
        this.checkedStus = [];
      }
      this.isCheckAllStatus = false;
    },
    // 点击单个选框的操作
    checkStuChange(value) {
      let checkedCount = this.checkedStus.length;
      this.stucheckAll = checkedCount === this.classAllStuOptions.length;
      this.isCheckAllStatus =
        checkedCount > 0 && checkedCount < this.classAllStuOptions.length;
    },
    // 分发作业
    saveHandOutWork() {
      this.$refs.refhandOutWorkForm.validate(async valid => {
        if (valid) {
          let res;
          // if (this.checkedStus.length > 0) {
          let urlParams =
            this.classRowData.Id + "/" + this.handOutWorkForm.taskId;
          // if (this.stucheckAll) {
          res = await $ClassHttp.handOutTask(urlParams);
          // } else {
          //   res = await $ClassHttp.handOutTask(urlParams, this.checkedStus);
          // }
          if (res.code == 200) {
            this.$message("分发成功！");
            this.allTaskRecord = res.data ? res.data : [];
          }
          // } else {
          //   this.$message("请选择分发作业的学员！");
          // }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.refElTabel.doLayout();
    }, 2000);
  }
};
</script> 
<style scoped>
</style> 