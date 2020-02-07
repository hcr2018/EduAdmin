<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showCustomDialog"
    width="740px"
    :title="customInfo.id>0?'编辑客户':'新增客户'"
  >
     
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
} from '@/api/custom'

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
} from '@/api/upload'
import myImageViewer from '@/components/myImageViewer/myImageViewer'
import common from '@/utils/common'
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
     
    }
  },
  mounted() {},

  methods: {
    // 获取客户的单条数据
    getCustomRowData(row) {
      this.showCustomDialog = true
      this.customImgArr = []
      this.customInfo = {}
      this.customInfo = row
      if (this.customInfo.id > 0) {
        if (this.customInfo.Info) {
          const info = JSON.parse(this.customInfo.Info)
          if (info.attach_image) {
            this.customImgArr = info.attach_image.split(',')
          }
        }
      } else {
        if (this.$route.query.id) {
          this.customInfo.Platform = parseInt(this.$route.query.id)
        }
        this.customInfo.ManagerID = this.$store.state.userInformation.Id
        this.customInfo.ManagerLabel = this.$store.state.userInformation.Realname
      }
    },

    
    // 强制刷新
    inputForceUpdate() {
      this.$forceUpdate()
    }
  }
}
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
