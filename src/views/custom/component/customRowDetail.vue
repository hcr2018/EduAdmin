<template>
  <div>
    <myImageViewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <el-form
      ref="refCustomInfo"
      :disabled="currenteditEnable==false"
      :model="currentItemData"
      :rules="customInfoRules"
      style="padding:10px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <el-form-item label="客户姓名" prop="Realname" class="flex_1">
        <div class="flex_dom">
          <el-input v-model="currentItemData.Realname" placeholder="请输入客户姓名" />
          <el-select v-model="currentItemData.Sex" style="width:140px" placeholder="性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="客户电话" prop="Telephone" class="flex_1">
        <el-input
          v-model="currentItemData.Telephone"
          :disabled="currentItemData.id>0"
          placeholder="请输入客户电话"
          @blur="checkRepeatPhone"
        />
      </el-form-item>
      <el-form-item label="初始密码" prop="fistPswd">
        <el-input v-model="customPassword" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="重复密码" prop="rePassword">
        <el-input v-model="rePassword" placeholder="请再次输入密码" />
      </el-form-item>
      <el-form-item label="身份证" prop="Idcard">
        <el-input v-model="currentItemData.Idcard" placeholder="请输入客户身份证" />
      </el-form-item>
      <el-form-item label="客户微信">
        <el-input v-model="currentItemData.Wechat" placeholder="请输入客户微信号" />
      </el-form-item>
      <el-form-item label="图片">
        <div class="flex_dom flex_wrap">
          <div v-for="(item,index) in customImgArr" :key="index" class="relative marg15">
            <div
              v-show="currentItemData.id<=0"
              class="deleImgIcon cursor"
              @click="deleCustomImg(index)"
            >
              <img class="wid20" src="/assets/slice/deleteIcon.png" @click="onPreview(item)" />
            </div>
          </div>
          <el-upload
            v-show="currentItemData.id<=0"
            :auto-upload="false"
            action
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="uploadCustomImg"
          >
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="客户QQ" prop="Qq">
        <el-input v-model="currentItemData.Qq" placeholder="请输入客户QQ号" />
      </el-form-item>
      <el-form-item label="当前学历">
        <el-select v-model="currentItemData.Education" placeholder="请选择学历">
          <el-option
            v-for="(item,index) in educationallevel"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="意向情况">
        <el-select v-model="currentItemData.Kind" placeholder="请选择意向情况">
          <el-option
            v-for="(item) in common.IntentionalCustomerType"
            v-show="item.value!=-1"
            :key="item.value"
            :label="item.Label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="意向课程">
        <el-select v-model="currentItemData.FocusCourse" placeholder="请选择意向课程">
          <el-option
            v-for="(item) in $store.getters.app.courseKindList"
            :key="item.Id"
            :label="item.Label"
            :value="item.Label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道来源">
        <el-select
          v-model="currentItemData.FromLabel"
          :disabled="currentItemData.id>0"
          placeholder="请选择渠道来源"
        >
          <el-option
            v-for="(item,index) in common.channelList"
            :key="index"
            :label="item.Label"
            :value="item.Label"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属校区" prop="Platform">
        <el-select
          v-model="currentItemData.Platform"
          :disabled="$route.query.id?true:false"
          placeholder="请选择所属校区"
        >
          <el-option
            v-for="(platform) in $store.getters.app.platformList"
            v-show="platform.Id!=0"
            :key="platform.Id"
            :label="platform.Label"
            :value="platform.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="管理员">
        <el-input v-model="currentItemData.ManagerLabel" disabled />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="currentItemData.Description"
          type="textarea"
          :rows="3"
          placeholder="客户描述~"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="currentItemData.Comments" type="textarea" :rows="3" placeholder="客户备注~" />
      </el-form-item>
    </el-form>
    <div class="around-center hgt60">
      <div>
        <el-button
          type="warning"
          :disabled="false"
          v-show="!currenteditEnable"
          class="m-l-40"
          @click="currenteditEnable=true"
        >编辑</el-button>
        <el-button
          type="primary"
          :disabled="false"
          v-show="currenteditEnable"
          class="m-l-40"
          @click="saveFormItemData"
        >确 认</el-button>

        <el-button v-show="currenteditEnable" @click="currenteditEnable=false">取 消</el-button>
        <!-- <el-button
          type="danger"
          v-show="currentItemData.id>0"
          @click="resetCustomPassword(currentItemData.id)"
        >重置密码</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import common from "@/utils/common";
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
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import crypto from "crypto";
export default {
  name: "PlatformForm",
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
  components: {
    myImageViewer
  },
  data() {
    return {
      common,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      currentItemData: {},
      currenteditEnable: this.editEnable,
      // 表单验证规则
      customInfoRules: {
        Realname: [
          { required: true, message: "请输入客户姓名", trigger: "blur" }
        ],
 
        rePassword: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.rePassword === "") {
                callback(new Error("请再次输入密码"));
              } else if (this.rePassword !== this.customPassword) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
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
          { required: true, message: "必须选择一个校区", trigger: "blur" }
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
      platformTeacherOptions: [],
      // 输入的 密码
      customPassword: "",
      //重复输入的验证密码
      rePassword: ""
    };
  },
  watch: {
    formItemData(newvar) {
      this.currentItemData = this.formItemData;
      if (this.currentItemData.Info && this.currentItemData.Info.attach_image) {
        const info = JSON.parse(this.currentItemData.Info);
        if (info.attach_image) {
          this.customImgArr = info.attach_image.split(",");
        }
      }
    }
  },

  mounted() {
    this.currentItemData = this.formItemData;
  },
  methods: {
    // 图片预览
    onPreview(src) {
      this.showViewer = true;
      this.imageViewerSrc = src;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
    // 重置客户密码
    resetCustomPassword(studentid) {
      const that = this;
      that
        .$confirm("确认重置该账户密码?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          const res = await resetCustomPassword(studentid);
          if (res.code == 200) {
            that.$alert("当前密码是:" + res.title, "密码", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(() => {});
    },
    // 检查电话号码是否重复
    async checkRepeatPhone() {
      if (this.currentItemData.Telephone.length == 11) {
        const res = await checkTelephone(this.currentItemData.Telephone);
        if (res.code == 200) {
          if (res.data && res.title != "ok") {
            const mes = `<span class='color-1890ff'>${res.title}${res.data.ManagerLabel}</span>的客户<span class='color-1890ff'>${res.data.Realname}</span>已使用过该号码哦！`;
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
      const res = await UploadAddCustom("", "", file.raw);
      if (res.code == 200) {
        this.$message("上传成功！");
        this.customImgArr.push(res.data);
      }
    },
    // 删除客户资料的图片
    deleCustomImg(index) {
      this.customImgArr.splice(index, 1);
    },

    // 保存客户信息
    async saveFormItemData() {
      this.$refs.refCustomInfo.validate(async valid => {
        if (valid) {
          this.currentItemData.MasterID = this.masterID;
          const md5 = crypto.createHash("md5");
          md5.update(this.customPassword);
          this.currentItemData.Password = md5.digest("hex");

          if (this.currentItemData.id == null || this.currentItemData.id == 0) {
            // 新增
            let res = await addCustomInfo("", "", this.currentItemData);
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.currentItemData = res.data;
              this.$alert("添加成功.密码是:" + res.title, "密码", {
                confirmButtonText: "确定"
              });
              // this.$message({
              //   message: "添加成功",
              //   type: "success"
              // });
            }
          } else {
            // 修改
            let res = await editCustomInfo("", "", this.currentItemData);
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
            }
          }
        } else {
          this.$message({
            message: "请完善表单",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
