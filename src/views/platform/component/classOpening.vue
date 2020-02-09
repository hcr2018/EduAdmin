<template>
  <div class="p_both10 p-t-5">
    <my-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <el-form
      label-width="80px"
      :model="classOpenFormData"
      ref="classOpenForm"
      size="small"
      :rules="ClassOpenRules"
    >
      <el-form-item label="申请文件" prop="kksq_image">
        <div class="flex_dom flex_1 flex_wrap m-l-20">
          <div
            class="relative marg15"
            v-for="(item,index) in classOpenFormData.kksq_image"
            :key="index"
          >
            <img
              v-if="item.ImgSrc"
              class="wid20"
              src="/static/img/slice/uploadedIcon.png"
              @click="onPreview(item.ImgSrc)"
            />

            <div class="between-center m-v-5 wid80">
              <span class="text-center color-2e77f8 font12 m-r-5">{{item.Label}}</span>
              <el-upload
                :auto-upload="false"
                action
                v-if="isEditImgIcon"
                :show-file-list="false"
                :on-change="function(file, fileList){return updateClassOpeningImg(file, fileList,index)}"
              >
                <i class="el-icon-edit color-333"></i>
              </el-upload>
            </div>
            <div class="deleImgIcon cursor" v-if="isEditImgIcon" @click="deleClassOpenImg(index)">
              <img src="/static/img/slice/deleteIcon.png" alt />
            </div>
          </div>
          <el-upload
            :auto-upload="false"
            action
            v-if="isEditImgIcon"
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="uploadClassOpeningImg"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="开班时间" prop="opentime">
        <el-date-picker v-model="classOpenFormData.opentime" :disabled="!isEditImgIcon" type="date"></el-date-picker>
      </el-form-item>
      <el-form-item label="结课时间" prop="endtime">
        <el-date-picker v-model="classOpenFormData.endtime" :disabled="!isEditImgIcon" type="date"></el-date-picker>
      </el-form-item>
      <el-form-item label="授课老师">
        <vxe-table
          ref="ClassTeacherTable"
          size="mini"
          border
          :edit-rules="ClassOpenTableRules"
          :fit="true"
          @edit-disabled="editDisabledRow"
          :data="classOpenFormData.teacherList"
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
      </el-form-item>
      <el-form-item>
        <div class="between-center m-t-30">
          <el-button @click="insertTableRow(-1)">添加老师</el-button>
          <el-button type="primary" @click="saveClassOpenFormData">保 存</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import {
  getManagerList,
  getAllTeacher,
  resetPasswordManager,
  getTeachBook
} from "@/api/manager";
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
import { UploadImgClass } from "@/api/upload";
export default {
  name: "ClassStudent",
  components: {
    myImageViewer
  },
  data() {
    return {
      // 班级的表单数据
      classRowData: {},
      // 开班申请的表单数据
      classOpenFormData: {
        teacherList: [],
        kksq_image: []
      },
      // 开班申请的表单验证
      ClassOpenRules: {
        kksq_image: [
          { required: true, message: "开班申请必传", trigger: "blur" }
        ],
        opentime: [
          { required: true, message: "开班时间必填", trigger: "blur" }
        ],
        endtime: [{ required: true, message: "结课时间必填", trigger: "blur" }]
      },
      // 获取所有的老师
      teacherOptionList: [],
      // 是否可以编辑图片和开班申请
      isEditImgIcon: true,
      // 查看的图片的路径
      showImgUrl: "",
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // table数据的验证
      ClassOpenTableRules: {
        teacher_label: [{ required: true, message: "授课课时不能为空" }],
        book_label: [{ required: true, message: "授课科目不能为空" }],
        total_time: [{ required: true, message: "总课时不能为空" }]
      },
      // 老师所教的科目
      teacheingBookOptions: []
    };
  },
  methods: {
    //获取班级的基本信息
    getClassRow(formData) {
      this.classRowData = {};
      this.classRowData = { ...formData };
      this.getAllTeachers();
      this.getClassOpenData();
      this.teacheingBookOptions = [];
    },
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
    // 获取班级的申请资料
    async getClassOpenData() {
      this.isEditImgIcon = true;
      let res = await getClassOpenData(this.classRowData.Id);
      if (res.code == 200) {
        this.classOpenFormData = {
          teacherList: [],
          kksq_image: []
        };
        if (res.data) {
          res.data.kksq_image = JSON.parse(res.data.kksq_image);
          res.data.opentime = res.data.opentime * 1000;
          res.data.endtime = res.data.endtime * 1000;
          this.isEditImgIcon = false;
          res.data.teacherList = res.data.teacherList
            ? res.data.teacherList
            : [];
          this.classOpenFormData = res.data;
        }
      }
    },
    // 开班申请的图片上传
    async uploadClassOpeningImg(file) {
      let res = await UploadImgClass("", "", file.raw);
      if (res.code == 200) {
        let ImgItem = { ImgSrc: res.data, Label: file.raw.name };
        this.classOpenFormData.kksq_image.push(ImgItem);
      }
      this.$message({
        message: "上传成功！",
        type: "success"
      });
    },
    // 更换开班申请的图片
    async updateClassOpeningImg(file, fileList, index) {
      let res = await UploadImgClass("", "", file.raw);
      if (res.code == 200) {
        // 修改展示图片
        let ImgItem = { ImgSrc: res.data, Label: file.raw.name };
        this.classOpenFormData.kksq_image.splice(index, 1, ImgItem);
      }
    },
    // 删除开班申请的图片
    deleClassOpenImg(index) {
      this.classOpenFormData.kksq_image.splice(index, 1);
    },
    // 保存开班申请的所有数据
    saveClassOpenFormData() {
      // 验证表单数据
      this.$refs.classOpenForm.validate(valid => {
        if (valid) {
          this.$refs.ClassTeacherTable.validate(async valid => {
            if (valid) {
              let rowdata = { ...this.classOpenFormData };
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
                  this.classOpenFormData = res.data;
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
    // 改变老师的时候保存老师的id，并获取科目
    changeTeacher(val, row, rowIndex) {
      this.teacherOptionList.forEach(item => {
        if (item.Realname == val) {
          row.teacher_id = item.Id;
        }
      });
      this.getTeacherTeachingBook(row.teacher_id, val);
      this.classOpenFormData.teacherList.splice(rowIndex, 1, row);
    },

    // 改变老师是获取老师所教的科目
    async getTeacherTeachingBook(teacherId, teacherLabel) {
      this.teacheingBookOptions = [];
      let res = await getTeachBook(teacherId);
      if (res.code == 200) {
        if (!res.data) {
          this.common.go_alert(teacherLabel + "老师还没有关联的科目哦！");
        }
        this.teacheingBookOptions = res.data ? res.data : [];
      }
    },
    // 改变科目的时候保存科目Id
    changeTeachingBook(val, row, rowIndex) {
      this.teacheingBookOptions.forEach(item => {
        if (item.Label == val) {
          row.book_id = item.Id;
        }
      });
      this.classOpenFormData.teacherList.splice(rowIndex, 1, row);
    },
    // 插入行
    insertTableRow(row) {
      let newItem = {
        id: -this.classOpenFormData.teacherList.length - 1
      };
      this.classOpenFormData.teacherList.push(newItem);
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
      this.classOpenFormData.teacherList.splice(rowIndex, 1);
    }
  }
};
</script> 
<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  margin-top: 15px;
  box-sizing: border-box;
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