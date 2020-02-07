<template>
  <div>
    <el-form
      ref="refCustomInfo"
      :model="formItemData"
      :rules="customInfoRules"
      style="padding:10px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <div class="between-center">
        <el-form-item label="客户姓名" prop="Realname" class="flex_1">
          <el-input v-model="formItemData.Realname" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="Sex" class="flex_1">
          <el-select v-model="formItemData.Sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="客户电话" prop="Telephone" class="flex_1">
        <el-input
          v-model="formItemData.Telephone"
          :disabled="formItemData.id>0"
          \placeholder="请输入客户电话"
          @blur="checkRepeatPhone"
        />
      </el-form-item>
      <el-form-item label="身份证" prop="Idcard">
        <el-input v-model="formItemData.Idcard" placeholder="请输入客户身份证" />
      </el-form-item>
      <el-form-item label="客户微信">
        <el-input v-model="formItemData.Wechat" placeholder="请输入客户微信号" />
      </el-form-item>
      <el-form-item label="图片类型">
        <div class="flex_dom flex_wrap">
          <div v-for="(item,index) in customImgArr" :key="index" class="relative marg15">
            <my-image-viewer
              class="wid80 hgt80"
              :preview-src-list="[item]"
              :src="item"
              fit="cover"
            />
            <div
              v-show="formItemData.id<=0"
              class="deleImgIcon cursor"
              @click="deleCustomImg(index)"
            >
              <img src="/static/img/slice/deleteIcon.png" alt />
            </div>
          </div>
          <el-upload
            v-show="formItemData.id<=0"
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
        <el-input v-model="formItemData.Qq" placeholder="请输入客户QQ号" />
      </el-form-item>
      <el-form-item label="当前学历">
        <el-select v-model="formItemData.Education" placeholder="请选择学历">
          <el-option
            v-for="(item,index) in educationallevel"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="意向情况">
        <el-select v-model="formItemData.Kind" placeholder="请选择意向情况">
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
        <el-select v-model="formItemData.FocusCourse" placeholder="请选择意向课程">
          <el-option
            v-for="(item) in common.courseKindList"
            :key="item.Id"
            :label="item.Label"
            :value="item.Label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道来源">
        <el-select
          v-model="formItemData.FromLabel"
          :disabled="formItemData.id>0"
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
          v-model="formItemData.Platform"
          :disabled="this.$route.query.id?true:false"
          placeholder="请选择所属校区"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="(item) in common.platformList"
            v-show="item.Id!=0"
            :key="item.Id"
            :label="item.Label"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="管理员">
        <el-input v-model="formItemData.ManagerLabel" disabled />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="formItemData.Description"
          type="textarea"
          :rows="3"
          placeholder="客户描述~" 
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="formItemData.Comments"
          type="textarea"
          :rows="3"
          placeholder="客户备注~" 
        />
      </el-form-item>
    </el-form>
    <div class="around-center hgt60 bge0e3ea">
      <div>
        <el-button @click="showCustomDialog=false">取 消</el-button>
        <el-button type="primary m-l-40" @click="saveFormItemData">保 存</el-button>

        <el-button
          type="danger"
          v-show="formItemData.id>0"
          @click="resetCustomPassword(formItemData.id)"
        >重置密码</el-button>
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
  data() {
    return {
      common,
      currenteditEnable: this.editEnable,
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
      platformTeacherOptions: []
    };
  },
  mounted() {},
  methods: {
    // 重置客户密码
    resetCustomPassword(studentid) {
      const that = this
      that
        .$confirm('确认重置该账户密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async() => {
          const res = await resetCustomPassword(studentid)
          if (res.code == 200) {
            that.$alert('当前密码是:' + res.title, '密码', {
              confirmButtonText: '确定',
              callback: action => {
                that.$set(that.customTableDataList, index, res.data)
              }
            })
          }
        })
        .catch(() => {})
    },
    // 检查电话号码是否重复
    async checkRepeatPhone() {
      if (this.customInfo.Telephone.length == 11) {
        const res = await checkTelephone(this.customInfo.Telephone)
        if (res.code == 200) {
          if (res.data && res.title != 'ok') {
            const mes = `<span class='color-1890ff'>${res.title}${res.data.ManagerLabel}</span>的客户<span class='color-1890ff'>${res.data.Realname}</span>已使用过该号码哦！`
            this.$alert(mes, '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              dangerouslyUseHTMLString: true,
              callback: action => {}
            })
          }
        }
      }
    },
    // 客户资料图片上传
    async uploadCustomImg(file) {
      const res = await UploadAddCustom('', '', file.raw)
      if (res.code == 200) {
        this.common.go_alert('上传成功！')
        this.customImgArr.push(res.data)
      }
    },
    // 删除客户资料的图片
    deleCustomImg(index) {
      this.customImgArr.splice(index, 1)
    }, 


    // 保存客户信息
    async saveFormItemData() {
      this.$refs.formUI.validate(async valid => {
        if (valid) {
          this.formItemData.MasterID = this.masterID;
          if (this.formItemData.Id == null || this.formItemData.Id == 0) {
            // 新增
            let res = await addCustomInfo("", "", this.formItemData);
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.formItemData = res.data;
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
          } else {
            // 修改
            let res = await editCustomInfo(
              this.formItemData.Id,
              "",
              this.formItemData
            );
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
            }
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
