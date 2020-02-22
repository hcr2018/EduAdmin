<template>
  <!-- 考勤记录表单 -->
  <div>
    <myImageViewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <el-form
      :model="timeTagFormData"
      :rules="timetagRules"
      ref="timeTagElForm"
      label-width="105px"
      size="small"
      class="dialog-body-pad"
    >
      <p
        class="text-center m-b-20 color-c0c4cc font16"
        v-if="!isEditTimeTag"
      >{{timeTagFormData.TeacherLabel}}：{{common.dateFormat(timeTagFormData.Createtime)}}</p>
      <el-form-item label="教教材目">
        <el-input v-model="timeTableRowData.BookLabel" disabled></el-input>
      </el-form-item>
      <el-form-item label="上课时间">
        <el-input v-model="classTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="计划课时">
        <el-input v-model="timeTableRowData.CourseNum" disabled></el-input>
      </el-form-item>
      <el-form-item label="实际课时" prop="ShiJi">
        <el-input
          v-model.number="timeTagFormData.ShiJi"
          :disabled="!isEditTimeTag||!isRightTeacher"
          placeholder="请输入实际上课课时"
        ></el-input>
      </el-form-item>
      <el-form-item label="应到人数">
        <el-input v-model.number="planStudentNum" disabled></el-input>
      </el-form-item>
      <el-form-item label="实到人数">
        <el-input v-model.number="timeTagFormData.ShidaoNumber" disabled></el-input>
      </el-form-item>
      <el-form-item label="缺勤学员">
        <div class="flex_dom flex_wrap">
          <el-tag
            class="m-t-5 m-r-10"
            :closable="isEditTimeTag"
            :key="index"
            @close="deleAbsenceStu(index)"
            v-for="(item,index) in missClaaStuList"
          >{{item}}</el-tag>
          <p
            class="m-t-5 m-r-10"
            v-if="isEditTimeTag&&isRightTeacher"
            @click="isShowSearchStuDIv=true"
          >
            <i class="el-icon-circle-plus font26 color-2e77f8"></i>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="查找学员" v-if="isShowSearchStuDIv">
        <div class="center">
          <el-input
            v-model="searchStudentName"
            placeholder="请输入学员的姓名"
            @keyup.enter.native="searchStudent"
          ></el-input>
          <el-button type="primary" @click="searchStudent" class="border0 m-l-20">查 询</el-button>
        </div>
      </el-form-item>
      <el-form-item v-show="searchResultStuList.length>0&&isShowSearchStuDIv" label="查找结果">
        <div class="flex_mid flex_wrap">
          <p
            v-for="(item,index) in searchResultStuList"
            :key="index"
            @click="addAbsenceStu(item.Realname,index)"
            class="cursor m-r-10"
          >
            {{item.Realname}}
            <i class="el-icon-circle-plus"></i>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="上传考勤" prop="Dianmingbiao">
        <div class="flex_dom flex_wrap">
          <div
            class="relative marg15"
            v-for="(item,index) in timeTagFormData.Dianmingbiao"
            :key="index"
          >
            <!-- <my-image
              class="wid80 hgt80"
              :src="item.ImgSrc"
              :preview-src-list="[item.ImgSrc]"
              fit="cover"
            ></my-image> -->
             <img
                v-if="item.ImgSrc"
                class="wid20"
                src="/assets/slice/uploadedIcon.png"
                @click="onPreview(item.ImgSrc)"
              />


            <div class="between-center m-v-5 wid80">
              <span class="text-center color-2e77f8 font12 m-r-5">{{item.Label}}</span>
              <el-upload
                :auto-upload="false"
                action
                v-if="isEditTimeTag"
                :show-file-list="false"
                :on-change="function(file, fileList){return updateTimeTagImg(file, fileList,index)}"
              >
                <i class="el-icon-edit color-333"></i>
              </el-upload>
            </div>
            <div v-if="isEditTimeTag" class="deleImgIcon cursor" @click="deleTimeTagImg(index)">
              <img src="/assets/slice/deleteIcon.png" alt />
            </div>
          </div>
          <el-upload
            :auto-upload="false"
            action
            v-if="isEditTimeTag&&isRightTeacher"
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="uploadTimeTagImg"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="教学进度(页)" prop="Jindu">
        <div class="center">
          <el-input
            v-model="timeTagFormData.Jindu"
            :disabled="!isEditTimeTag||!isRightTeacher"
            placeholder="请输入教学进度，例如30-20页"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="教学内容" prop="JiaoxueNeirong">
        <el-input
          v-model="timeTagFormData.JiaoxueNeirong"
          type="textarea"
          :disabled="!isEditTimeTag||!isRightTeacher"
          :rows="4"
          placeholder="请输入教学内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="around-center hgt60 bge0e3ea">
      <div>
        <el-button
          @click="cancleOperation"
          class="m-r-30"
        >{{isEditTimeTag&&isRightTeacher?'取 消':'关 闭'}}</el-button>
        <el-button
          type="primary"
          v-if="isEditTimeTag&&isRightTeacher"
          @click="saveClassTimeTag"
          class="m-l-40"
        >保 存</el-button>
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
import common from "@/utils/common";
 
import $ImgAPI from "@/api/ImgAPI";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
export default {
  name: "timeTagForm",
  components:{
    myImageViewer
  },
  props: {
    timeTableRowData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
       common,
      // 考勤记录的表单数据
      timeTagFormData: {
        Dianmingbiao: []
      },
      // 课堂考勤的表单验证
      timetagRules: {
        ShiJi: [
          { required: true, message: "实际课时不能为空", trigger: "blur" }
        ],
        Dianmingbiao: [
          { required: true, message: "必须上传考勤表", trigger: "blur" }
        ],
        Jindu: [{ required: true, message: "教学进度必填", trigger: "blur" }],
        JiaoxueNeirong: [
          { required: true, message: "教学内容必填", trigger: "blur" }
        ]
      },
      // 上课时间
      classTime: "",
      // 存放班级所有的学员
      classAllStuList: [],
      // 班级的学生人数
      planStudentNum: null,
      // 缺勤的学生
      missClaaStuList: [],
      // 根据姓名搜索学员
      searchStudentName: "",
      // 搜索结果-学生
      searchResultStuList: [],
      // 是否显示搜索学生的模块
      isShowSearchStuDIv: false,
      // 考勤记录是否可以编辑
      isEditTimeTag: true,
      // 判断是不是当前老师在操作考勤，非本老师只可以查看
      isRightTeacher: true
    };
  },
  methods: {
    // 获取班级的所有学员
    async getClassAllStuList() {
      let res = await  getOneClass(this.timeTableRowData.ClassID, {
        withStudent: "1"
      });
      if (res.code == 200) {
        this.classAllStuList = [];
        if (res.data.StudentArray) {
          this.classAllStuList = res.data.StudentArray;
        }
      }
    },
    // 查找学员
    searchStudent() {
      let searchStuName = this.searchStudentName.trim();
      let reg = new RegExp(searchStuName, "g");
      this.searchResultStuList = this.classAllStuList.filter(item => {
        if (item.Realname.match(reg)) {
          return item;
        }
      });
      if (this.searchResultStuList.length == 0) {
        this.$message("没有找到该学生哦，换个名字试试吧！");
      }
      this.searchStudentName = "";
    },
    // 从搜索结果中添加缺课学生
    addAbsenceStu(stuName, index) {
      if (
        this.missClaaStuList.length == 0 ||
        this.missClaaStuList.indexOf(stuName) == -1
      ) {
        this.missClaaStuList.push(stuName);
      }
      this.timeTagFormData.ShidaoNumber =
        this.planStudentNum - this.missClaaStuList.length;
    },
    // 删除缺勤学员
    deleAbsenceStu(index) {
      this.missClaaStuList.splice(index, 1);
      this.timeTagFormData.ShidaoNumber =
        this.planStudentNum - this.missClaaStuList.length;
    },
    // 考勤表的图片上传
    async uploadTimeTagImg(file) {
      let res = await $ImgAPI.UploadImg("courseTime",  file.raw);
      if (res.code == 200) {
        this.$message("上传成功！");
        let ImgItem = { ImgSrc: res.data, Label: file.raw.name };
        this.timeTagFormData.Dianmingbiao.push(ImgItem);
      }
    },
    // 更换考勤表的图片
    async updateTimeTagImg(file, fileList, index) {
      let res = await $ImgAPI.UploadImg("courseTime",  file.raw);
      if (res.code == 200) {
        this.$message("上传成功！");
        let ImgItem = { ImgSrc: res.data, Label: file.raw.name };
        this.timeTagFormData.Dianmingbiao.splice(index, 1, ImgItem);
      }
    },
    // 删除考勤表的图片
    deleTimeTagImg(index) {
      this.timeTagFormData.Dianmingbiao.splice(index, 1);
    },
    // 保存考勤记录
    saveClassTimeTag() {
      this.$refs.timeTagElForm.validate(async valid => {
        if (valid) {
          let Obg = { ...this.timeTagFormData };
          Obg.Dianmingbiao = JSON.stringify(Obg.Dianmingbiao);
          Obg.QueqingStudent = this.missClaaStuList.join(",");
          Obg.planStudentNum = this.planStudentNum;
          let res = await  addTimeTag(this.timeTableRowData.Id, Obg);
          if (res.code == 200) {
            this.$message("保存成功！");
            // this.isEditTimeTag = false;
            // this.timeTagFormData = {};
            // if (res.data.QueqingStudent) {
            //   this.missClaaStuList = res.data.QueqingStudent.split(",");
            // }
            // res.data.Dianmingbiao = JSON.parse(res.data.Dianmingbiao);
            // this.timeTagFormData = res.data;
            this.$emit("subClickEvent");
          }
        } else {
          return false;
        }
      });
    },
    // 获取考勤记录
    async getClassTimeTag() {
      // 初始化赋值
      this.classTime =
        this.timeTableRowData.StartTime + "-" + this.timeTableRowData.EndTime;
      this.classAllStuList = this.timeTableRowData.stuList;
      this.planStudentNum = this.classAllStuList.length;
      this.timeTagFormData.ShidaoNumber = this.classAllStuList.length;
      let res = await  getTimeTag(this.timeTableRowData.Id);
      if (res.code == 200) {
        if (res.data != null && res.data.Createtime > 0) {
          this.isEditTimeTag = false;
          if (res.data.QueqingStudent) {
            this.missClaaStuList = res.data.QueqingStudent.split(",");
          }
          if (res.data.Dianmingbiao) {
            res.data.Dianmingbiao = JSON.parse(res.data.Dianmingbiao);
          }

          this.timeTagFormData = res.data;
        }
      }
    },
    // 关闭考勤记录模态框
    cancleOperation() {
      this.$emit("subClickEvent");
    }
  },

  mounted() {
    if (
      this.timeTableRowData.TeacherID == this.$store.state.userInformation.Id
    ) {
      this.isRightTeacher = true;
    } else {
      this.isRightTeacher = false;
    }
    this.getClassTimeTag();
  }
};
</script>  
<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  box-sizing: border-box;
  margin-top: 15px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.deleImgIcon {
  position: absolute;
  top: -10px;
  right: -3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  z-index: 10;
}
</style>