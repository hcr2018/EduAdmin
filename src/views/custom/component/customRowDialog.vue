<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showCustomDialog"
    width="740px"
    :title="customInfo.id>0?'编辑客户':'新增客户'"
  >
    <div class="basicInfo">
      <el-form
        :model="customInfo"
        :rules="customInfoRules"
        label-width="100px"
        ref="refCustomInfo"
        size="small"
        class="dialog-body-pad"
      >
        <div class="between-center">
          <el-form-item label="客户姓名" prop="Realname" class="flex_1">
            <el-input v-model="customInfo.Realname" placeholder="请输入客户姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="Sex" class="flex_1">
            <el-select v-model="customInfo.Sex" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="customInfo.id>0">
            <el-button type="danger" @click="resetCustomPassword(customInfo.id)">重置密码</el-button>
          </el-form-item>
        </div>
        <el-form-item label="客户电话" prop="Telephone" class="flex_1">
          <el-input
            :disabled="customInfo.id>0"
            v-model="customInfo.Telephone"
            @blur="checkRepeatPhone"
            \placeholder="请输入客户电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="Idcard">
          <el-input v-model="customInfo.Idcard" placeholder="请输入客户身份证"></el-input>
        </el-form-item>
        <el-form-item label="客户微信">
          <el-input v-model="customInfo.Wechat" placeholder="请输入客户微信号"></el-input>
        </el-form-item>
        <el-form-item label="图片类型">
          <div class="flex_dom flex_wrap">
            <div class="relative marg15" v-for="(item,index) in customImgArr" :key="index">
              <my-image-viewer class="wid80 hgt80" :preview-src-list="[item]" :src="item" fit="cover"></my-image-viewer>
              <div
                class="deleImgIcon cursor"
                v-show="customInfo.id<=0"
                @click="deleCustomImg(index)"
              >
                <img src="/static/img/slice/deleteIcon.png" alt />
              </div>
            </div>
            <el-upload
              :auto-upload="false"
              action
              class="avatar-uploader"
              v-show="customInfo.id<=0"
              :show-file-list="false"
              :on-change="uploadCustomImg"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="客户QQ" prop="Qq">
          <el-input v-model="customInfo.Qq" placeholder="请输入客户QQ号"></el-input>
        </el-form-item>
        <el-form-item label="当前学历">
          <el-select v-model="customInfo.Education" placeholder="请选择学历">
            <el-option
              :label="item"
              :key="index"
              :value="item"
              v-for="(item,index) in educationallevel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意向情况">
          <el-select v-model="customInfo.Kind" placeholder="请选择意向情况">
            <el-option
              :label="item.Label"
              v-show="item.value!=-1"
              :key="item.value"
              :value="item.value"
              v-for="(item) in common.IntentionalCustomerType"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意向课程">
          <el-select v-model="customInfo.FocusCourse" placeholder="请选择意向课程">
            <el-option
              :label="item.Label"
              :key="item.Id"
              :value="item.Label"
              v-for="(item) in common.courseKindList"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道来源">
          <el-select
            v-model="customInfo.FromLabel"
            :disabled="customInfo.id>0"
            @change="inputForceUpdate"
            placeholder="请选择渠道来源"
          >
            <el-option
              v-for="(item,index) in common.channelList"
              :label="item.Label"
              :key="index"
              :value="item.Label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属站点" prop="Platform">
          <el-select
            v-model="customInfo.Platform"
            :disabled="this.$route.query.id?true:false"
            @change="$forceUpdate()"
            placeholder="请选择所属站点"
          >
            <el-option
              v-show="item.Id!=0"
              :label="item.Label"
              :key="item.Id"
              :value="item.Id"
              v-for="(item) in common.platformList"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员">
          <el-input v-model="customInfo.ManagerLabel" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            :rows="3"
            v-model="customInfo.Description"
            @input="inputForceUpdate()"
            placeholder="客户描述~"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="3"
            v-model="customInfo.Comments"
            @input="inputForceUpdate()"
            placeholder="客户备注~"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="showCustomDialog=false">取 消</el-button>
          <el-button type="primary m-l-40" @click="saveCustomInfo">保 存</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
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
  batchChangeManager,
  getStudentStatustByStudent
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
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import common from "@/utils/common";
export default {
  components: {
    myImageViewer
  },
  data() {
    return {
      common,
      // 是否显示客户模态框
      showCustomDialog: false,
      // 表单数据
      customInfo: {},
      // 表单验证规则
      customInfoRules: {
        Realname: [
          { required: true, message: "请输入客户姓名", trigger: "blur" }
        ],
        Qq: [
          {
            pattern: /^[0-9]*$/,
            message: "QQ号必须为数字值",
            trigger: "blur"
          }
        ],
        Sex: [{ required: true, message: "请选择客户性别", trigger: "blur" }],
        Telephone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^\d{11}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        Platform: [
          { required: true, message: "必须选择一个站点", trigger: "blur" }
        ]
      },
      // 学历选择
      educationallevel: [
        "高中及以下",
        "大学专科",
        "大学本科",
        "研究生及以上",
        "学历不详"
      ],
      // 创建日期的字段
      createTime: "",
      // 存放客户图片的数组
      customImgArr: [],
      // 存放平台老师的的数组
      platformTeacherOptions: []
    };
  },

  methods: {
    // 获取客户的单条数据
    getCustomRowData(row) {
      this.showCustomDialog = true;
      this.customImgArr = [];
      this.customInfo = {};
      this.customInfo = { ...row };
      if (this.customInfo.id > 0) {
        if (this.customInfo.Info) {
          let info = JSON.parse(this.customInfo.Info);
          if (info.attach_image) {
            this.customImgArr = info.attach_image.split(",");
          }
        }
      } else {
        if (this.$route.query.id) {
          this.customInfo.Platform = parseInt(this.$route.query.id);
        }
        this.customInfo.ManagerID = this.$store.state.userInformation.Id;
        this.customInfo.ManagerLabel = this.$store.state.userInformation.Realname;
      }
    },

    // 重置客户密码
    resetCustomPassword(studentid) {
      let that = this;
      that
        .$confirm("确认重置该账户密码?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          let res = await resetCustomPassword(studentid);
          if (res.code == 200) {
            that.$alert("当前密码是:" + res.title, "密码", {
              confirmButtonText: "确定",
              callback: action => {
                that.$set(that.customTableDataList, index, res.data);
              }
            });
          }
        })
        .catch(() => {});
    },
    // 检查电话号码是否重复
    async checkRepeatPhone() {
      if (this.customInfo.Telephone.length == 11) {
        let res = await checkTelephone(this.customInfo.Telephone);
        if (res.code == 200) {
          if (res.data && res.title != "ok") {
            let mes = `<span class='color-2e77f8'>${res.title}${res.data.ManagerLabel}</span>的客户<span class='color-2e77f8'>${res.data.Realname}</span>已使用过该号码哦！`;
            this.$alert(mes, "提示", {
              confirmButtonText: "确定",
              type: "warning",
              dangerouslyUseHTMLString: true,
              callback: action => {}
            });
          }
        }
      }
    },
    // 客户资料图片上传
    async uploadCustomImg(file) {
      let res = await UploadAddCustom(file.raw);
      if (res.code == 200) {
        this.common.go_alert("上传成功！");
        this.customImgArr.push(res.data);
      }
    },
    // 删除客户资料的图片
    deleCustomImg(index) {
      this.customImgArr.splice(index, 1);
    },
    // 保存客户信息
    saveCustomInfo() {
      let that = this;
      this.$refs["refCustomInfo"].validate(async valid => {
        if (valid) {
          if (that.customInfo.id == 0) {
            // 新增
            that.customInfo.kind = 3;
            if (this.customImgArr.length > 0) {
              this.customInfo.Info = {};
              this.customInfo.Info.attach_image = this.customImgArr.join(",");
              this.customInfo.Info = JSON.stringify(this.customInfo.Info);
            }
            let res = await addCustomInfo(that.customInfo);
            if (res.code == 200) {
              that.common.go_alert("添加成功 !");
              // 添加成功之后要触发父组件信息列表修改
              that.$emit("subClickEvent", 1, res.data);
              this.showCustomDialog = false;
            }
          } else {
            // 修改
            this.customInfo.info = JSON.stringify(this.customInfo.info);
            let res = await editCustomInfo(that.customInfo);
            if (res.code == 200) {
              that.common.go_alert("修改成功");
              that.customInfo = res.data;
              // 修改成功之后要触发父组件信息列表修改
              that.$emit("subClickEvent", 0, res.data);
              this.showCustomDialog = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    // 强制刷新
    inputForceUpdate() {
      this.$forceUpdate();
    }
  },
  mounted() {}
};
</script> 
<style scoped>
.basicInfo >>> .el-select {
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
</style>