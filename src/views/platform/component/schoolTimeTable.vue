
<template>
  <div class="p_both10 p-t-5">
    <div class="flex_dom">
      <div class="mycalendar bg-999">
        <el-calendar id="calendar" v-model="showDate">
          <template slot="dateCell" slot-scope="{date, data}">
            <div
              class="calendar-day"
              :class="{day_selected:calendarSelectData.indexOf(data.day)!=-1,nowday_selected:common.dateFormatStr(showDate)==data.day}"
            >{{ data.day.split('-').slice(2).join('-') }}</div>
          </template>
        </el-calendar>
      </div>

      <div class="flex_1 m-l-20">
        <vxe-table
          ref="timeTable"
          size="mini"
          border
          :edit-rules="TimeTableRules"
          @edit-disabled="editDisabledRow"
          class="vxe-table-element"
          :data="todayTimeTableList"
          :edit-config="{trigger: 'dblclick', mode: 'row',showIcon:false,activeMethod: activeTeacherRow}"
        >
          <vxe-table-column
            field="StartTime"
            title="上课时间"
            :edit-render="{type: 'default'}"
            width="90"
          >
            <template v-slot:edit="{ row }">
              <el-time-select
                placeholder="上课时间"
                v-model="row.StartTime"
                :picker-options="{
      start: '08:00',
      step: '00:10',
      end: '22:30'
    }"
              ></el-time-select>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="EndTime"
            title="下课时间"
            :edit-render="{type: 'default'}"
            width="90"
          >
            <template v-slot:edit="{ row }">
              <el-time-select
                placeholder="下课时间"
                v-model=" row.EndTime"
                :picker-options="{
      start: '08:00',
      step: '00:10',
      end: '22:30'
    }"
              ></el-time-select>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="BookLabel"
            title="上课科目"
            width="200"
            :edit-render="{type: 'default'}"
          >
            <template v-slot:edit="{row,rowIndex}">
              <el-select
                v-model="row.BookLabel"
                @change="(val)=>{return changeSubject(val, row,rowIndex)}"
              >
                <el-option
                  v-for="(item,index) in classAllSubject"
                  :key="index"
                  :label="item.book_label"
                  :value="item.book_label"
                ></el-option>
              </el-select>
            </template>
          </vxe-table-column>
          <vxe-table-column field="TeacherLabel" title="授课老师" width="90"></vxe-table-column>
          <vxe-table-column
            field="CourseNum"
            title="授课课时"
            :edit-render="{type: 'default'}"
            width="90"
          >
            <template v-slot:edit="{ row }">
              <el-input-number v-model="row.CourseNum" :min="0"></el-input-number>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="Address"
            title="授课地址"
            :edit-render="{type: 'default'}"
            width="200"
            show-overflow
          >
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.Address" @input="$refs.timeTable.updateStatus(scope)"></el-input>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" width="120" fixed="right">
            <template v-slot="{row,rowIndex}">
              <el-button v-if="row.Id<0" @click="deleTimeTableRow(row,rowIndex)">删除</el-button>
              <el-button v-if="row.Id>=0" type="primary" @click="openTimeTagDialog(row,rowIndex)">考勤</el-button>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div class="between-center m-v-15">
          <el-button v-show="isAllowEdit" @click="insertTableRow(-1)">添加课程</el-button>
          <el-button type="primary" v-show="isAllowEdit" @click="saveTimeTableList">保 存</el-button>
        </div>
      </div>
    </div>

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
        title="教学科目"
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
      <vxe-table-column field="total_time" title="总课时" :edit-render="{type: 'default'}" width="80">
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
    <div class="between-center m-t-30">
      <el-button @click="insertTableRow(-1)">添加老师</el-button>
      <el-button type="primary" @click="saveClassOpenFormData">保 存</el-button>
    </div>

    <!-- 模态框 -->
    <div>
      <!-- 考勤记录 -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="showTimeTagDialog"
        :append-to-body="true"
        width="740px"
        title="考勤"
      >
        <TimeTagForm
          :timeTableRowData="timeTableRow"
          v-if="showTimeTagDialog"
          @subClickEvent="closeTimeTagDialog"
        ></TimeTagForm>
      </el-dialog>
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
  getManagerList,
  getAllTeacher,
  resetPasswordManager,
  getTeachBook
} from "@/api/manager";
import TimeTagForm from "./timeTagForm";
import common from "@/utils/common";
export default {
  name: "schoolTimeTable",
  components: {
    TimeTagForm
  },
  data() {
    return {
      common,
      teacherList: [],
      // 已经添加课表的日期
      calendarSelectData: [],
      // 班级的表单数据
      classRowData: {},
      // 课程所有的科目
      classAllSubject: [],
      //  某一月课程表数据
      MonthTimeTableList: {},
      //  某一天课程表数据
      todayTimeTableList: [],
      // 之前月份获取的数据的那年那月的
      nowTimeTableOfDay: "",
      // 课表是否可以进行编辑
      isAllowEdit: true,
      // 显示当前日历所在的月份
      showDate: new Date(),
      // table数据的验证
      TimeTableRules: {
        StartTime: [{ required: true, message: "上课时间不能为空" }],
        EndTime: [{ required: true, message: "下课时间不能为空" }],
        BookLabel: [{ required: true, message: "授课科目不能为空" }],
        CourseNum: [{ required: true, message: "授课课时不能为空" }],
        Address: [{ required: true, message: "授课地址不能为空" }]
      },
      // 控制考勤记录模态框的显隐
      showTimeTagDialog: false,
      // 单条课程表的数据
      timeTableRow: {},
      // 班级的学生列表
      classAllStuList: []
    };
  },
  methods: {
    // 获取所有的老师
    async getAllTeachers() {
      let res = await getAllTeacher("", {
        status: 1,
        role: 0,
        simple: 1
      });
      if (res.code == 200) {
        this.teacherOptionList = res.data ? res.data : [];
      }
    },
    // 禁止编辑以前添加的老师
    editDisabledRow({ row, column }) {
      this.$message({
        message: "禁止编辑",
        type: "warning"
      });
    },
    //获取班级的基本信息
    getClassRow(formData) {
      this.classRowData = {};
      this.classRowData = { ...formData };
      this.getClassSubjectData();
      this.getTimeTable();
      this.getClassAllStuList();
    },
    // 获取班级的所有学员-添加考勤记录的时候用
    async getClassAllStuList() {
      let res = await getOneClass(this.classRowData.Id, {
        withStudent: "1"
      });
      if (res.code == 200) {
        this.classAllStuList = [];
        if (res.data.StudentArray) {
          this.classAllStuList = res.data.StudentArray;
        }
      }
    },
    // 获取班级的授课老师
    async getClassSubjectData() {
      let res = await getClassOpenData(this.classRowData.Id);
      if (res.code == 200) {
        if (res.data) {
          res.data.teacherList = res.data.teacherList
            ? res.data.teacherList
            : [];
          this.classAllSubject = res.data.teacherList;
        }
      }
    },
    // 根据月份获取数据
    async getTimeTable() {
      let nowSelectDayObj = this.common.dateFormatStr(this.showDate).split("-");
      let urlParams =
        this.classRowData.Id +
        "/" +
        nowSelectDayObj[0] +
        "/" +
        nowSelectDayObj[1];
      let res = await getTimeTableByMonth(urlParams);
      if (res.code == 200) {
        res.title = res.title ? res.title.split(",") : [];
        this.calendarSelectData = res.title;
        res.data = res.data ? res.data : {};
        this.nowTimeTableOfDay = "";
        this.nowTimeTableOfDay = nowSelectDayObj[0] + "-" + nowSelectDayObj[1];
        this.MonthTimeTableList = res.data;
        this.getTimeTableSelectDay();
      }
    },
    // 点击日历获取数据
    getTimeTableSelectDay() {
      let day = this.common.dateFormatStr(this.showDate);
      let fullDate = day.split("-");
      let yearMonth = fullDate[0] + "-" + fullDate[1];
      if (yearMonth != this.nowTimeTableOfDay) {
        this.getTimeTable();
      } else {
        if (this.MonthTimeTableList[day]) {
          this.todayTimeTableList = this.MonthTimeTableList[day];
        } else {
          this.todayTimeTableList = [];
        }
      }
    },
    // 改变科目的时候自动获取老师和老师id
    changeSubject(val, row, rowIndex) {
      this.classAllSubject.forEach(item => {
        if (item.book_label == val) {
          row.TeacherID = item.teacher_id;
          row.BookID = item.book_id;
          row.TeacherLabel = item.teacher_label;
        }
      });
      this.todayTimeTableList.splice(rowIndex, 1, row);
    },
    // 插入行添加课表
    insertTableRow(row) {
      let newItem = {
        Id: -this.todayTimeTableList.length - 1
      };
      this.todayTimeTableList.push(newItem);
    },
    // id小于0的行可以删除
    deleTimeTableRow(row, rowIndex) {
      this.todayTimeTableList.splice(rowIndex, 1);
    },
    // 保存添加或者编辑的课程表
    saveTimeTableList() {
      this.$refs.timeTable.validate(async valid => {
        if (valid) {
          let nowSelectDayObj = this.common
            .dateFormatStr(this.showDate)
            .split("-");
          let urlParams =
            this.classRowData.Id +
            "/" +
            this.common.dateFormatStr(this.showDate);
          let res = await $ClassHttp.addTimeTableBy(
            urlParams,
            this.todayTimeTableList
          );
          if (res.code == 200) {
            res.title = res.title ? res.title.split(",") : [];
            this.calendarSelectData = res.title;
            res.data = res.data ? res.data : {};
            this.nowTimeTableOfDay = "";
            this.nowTimeTableOfDay =
              nowSelectDayObj[0] + "-" + nowSelectDayObj[1];
            this.MonthTimeTableList = res.data;
            this.getTimeTableSelectDay();
            this.$message({
              message: "保存成功",
              type: "success"
            });
          }
        } else {
          return false;
        }
      });
    },
    // 禁止编辑超过当前日期的课表
    editDisabledRow({ row, column }) {
      this.$message({
        message: "已完成的课程不能编辑",
        type: "success"
      });
    },
    // 可以编辑的行数
    activeTeacherRow({ row, rowIndex }) {
      if (this.isAllowEdit) {
        return rowIndex == rowIndex;
      }
    },
    // 点击考勤，打开考勤模态框
    openTimeTagDialog(row, rowIndex) {
      this.showTimeTagDialog = true;
      this.timeTableRow = {};
      this.timeTableRow = row;
      this.timeTableRow.timeTableDate = this.common.dateFormatStr(
        this.showDate
      );
      this.timeTableRow.stuList = this.classAllStuList;
    },
    // 关闭考勤记录弹窗
    closeTimeTagDialog() {
      this.showTimeTagDialog = false;
    }
  },
  watch: {
    // 监听日历显示日期的变化
    showDate: {
      handler(newValue) {
        let today = new Date().getTime();
        let selectday = new Date(newValue).getTime();
        if (selectday + 86400000 < today) {
          this.isAllowEdit = false;
        } else {
          this.isAllowEdit = true;
        }
        this.getTimeTableSelectDay();
      },
      deep: true
    }
  }
};
</script> 
<style scoped>
#calendar {
  width: 235px;
}
.day_selected {
  border-radius: 50%;
  background: #2e77f8;
  color: #ffffff;
}
.nowday_selected {
  border-radius: 50%;
  background: #f31810 !important;
  color: #ffffff;
}
.mycalendar >>> .el-calendar-table .el-calendar-day {
  padding: 10px 0px;
  text-align: center;
  line-height: 40px;
  height: 40px;
}
.mycalendar >>> .calendar-day {
  text-align: center;
  width: 22px;
  height: 22px;
  line-height: 22px;
  font-size: 14px;
  margin: 0px 5px;
}
.mycalendar >>> .el-calendar__body {
  padding: 0px;
}
.mycalendar >>> .el-button--mini {
  padding: 2px;
}
.mycalendar >>> .current,
.mycalendar >>> .next,
.mycalendar >>> .prev {
  border: none;
  border-bottom: 1px solid #eaeaea;
  height: 40px;
}
</style> 