<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowContractDialog"
    :append-to-body="true"
    :title="'['+currentItemData.StudentLabel+']合同订单'"
    width="740px"
  >
    <div class="contractform">
      <el-form
        ref="refContractForm"
        :rules="contractRules"
        :model="currentItemData"
        label-width="105px"
        size="small"
        class="dialog-body-pad"
      >
        <el-form-item label="合同名称" prop="Title">
          <el-input
            v-model="currentItemData.Title"
            :disabled="operationType==0"
            placeholder="请填写合同名称"
          />
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="currentItemData.StudentLabel" disabled placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input
            v-model="currentItemData.IDCard"
            :disabled="operationType==0"
            placeholder="身份证号码"
          />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="currentItemData.Sex" :disabled="operationType==0" label="男">男</el-radio>
          <el-radio v-model="currentItemData.Sex" :disabled="operationType==0" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="所属学院">
          <el-select
            v-model="currentItemData.CollegeID"
            class="changInputWidth"
            :disabled="operationType==0"
            placeholder="请选择所属学院"
              @change="collegeChangeGetCourseKind"
          
          >
            <el-option
              v-for="item in $store.getters.app.collegeWithCourseKind"
              :key="item.Id"
              :label="item.Label"
              :value="item.Id"
             
            />
          </el-select>
        </el-form-item>
        <div v-show="operationType!=0">
          <el-form-item label="课程大类">
            <el-select
              v-model="nowcourseKind"
              class="changInputWidth"
              :disabled="operationType==0"
              placeholder="请选择课程大类"
              @change="getCourse"
            >
              <el-option
                v-for="(item) in CourseKindsOps"
                :key="item.Id"
                :label="item.Label"
                :value="item.Label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="报名课程" prop="CourseID">
            <el-select
              v-model="currentItemData.CourseID"
              :disabled="operationType==0"
              class="changInputWidth"
              placeholder="请选择报读课程"
            >
              <el-option
                v-for="(item,index) in courseList"
                :key="index"
                :label="item.Label"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div v-show="operationType==0">
          <el-form-item label="报名课程">
            <el-input
              v-model="currentItemData.CourseLabel"
              :disabled="operationType==0"
              placeholder="请输入报名课程"
              @input="$forceUpdate()"
            />
          </el-form-item>
        </div>
        <el-form-item label="报名时间" prop="AddTime">
          <el-date-picker
            v-model="currentItemData.AddTime"
            class="changInputWidth"
            type="date"
            :disabled="operationType==0"
            value-format="timestamp"
            placeholder="请选择报名时间"
            @input="$forceUpdate()"
          />
        </el-form-item>
        <el-form-item label="招生老师">
          <el-input
            v-model="PlatformWorkerLabel"
            :disabled="true"
            placeholder="请选择招生老师"
            @input="$forceUpdate()"
          />
        </el-form-item>
        <div class="center m-b-20">
          <span class="flex_1 hgt1 border-db-dcdfe6" />
          <p class="color-303133 font16 text-center font-w6">学费信息</p>
          <span class="flex_1 hgt1 border-db-dcdfe6" />
        </div>
        <el-form-item label="课程价格" prop="CoursePrice">
          <el-input
            v-model="currentItemData.CoursePrice"
            :disabled="operationType==0"
            placeholder="请输入课程价格"
            @change="countCourseRealPrice()"
            @input="$forceUpdate()"
          />
        </el-form-item>
        <el-form-item label="优惠金额" prop="YouhuiPrice">
          <el-input
            v-model="currentItemData.YouhuiPrice"
            :disabled="operationType==0"
            placeholder="请输入优惠金额"
            @change="countCourseRealPrice()"
            @input="$forceUpdate()"
          />
        </el-form-item>
        <el-form-item label="优惠类型">
          <el-select
            v-model="currentItemData.YouhuiLeixing"
            class="changInputWidth"
            :disabled="operationType==0"
            placeholder="请选择优惠类型"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in common.costomPreferentialType"
              :key="item.value"
              :label="item.Label"
              :value="item.Label"
            />
          </el-select>
        </el-form-item>
        <div class="between-center">
          <el-form-item label="实收学费" prop="ShijiPrice" class="flex_1">
            <el-input
              v-model="currentItemData.ShijiPrice"
              disabled
              placeholder="请输入实收学费"
              @input="$forceUpdate()"
            />
          </el-form-item>
          <el-form-item label="支付方式" prop="PayMethod" class="flex_1">
            <el-select
              v-model="currentItemData.PayMethod"
              :disabled="operationType==0"
              placeholder="请选择支付方式"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in common.costomPaymentMethod"
                :key="item.value"
                :label="item.Label"
                :value="item.Label"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="欠款金额" prop="QiankuanPrice">
          <el-input
            v-model="currentItemData.QiankuanPrice"
            placeholder="请输入欠款金额"
            @change="countCourseRealPrice()" 
          />
        </el-form-item>
        <el-form-item label="回款时间">
          <el-date-picker
            v-model="currentItemData.HuikuanTime"
            type="date"
            value-format="timestamp"
            :disabled="operationType==0"
            class="changInputWidth"
            placeholder="请选择回款时间" 
          />
        </el-form-item>
        <div class="center">
          <el-form-item label="转介绍人" class="wid_50">
            <el-input
              v-model="currentItemData.ZhuanPerson"
              :disabled="operationType==0"
              placeholder="请输入转介绍人" 
            />
          </el-form-item>

          <el-form-item label="联系电话" class="wid_50">
            <el-input
              v-model="currentItemData.ZhuanTel"
              :disabled="operationType==0"
              placeholder="请输入联系电话" 
            />
          </el-form-item>
        </div>
        <el-form-item label="图片">
          <div class="flex_dom flex_wrap">
            <div v-for="(item,index) in contractImgArr" :key="index" class="relative marg15">
              <my-image-viewer
                class="wid80 hgt80"
                :preview-src-list="[item]"
                :src="item"
                fit="cover"
              />
              <div
                v-show="currentItemData.Id<=0"
                class="deleImgIcon cursor"
                @click="deleCustomImg(index)"
              >
                <img src="/static/img/slice/deleteIcon.png" alt />
              </div>
            </div>
            <el-upload
              v-show="currentItemData.Id<=0"
              :auto-upload="false"
              action
              class="avatar-uploader"
              :show-file-list="false"
              :on-change="uploadContractImg"
            >
              <i class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="情况备注">
          <el-input
            v-model="currentItemData.Comments"
            type="textarea"
            placeholder="情况备注~" 
          />
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="isShowContractDialog=false">取 消</el-button>
          <el-button type="primary" class="m-l-40" @click="saveAddContract">保 存</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  getContractList,
  getCustomContract,
  addCustomContract,
  deleCustomContract,
  updateCustomContract
} from "@/api/contract";
import { GetCourseOfKind } from "@/api/course";

import $ImgAPI from "@/api/ImgAPI";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import common from "@/utils/common";
export default {
  props: {
    // 校区的表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
  },
  name: "ContractFrom",
  components: {
    myImageViewer
  },
  data() {
    return {
      common,
      // 显示合同弹出框
      isShowContractDialog: false,
      // 添加客户合同的默认数据
      currentItemData: {},
      // 存放合同图片的数组
      contractImgArr: [],
      // 课程大类
      nowcourseKind: "",
      // 当前用户姓名-添加合同
      PlatformWorkerLabel: "",
      //选中学院后的课程大类
      CourseKindsOps:[],
      // 所有获取课程
      courseList: [],
      // 操作类型:1添加，2追加，0编辑
      operationType: null,
      // 表单验证规则
      contractRules: {
        Title: [{ required: true, message: "请输入合同名称", trigger: "blur" }],
        AddTime: [
          { required: true, message: "请选择报名时间", trigger: "blur" }
        ],
        CourseID: [
          { required: true, message: "请选择报名课程", trigger: "blur" }
        ],
        CoursePrice: [
          { required: true, message: "请输入课程价格", trigger: "blur" }
        ],
        YouhuiPrice: [
          { required: true, message: "请输入优惠金额", trigger: "blur" }
        ],
        PayMethod: [
          { required: true, message: "请选择支付方式", trigger: "blur" }
        ],
        QiankuanPrice: [
          { required: true, message: "请输入欠款金额", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.currentItemData = this.formItemData;
    this.currentItemData.Title =
      "[" +
      this.currentItemData.StudentLabel +
      "]合同订单--" +
      new Date().toString();
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
 
      }
    },


    // 获取重复组件传递过来的值
    getContractFormData(rowData, type) {
      // 初始化数据
      this.courseList = [];
      this.operationType = type;
      this.contractImgArr = [];
      this.currentItemData = {};
      this.currentItemData = { ...rowData };
      this.PlatformWorkerLabel = this.currentItemData.PlatformWorkerLabel;
      if (this.currentItemData.Id == 0) {
        this.currentItemData.PlatformWorkerID = this.$store.getters.manager.Id;
        this.PlatformWorkerLabel = this.$store.getters.manager.Realname;
      } else if (this.currentItemData.Id > 0) {
        if (this.currentItemData.Picture) {
          this.contractImgArr = JSON.parse(this.currentItemData.Picture);
        }
        if (this.currentItemData.AddTime) {
          this.currentItemData.AddTime = this.currentItemData.AddTime * 1000;
        }
        if (this.currentItemData.HuikuanTime) {
          this.currentItemData.HuikuanTime =
            this.currentItemData.HuikuanTime * 1000;
        }
      }
      this.isShowContractDialog = true;
    },
    // 计算实际价格
    countCourseRealPrice() {
      this.currentItemData.ShijiPrice =
        parseFloat(this.currentItemData.CoursePrice) -
        parseFloat(this.currentItemData.YouhuiPrice) -
        parseFloat(this.currentItemData.QiankuanPrice);
      this.currentItemData.ShijiPrice = this.currentItemData.ShijiPrice.toFixed(
        2
      );
    },
    // 客户合同图片上传
    async uploadContractImg(file) {
      const res = await $ImgAPI.UploadImg("contract", file.raw);
      if (res.code == 200) {
        this.$message("上传成功！");
        this.contractImgArr.push(res.data);
      }
    },
    // 删除合同资料的图片
    deleCustomImg(index) {
      this.contractImgArr.splice(index, 1);
    },
    // 保存新增合同
    async saveAddContract() {
      this.$refs["refContractForm"].validate(async valid => {
        if (valid) {
          if (this.currentItemData.AddTime) {
            this.currentItemData.AddTime = parseInt(
              this.currentItemData.AddTime / 1000
            );
          }
          if (this.currentItemData.HuikuanTime) {
            this.currentItemData.HuikuanTime = parseInt(
              this.currentItemData.HuikuanTime / 1000
            );
          }

          if (this.contractImgArr.length > 0) {
            this.currentItemData.Picture = JSON.stringify(this.contractImgArr);
          }
          if (this.currentItemData.ShijiPrice < 0) {
            this.$message("实际价格不能为负数");
            return;
          }
          this.currentItemData.CoursePrice = parseFloat(
            this.currentItemData.CoursePrice
          );
          this.currentItemData.ShijiPrice = parseFloat(
            this.currentItemData.ShijiPrice
          );
          this.currentItemData.YouhuiPrice = parseFloat(
            this.currentItemData.YouhuiPrice
          );
          this.currentItemData.QiankuanPrice = parseFloat(
            this.currentItemData.QiankuanPrice
          );
          let res;
          if (this.currentItemData.Id > 0) {
            res = await updateCustomContract(
              this.currentItemData.Id,
              this.currentItemData
            );
          } else {
            res = await addCustomContract(this.currentItemData);
          }

          if (res.code == 200) {
            if (this.currentItemData.Id > 0) {
              this.$emit("updateContractData", 0, res.data);
              this.$message("修改成功 ！");
            } else {
              if (this.operationType == 2) {
                this.$emit("updateContractData", 1, res.data);
              }
              this.$message("添加成功 ！");
            }
            this.isShowContractDialog = false;
          }
        } else {
          return false;
        }
      });
    },
    changeCollege(event){
      console.log("========",event);
    },
    // 获取课程
    async getCourse(value) {
      let kindId = 1;
      this.$store.getters.app.courseKind.forEach(item => {
        if (item.Label == value) {
          kindId = item.Id;
        }
      });
      const res = await GetCourseOfKind({ kindid: kindId });
      this.courseList = res.data;
      if (this.courseList != null && this.courseList.length > 0) {
        this.currentItemData.CourseID = this.courseList[0].Id;
      }
    }
  }
};
</script>
<style scoped>
.contractform /deep/ .changInputWidth {
  width: 100%;
}
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
.border-db-dcdfe6 {
  border-bottom: 1px dashed #dcdfe6;
}
</style>
