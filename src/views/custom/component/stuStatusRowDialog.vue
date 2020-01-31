<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showStuStatusDialog"
    :append-to-body="true"
    width="740px"
    :title="'['+stuStatusRowData.RealName+'] 学籍信息'"
  >
    <div class="studentstatusform">
      <el-form
        :model="stuStatusRowData"
        label-width="70px"
        :disabled="operationType==-1"
        size="small"
        class="dialog-body-pad"
      >
        <p class="font-w6 color-2e77f8 p-b-10 border-b-e5ecf7 m-b-20">学籍信息</p>
        <div class="around-center">
          <div class="wid90 uploadImg">
            <my-image
              v-if="Picture"
              class="avatar"
              :preview-src-list="[Picture]"
              :src="Picture"
              fit="cover"
            />
            <i v-if="!Picture" class="el-icon-plus avatar-uploader-icon" />
            <el-upload
              :auto-upload="false"
              action
              class="text-center color-2e77f8"
              :show-file-list="false"
              :on-change="uploadPicture"
            >
              <p
                v-if="operationType!=-1"
                class="color-2e77f8 font14 m-t-5 cursor"
              >{{ Picture?'重新上传':'上传' }}</p>
            </el-upload>
          </div>
          <div class="flex_1 m-l-20">
            <el-form-item label="真实姓名">
              <el-input v-model="stuStatusRowData.RealName" placeholder="请填写学员真实姓名" />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio v-model="stuStatusRowData.Sex" label="男">男</el-radio>
              <el-radio v-model="stuStatusRowData.Sex" label="女">女</el-radio>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="stuStatusRowData.IDCard" placeholder="请填写学员姓名" />
            </el-form-item>
          </div>
        </div>
        <div class="between-center m-t-5">
          <el-form-item label="报名层次" class="flex_1">
            <el-select v-model="stuStatusRowData.UniversityLevel" placeholder="请选择报名层次">
              <el-option
                v-for="item in common.costomSignUpLevel"
                :key="item.value"
                :label="item.Label"
                :value="item.Label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="报读专业" class="flex_1 m-l-40">
            <el-input v-model="stuStatusRowData.UniversityMajor" placeholder="请填写报读专业" />
          </el-form-item>
        </div>
        <div class="between-center">
          <el-form-item label="报读院校">
            <el-select
              v-model="stuStatusRowData.UniversityID"
              class="changInputWidth"
              placeholder="请选择报读院校"
            >
              <el-option
                v-for="item in common.AllUniversity"
                :key="item.Id"
                :label="item.Label"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="stuStatusRowData.RegisterTime"
              class="changInputWidth"
              type="date"
              value-format="timestamp"
              placeholder="请选择注册时间"
            />
          </el-form-item>
        </div>
        <div class="between-center">
          <el-form-item label="学历属性">
            <el-input v-model="stuStatusRowData.XueLiShuXing" placeholder="请填写学历属性" />
          </el-form-item>
          <el-form-item label="学籍编号">
            <el-input v-model="stuStatusRowData.XueJi" placeholder="学籍编号" />
          </el-form-item>
        </div>
        <el-form-item label="准考证号">
          <el-input v-model="stuStatusRowData.ZhunKaoZheng" placeholder="请填写准考证号" />
        </el-form-item>
        <p class="font-w6 color-2e77f8 p-b-10 border-b-e5ecf7 m-b-20">报名信息</p>
        <div class="between-center">
          <el-form-item label="招生站点">
            <el-select
              v-model="stuStatusRowData.PlatformID"
              class="changInputWidth"
              placeholder="请选择招生站点"
            >
              <el-option
                v-for="item in common.platformList"
                :key="item.Id"
                :label="item.Label"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="学员来源">
            <el-input v-model="stuStatusRowData.XueYuanLaiYuan" placeholder="请填写学员来源" />
          </el-form-item>
        </div>
        <div class="between-center">
          <el-form-item label="招生老师">
            <el-input v-model="stuStatusRowData.PlatformWorkerLabel" disabled placeholder="请填写招生老师" />
          </el-form-item>
          <el-form-item label="签单时间">
            <el-date-picker
              v-model="stuStatusRowData.AddTime"
              class="changInputWidth"
              type="date"
              value-format="timestamp"
              placeholder="请选择签单时间"
            />
          </el-form-item>
        </div>
        <div class="between-center">
          <el-form-item label="实缴学费" class="flex_1">
            <el-input v-model="stuStatusRowData.ShijiPrice" placeholder="请填写实缴学费" />
          </el-form-item>
          <el-form-item label="是否托管" class="flex_1 m-l-40">
            <el-radio v-model="stuStatusRowData.ShiFouTuoGuan" label="是">是</el-radio>
            <el-radio v-model="stuStatusRowData.ShiFouTuoGuan" label="否">否</el-radio>
          </el-form-item>
        </div>
        <p class="font-w6 color-2e77f8 p-b-10 border-b-e5ecf7 m-b-20">通讯信息</p>
        <div class="between-center">
          <el-form-item label="联系电话">
            <el-input v-model="stuStatusRowData.Telephone" placeholder="请填写联系电话" />
          </el-form-item>
          <el-form-item label="亲属关系">
            <el-input v-model="stuStatusRowData.Friends" placeholder="请填写亲属关系" />
          </el-form-item>
        </div>
        <div class="between-center">
          <el-form-item label="电子邮箱">
            <el-input v-model="stuStatusRowData.Email" placeholder="请填写邮箱" />
          </el-form-item>
          <el-form-item label="常用QQ">
            <el-input v-model="stuStatusRowData.QQ" placeholder="请填写QQ号" />
          </el-form-item>
        </div>
        <div class="between-center">
          <el-form-item label="备用联系">
            <el-input v-model="stuStatusRowData.BeiyongTel" placeholder="请填写备用电话" />
          </el-form-item>
          <el-form-item label="微信号码">
            <el-input v-model="stuStatusRowData.Weichat" placeholder="请填写微信号码" />
          </el-form-item>
        </div>

        <el-form-item label="户籍所在地" label-width="85px">
          <el-input v-model="stuStatusRowData.Huji" placeholder="请填写户籍地址" />
        </el-form-item>
        <el-form-item label="收件人地址" label-width="85px">
          <el-input v-model="stuStatusRowData.Address" placeholder="请填写收件人地址" />
        </el-form-item>
        <p class="font-w6 color-2e77f8 p-b-10 border-b-e5ecf7 m-b-20">报名材料</p>
        <div class="flex_item_around flex_dom">
          <!-- 上传身份证正面 -->
          <div class="wid90 uploadImg">
            <my-image
              v-if="BaoMingImg.cardzm"
              class="avatar"
              :preview-src-list="[BaoMingImg.cardzm]"
              :src="BaoMingImg.cardzm"
              fit="cover"
            />
            <i v-if="!BaoMingImg.cardzm" class="el-icon-plus avatar-uploader-icon" />
            <p class="text-center color-666 font14 m-t-5">身份证正面</p>
            <el-upload
              :auto-upload="false"
              action
              class="text-center color-2e77f8"
              :show-file-list="false"
              :on-change="uploadcardzm"
            >
              <p
                v-if="operationType!=-1"
                class="color-2e77f8 font14 text-center m-t-5 cursor"
              >{{ BaoMingImg.cardzm?'重新上传':'上传' }}</p>
            </el-upload>
          </div>

          <!-- 上传身份证反面 -->
          <div class="wid90 uploadImg">
            <my-image
              v-if="BaoMingImg.cardfm"
              class="avatar"
              :preview-src-list="[BaoMingImg.cardfm]"
              :src="BaoMingImg.cardfm"
              fit="cover"
            />
            <i v-if="!BaoMingImg.cardfm" class="el-icon-plus avatar-uploader-icon" />
            <p class="text-center color-666 font14 m-t-5">身份证反面</p>
            <el-upload
              :auto-upload="false"
              class="text-center"
              action
              :show-file-list="false"
              :on-change="uploadcardfm"
            >
              <p
                v-if="operationType!=-1"
                class="color-2e77f8 font14 text-center m-t-5 cursor"
              >{{ BaoMingImg.cardfm?'重新上传':'上传' }}</p>
            </el-upload>
          </div>
          <!-- 前置学历照片 -->
          <div class="wid90 uploadImg">
            <my-image
              v-if="BaoMingImg.qzxl"
              class="avatar"
              :preview-src-list="[BaoMingImg.qzxl]"
              :src="BaoMingImg.qzxl"
              fit="cover"
            />
            <i v-if="!BaoMingImg.qzxl" class="el-icon-plus avatar-uploader-icon" />
            <p class="text-center color-666 font14 m-t-5">前置学历</p>
            <el-upload
              :auto-upload="false"
              class="text-center"
              action
              :show-file-list="false"
              :on-change="uploadqzxl"
            >
              <p
                v-if="operationType!=-1"
                class="color-2e77f8 font14 m-t-5 cursor"
              >{{ BaoMingImg.qzxl?'重新上传':'上传' }}</p>
            </el-upload>
          </div>
          <!-- 报名确认书照片 -->
          <div class="wid90 uploadImg">
            <my-image
              v-if="BaoMingImg.bmqrs"
              class="avatar"
              :preview-src-list="[BaoMingImg.bmqrs]"
              :src="BaoMingImg.bmqrs"
              fit="cover"
            />
            <i v-if="!BaoMingImg.bmqrs" class="el-icon-plus avatar-uploader-icon" />
            <p class="text-center color-666 font14 m-t-5">报名确认书</p>
            <el-upload
              :auto-upload="false"
              class="text-center"
              action
              :show-file-list="false"
              :on-change="uploadbmqrs"
            >
              <p
                v-if="operationType!=-1"
                class="color-2e77f8 font14 m-t-5 text-center cursor"
              >{{ BaoMingImg.bmqrs?'重新上传':'上传' }}</p>
            </el-upload>
          </div>
          <!-- 2寸蓝底照片 -->
          <div class="wid90 uploadImg">
            <my-image
              v-if="BaoMingImg.ldzp"
              class="avatar"
              :preview-src-list="[BaoMingImg.ldzp]"
              :src="BaoMingImg.ldzp"
              fit="cover"
            />
            <i v-if="!BaoMingImg.ldzp" class="el-icon-plus avatar-uploader-icon" />
            <p class="text-center color-666 font14 m-t-5">2寸蓝底照片</p>
            <el-upload
              :auto-upload="false"
              class="text-center"
              action
              :show-file-list="false"
              :on-change="uploadldzp"
            >
              <p
                v-if="operationType!=-1"
                class="color-2e77f8 font14 m-t-5 text-center cursor"
              >{{ BaoMingImg.ldzp?'重新上传':'上传' }}</p>
            </el-upload>
          </div>
          <!-- 学籍备案表照片 -->
          <div class="wid90 uploadImg">
            <my-image-viewer
              v-if="BaoMingImg.xjbab"
              class="avatar"
              :preview-src-list="[BaoMingImg.xjbab]"
              :src="BaoMingImg.xjbab"
              fit="cover"
            />
            <i v-if="!BaoMingImg.xjbab" class="el-icon-plus avatar-uploader-icon" />
            <p class="text-center color-666 font14 m-t-5">学籍备案表</p>
            <el-upload
              :auto-upload="false"
              action
              class="text-center"
              :show-file-list="false"
              :on-change="uploadxjbab"
            >
              <p
                v-if="operationType!=-1"
                class="color-2e77f8 font14 text-center m-t-5 cursor"
              >{{ BaoMingImg.xjbab?'重新上传':'上传' }}</p>
            </el-upload>
          </div>
        </div>
      </el-form>
    </div>
    <div class="around-center hgt60 bge0e3ea">
      <div v-if="operationType!=-1">
        <el-button @click="showStuStatusDialog=false">取 消</el-button>
        <el-button type="primary" class="m-l-40" @click="saveStuStatus">保 存</el-button>
      </div>
      <div v-if="operationType==-1">
        <el-button @click="showStuStatusDialog=false">关 闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import { 
  getStudentStatusSubject,
  getStudentScore
} from "@/api/custom";  
import {
  UploadImgExercise,
  UploadImgCourse,
  UploadImgContract,
  UploadAddCustom,
  UploadClassTimeTagImg,
  UploadImgClass,
  UploadImgNews,
  UploadImgCourseTravelBrochure,
  UploadImgCustomTrack,
  UploadImgStudentStatus
} from "@/api/upload"; 
export default {
  components: {
    myImageViewer
  },
  data() {
    return {
      // 控制学籍的弹出框
      showStuStatusDialog: false,
      // 学籍的表单数据
      stuStatusRowData: {},
      // 操作类型1添加，0编辑，-1查看
      operationType: null,
      // 照片
      Picture: "",
      // 报名照片
      BaoMingImg: {
        // 身份证正面
        cardzm: "",
        // 身份证反面
        cardfm: "",
        // 前置学历
        qzxl: "",
        // 报名材料书
        bmqrs: "",
        // 蓝底照片
        ldzp: "",
        // 学籍报名书
        xjbab: ""
      }
    };
  },
  mounted() {},
  methods: {
    getStuStatusFormData(rowData, type) {
      // 初始化数据
      this.stuStatusRowData = { ...rowData };
      this.operationType = type;
      this.Picture = "";
      this.BaoMingImg = {
        cardzm: "",
        cardfm: "",
        qzxl: "",
        bmqrs: "",
        ldzp: "",
        xjbab: ""
      };
      if (type == 1) {
        this.stuStatusRowData.PlatformWorkerID = this.$store.state.userInformation.Id;
        this.stuStatusRowData.PlatformWorkerLabel = this.$store.state.userInformation.Realname;
      }
      if (type == 0 || type == -1) {
        if (this.stuStatusRowData.AddTime) {
          this.stuStatusRowData.AddTime = this.stuStatusRowData.AddTime * 1000;
        } else {
          this.stuStatusRowData.AddTime = null;
        }
        this.stuStatusRowData.UniversityLabel = "";
        if (this.stuStatusRowData.BaomingCailiao) {
          this.BaoMingImg = JSON.parse(this.stuStatusRowData.BaomingCailiao);
        }
        this.Picture = this.stuStatusRowData.Picture;
      }
      if (this.stuStatusRowData.RegisterTime) {
        this.stuStatusRowData.RegisterTime =
          this.stuStatusRowData.RegisterTime * 1000;
      } else {
        this.stuStatusRowData.RegisterTime = null;
      }
      this.showStuStatusDialog = true;
    },
    // 上传学生照片
    async uploadPicture(file) {
      const res = await UploadImgStudentStatus(file.raw);
      if (res.code == 200) {
        this.Picture = res.data;
      }
    },
    // 身份证正面
    async uploadcardzm(file) {
      const res = await UploadImgStudentStatus(file.raw);
      if (res.code == 200) {
        this.BaoMingImg.cardzm = res.data;
      }
    },
    // 身份证反面
    async uploadcardfm(file) {
      const res = await UploadImgStudentStatus(file.raw);
      if (res.code == 200) {
        this.BaoMingImg.cardfm = res.data;
        console.log(this.BaoMingImg.cardfm);
      }
    },
    // 前置学历
    async uploadqzxl(file) {
      const res = await UploadImgStudentStatus(file.raw);
      if (res.code == 200) {
        this.BaoMingImg.qzxl = res.data;
      }
    },
    // 报名材料书
    async uploadbmqrs(file) {
      const res = await UploadImgStudentStatus(file.raw);
      if (res.code == 200) {
        this.BaoMingImg.bmqrs = res.data;
      }
    },
    // 蓝底照片
    async uploadldzp(file) {
      const res = await UploadImgStudentStatus(file.raw);
      if (res.code == 200) {
        this.BaoMingImg.ldzp = res.data;
      }
    },
    // 学籍报名书
    async uploadxjbab(file) {
      const res = await UploadImgStudentStatus(file.raw);
      if (res.code == 200) {
        this.BaoMingImg.xjbab = res.data;
      }
    },
    // 保存学籍表单数据
    async saveStuStatus() {
      this.stuStatusRowData.Picture = this.Picture;
      this.stuStatusRowData.BaomingCailiao = JSON.stringify(this.BaoMingImg);
      if (this.stuStatusRowData.AddTime) {
        this.stuStatusRowData.AddTime = parseInt(
          this.stuStatusRowData.AddTime / 1000
        );
      } else {
        this.stuStatusRowData.AddTime = null;
      }
      if (this.stuStatusRowData.RegisterTime) {
        this.stuStatusRowData.RegisterTime = parseInt(
          this.stuStatusRowData.RegisterTime / 1000
        );
      } else {
        this.stuStatusRowData.RegisterTime = null;
      }
      this.stuStatusRowData.ShijiPrice = parseInt(
        this.stuStatusRowData.ShijiPrice
      );
      if (this.operationType == 1) {
        const res = await addStudentStatus(
          this.stuStatusRowData
        );
        if (res.code == 200) {
          this.common.go_alert("添加成功 !");
          this.$emit("subClick", 1, res.data);
          this.showStuStatusDialog = false;
        }
      }
      if (this.operationType == 0) {
        const res = await editStudentStatus(
          this.stuStatusRowData.Id,
          this.stuStatusRowData
        );
        if (res.code == 200) {
          this.common.go_alert("修改成功 !");
          this.$emit("subClick", 0, res.data);
          this.showStuStatusDialog = false;
        }
      }
    }
  }
};
</script> 
<style scoped>
.studentstatusform /deep/ .changInputWidth {
  width: 200px;
}
.titleLabel {
  font-size: 14px;
  color: #606266;
  width: 70px;
  margin-right: 10px;
}
.studentstatusform /deep/ .el-input__inner {
  height: 35px;
  line-height: 35px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 88px;
  height: 118px;
  line-height: 118px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
.avatar {
  width: 90px;
  height: 120px;
  display: block;
}
</style>
