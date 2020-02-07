<template>
  <!-- --------------------成绩录入模块----------------------- -->
  <div class="p_both10 p-t-5">
    <div class="center">
      <p class="font14 color-606266">专业：</p>
      <el-select
        v-model="majorId"
        placeholder="请选择报名层次"
        :disabled="disableMajor"
        @change="changSelectMajor"
      >
        <el-option
          v-for="(item,index) in majorOptions"
          :key="index"
          :label="item.Label"
          :value="item.Id"
        />
      </el-select>
    </div>
    <div class="m-t-20">
      <p class="font16 color-1890ff border-b-e0 p-v-10 font-w6">专业科目</p>

      <div v-for="(item,itemIndex) in allSubjectList" :key="itemIndex">
        <div class="center p-v-20 border-b-e0">
          <div class="center">
            <span
              class="p_both15 m-r-10 color-fff font12 bg-1890ff inline_div hgt20 l-h-20 radius2"
            >{{ item.examType }}</span>
            <span
              v-show="item.status==1"
              class="p_both5 m-r-10 color-fff font12 bg-339967 inline_div hgt20 l-h-20 radius2"
            >考试通过</span>
            <span
              v-show="item.status==0&&item.miaoKao==0"
              class="p_both5 m-r-10 color-fff font12 bg-FB6701 inline_div hgt20 l-h-20 radius2"
            >尚未通过</span>
            <span
              v-show="item.miaoKao==1"
              class="p_both5 m-r-10 color-fff font12 bg-f31810 inline_div hgt20 l-h-20 radius2"
            >免考科目</span>
            <span>{{ item.Label }}</span>
          </div>
          <div class="flex_dom flex_wrap m_both50 flex_1">
            <div
              v-for="(scoreItem,scoreIndex) in item.scoreList"
              :key="scoreIndex"
              class="m_both10 relative m-v-5 score_item"
            >
              <div
                class="text-center hgt40 wid80 radius3"
                :class="[scoreItem.score<60?'bg-ccc':'bg-1890ff']"
              >
                <p :class="[scoreItem.score<60?'color-68':'color-fff']">{{ scoreItem.score }}分</p>
                <p
                  class="font12"
                  :class="[scoreItem.score<60?'color-80':'color-fff']"
                >{{ scoreItem.examTime }}</p>
              </div>
              <div class="deleImgIcon cursor" @click="deleScore(scoreItem,scoreIndex,itemIndex)">
                <i class="el-icon-close font14 color-fff" />
              </div>
            </div>
            <div
              v-show="item.status==0&&item.miaoKao==0"
              class="m_both10 m-v-5 bg-1890ff text-center hgt40 p_both15 radius3"
              @click="openAddScoreDialog(itemIndex)"
            >
              <i class="el-icon-plus m-v-10 font20 font-w6 color-fff" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 录入成绩模态框 -->
    <div>
      <el-dialog
        :close-on-click-modal="false"
        title="录入成绩"
        :modal-append-to-body="false"
        :visible.sync="addScoreDialog"
        width="740px"
      >
        <el-form
          ref="refScoreEntryForm"
          :model="addScoreFormData"
          :rules="scoreEntryRules"
          label-width="105px"
          size="small"
          class="dialog-body-pad entry_score"
        >
          <el-form-item label="分数" prop="score">
            <el-input v-model.number="addScoreFormData.score" placeholder="请输入分数" />
          </el-form-item>
          <el-form-item label="考试日期" prop="examTime">
            <el-date-picker
              v-model="addScoreFormData.examTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择考试日期"
            />
          </el-form-item>
        </el-form>
        <div class="around-center hgt60 bge0e3ea">
          <div>
            <el-button @click="addScoreDialog = false">取 消</el-button>
            <el-button type="primary" class="m-l-40" @click="saveScoreEntry">添 加</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getStudentScore
} from '@/api/custom'

// import $StudentStatusSubjectHttp from "@/service/StudentStatusSubjectAPI";
// import $StudentScoreHttp from "@/service/StudentScoreAPI";
export default {
  name: 'ScoreEntry',
  data() {
    return {
      // 客户的Id
      customId: null,
      // 专业的选项数据
      majorOptions: [],
      // 选中的专业的Id
      majorId: null,
      // 当有成绩是，就不能更换其他专业
      disableMajor: false,
      // 当前操作的专业的信息
      currentMajorInfo: {},
      // 专业成绩
      majorScore: {},
      // 专业下所有的科目
      allSubjectList: [],
      // 录入成绩模态框的显示或隐藏
      addScoreDialog: false,
      // 添加成绩-表单数据
      addScoreFormData: {
        // 成绩
        score: null,
        // 考试时间
        examTime: null
      },
      // 录入成绩的科目的索引
      scoreEntrySubjectIndex: null,
      // 成绩录入的表单验证
      scoreEntryRules: {
        score: [
          { required: true, message: '成绩不能为空', trigger: 'blur' },
          { pattern: /^\d/, message: '成绩必须为数字', trigger: 'blur' }
        ],
        examTime: [
          { required: true, message: '考试时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    // 父组件触发方法获取id
    getScoreEntryData(id) {
      // 初始化数据
      this.addScoreDialog = false
      this.majorId = null
      this.majorScore = {}
      this.allSubjectList = []
      this.customId = id
    },

    // 改变专业,展示科目，录成绩
    changSelectMajor(val) {
      this.currentMajorInfo = {}
      this.allSubjectList = []
      this.majorScore = {}
      this.majorOptions.forEach(item => {
        if (item.Id == val) {
          this.currentMajorInfo = { ...item }
        }
      })
      if (this.currentMajorInfo.Content) {
        this.getStuScore()
      } else {
        this.common.go_alert('该专业下没有任何科目哦，请添加科目后再操作!')
      }
    },
    // 获取学生改科目的成绩
    async getStuScore() {
      let oldSocre = {}
      const res = await getStudentScore(this.customId)
      if (res.code == 200) {
        // 第二次及以上录入成绩
        if (res.data && res.data != {} > 0) {
          this.currentMajorInfo = {}
          this.disableMajor = true
          const scorekey = Object.keys(res.data)[0]
          oldSocre = res.data[scorekey]
          this.majorId = oldSocre.StatusSubjectID
          this.majorOptions.forEach(item => {
            if (item.Id == oldSocre.StatusSubjectID) {
              this.currentMajorInfo = { ...item }
            }
          })
        } else {
          if (!this.majorId) {
            this.disableMajor = false
            // 如果第一次录入，默认选中第一个专业
            this.majorId = this.majorOptions[0].Id
            this.currentMajorInfo = this.majorOptions[0]
          }
        }
        // 不管有没有添加成绩都将科目信息重新赋值
        this.majorScore = {
          Label: this.currentMajorInfo.Label,
          UniversityLevel: this.currentMajorInfo.UniversityLevel,
          UniversityXingzhi: this.currentMajorInfo.UniversityXingzhi,
          StudentID: this.customId,
          StatusSubjectID: this.currentMajorInfo.Id
        }
        if (res.data && res.data != {} > 0) {
          this.majorScore.Id = oldSocre.Id
        }
        // 将科目直接赋值
        this.allSubjectList = JSON.parse(this.currentMajorInfo.Content)
        // 遍历科目添加其他值
        this.allSubjectList.forEach(item => {
          // 设置成绩和状态的初始值-这样后面新增的科目可以直接赋初始值
          // 添加存放成绩的数组
          item.scoreList = []
          // 添加状态，0考试没有通过，1考试通过,默认0
          item.status = 0
          // 如果已经添加成绩过则需要显示之前的成绩数据
          if (oldSocre && oldSocre.Record) {
            const subjectRecord = JSON.parse(oldSocre.Record)
            subjectRecord.forEach(subjectItem => {
              if (subjectItem.Id == item.Id) {
                item.scoreList = subjectItem.scoreList
                item.status = subjectItem.status
              }
            })
          }
        })
      }
    },
    // 打开添加成绩的模态框
    openAddScoreDialog(index) {
      this.addScoreDialog = true
      this.addScoreFormData = {
        score: null,
        examTime: null
      }
      this.scoreEntrySubjectIndex = index
    },
    // 删除成绩
    deleScore(scoreItem, scoreIndex, itemIndex) {
      this.$confirm('确认删除此次考试成绩吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const allSubScore = [...this.allSubjectList]
          if (scoreItem.score >= 60) {
            this.allSubjectList[itemIndex].status = 0
          }
          allSubScore[itemIndex].scoreList.splice(scoreIndex, 1)
          this.saveScoreDele(allSubScore)
        })
        .catch(() => {})
    },
    // 保存删除成绩
    async saveScoreDele(url, param, data) {
      const subjectListStr = JSON.stringify(this.allSubjectList)
      const subjectListArr = JSON.parse(subjectListStr)
      this.majorScore.Record = JSON.stringify(subjectListArr)
      const res = await $StudentScoreHttp.addStudentScore(
        this.customId,
        this.majorScore
      )
      if (res.code == 200) {
        this.allSubjectList = data
        this.common.go_alert('删除成功')
      }
    },
    // 保存录入的成绩
    saveScoreEntry() {
      this.$refs.refScoreEntryForm.validate(async valid => {
        if (valid) {
          // 拷贝一份数据，成绩保存成功之后才在页面显示
          const subjectListStr = JSON.stringify(this.allSubjectList)
          const subjectListArr = JSON.parse(subjectListStr)
          subjectListArr[this.scoreEntrySubjectIndex].scoreList.push(
            this.addScoreFormData
          )
          if (this.addScoreFormData.score >= 60) {
            subjectListArr[this.scoreEntrySubjectIndex].status = 1
          }
          this.majorScore.Record = JSON.stringify(subjectListArr)
          const res = await $StudentScoreHttp.addStudentScore(
            this.customId,
            this.majorScore
          )
          if (res.code == 200) {
            this.common.go_alert('录入成功')
            this.allSubjectList = []
            this.allSubjectList = subjectListArr
            this.majorScore.Id = res.data.Id
            this.addScoreDialog = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.entry_score >>> .el-date-editor {
  width: 100%;
}
.score_item:hover .deleImgIcon {
  display: block;
}
.deleImgIcon {
  display: none;
  position: absolute;
  top: -5px;
  right: -6px;
  width: 16px;
  line-height: 16px;
  text-align: center;
  height: 16px;
  border-radius: 50%;
  background: #333333;
  z-index: 10;
}
</style>
