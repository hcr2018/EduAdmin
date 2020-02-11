<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowChangeManagerDialog"
    width="740px"
    title="批量移交学员"
  >
    <div class="alarmFormCss">
      <el-form ref="refAlarmForm" class="dialog-body-pad" label-width="100px">
        <el-form-item label="目标学院">
          <el-select
            v-model="targetPlatform"
            placeholder="请选择"
            @change="$forceUpdate();getTeacherOfPlatform()"
          >
            <el-option
              v-for="(item) in $store.getters.app.platformList"
              v-show="item.Id!=0"
              :key="item.Id"
              :label="item.Label"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标人员">
          <el-select v-model="targetManagerID" placeholder="请选择管理员">
            <el-option
              v-for="(item) in platformTeacherOptions"
              :key="item.Id"
              :label="item.Realname"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="isShowChangeManagerDialog=false">取 消</el-button>
          <el-button type="primary" class="m-l-40" @click="changeManager">确 认</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  batchChangeManager
} from '@/api/custom'
import { getPlatformTeacher } from '@/api/manager'
import common from '@/utils/common'
export default {
  name: '',
  data() {
    return {
      common,
      // 控制改变管理员的表单
      isShowChangeManagerDialog: false,
      // 跟进提醒的表单数据
      targetPlatform: null,
      // 存放平台老师的的数组
      platformTeacherOptions: [],
      // 目标人员id
      targetManagerID: '',
      // 转移客户的ID
      customIds: []
    }
  },
  mounted() {},
  methods: {
    // 获取学员Id
    getCustomIds(Ids) {
      this.targetPlatform = this.$store.state.userInformation.Platform
      if (this.targetPlatform == 0) {
        this.targetPlatform = this.$store.getters.app.platformList[0].Id
      }
      this.platformTeacherOptions = []
      this.customIds = []
      this.targetManagerID = ''
      this.customIds = [...Ids]
      this.getTeacherOfPlatform()
      this.isShowChangeManagerDialog = true
    },
    // 获取平台老师
    async getTeacherOfPlatform() {
      this.platformTeacherOptions = []
      const res = await getPlatformTeacher({
        platform: this.targetPlatform
      })
      if (res.code == 200) {
        this.platformTeacherOptions = res.data
      }
    },
    // 保存转移学生的提醒
    async changeManager() {
      const res = await batchChangeManager(
        this.targetPlatform + '/' + this.targetManagerID,
        this.customIds
      )
      if (res.code == 200) {
        this.isShowChangeManagerDialog = false
        this.$message('转移成功！')
        this.$emit('subClickEvent', res.data)
      }
    }
  }
}
</script>
<style scoped>
.alarmFormCss >>> .el-select {
  width: 100%;
}
.alarmFormCss >>> .el-date-editor {
  width: 100%;
}
</style>
