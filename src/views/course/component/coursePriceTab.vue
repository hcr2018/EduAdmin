<template>
  <div class="p_both10 p-t-5">
    <vxe-grid
      border
      resizable
      :data.sync="coursePriceList"
      :edit-config="{trigger: 'click', mode: 'row'}"
      :columns="coursePriceColumnTitle"
    />
    <div class="between-center m-v-15">
      <el-button type="primary" @click="insertColumns">新增课程有效期</el-button>
      <el-button type="primary" @click="saveCoursePrice">保存</el-button>
    </div>
  </div>
</template>
<script>
import { saveCoursePriceList, getCoursePriceList } from '@/api/course'

export default {
  props: {
    // 课程的基本信息
    courseRowData: {}
  },
  data() {
    return {

      // 课程的价格列表数据
      coursePriceList: [],
      // 设置价格表格列字段
      coursePriceColumnTitle: [],
      // 存储价格的列名称
      priceColumnTitle: [],

      tableColumnValue: []
    }
  },
  mounted() {},
  methods: {
    // 获取获取课程数据
    getCourseRow(rowData) {
      this.courseRowData = {}
      this.courseRowData = { ...rowData }
      this.getCoursePrice()
    },

    // 获取科目价格
    async getCoursePrice() {
      // 初始化数据
      this.coursePriceColumnTitle = [
        { title: 'ID', field: 'Id', width: 70 },
        { title: '科目名称', field: 'Label' }
      ]
      this.priceColumnTitle = []
      this.coursePriceList = []
      const res = await getCoursePriceList(this.courseRowData.Id)
      if (res.code == 200) {
        for (const items of res.data.Children) {
          for (const item in items) {
            if (
              this.priceColumnTitle.indexOf(item) == -1 &&
              item != 'Id' &&
              item != 'Label' &&
              item != 'TCourseHasBookId'
            ) {
              this.priceColumnTitle.push(item)
            }
          }
        }
        if (this.priceColumnTitle.length > 0) {
          this.priceColumnTitle.forEach(name => {
            this.coursePriceColumnTitle.push({
              editRender: { name: 'input' },
              field: name,
              title: name + '天'
            })
            this.tableColumnValue.push(name)
          })
        }
        this.coursePriceList = res.data.Children
      }
    },
    // 新增课程有效期列
    insertColumns() {
      this.$prompt('请输入有效期名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.common.go_alert('新增成功')
          this.coursePriceColumnTitle.push({
            editRender: { name: 'input' },
            field: value,
            title: value + '天'
          })
          this.tableColumnValue.push(value)
          // 添加列后,将字段添加到数据表中
          for (const items of this.coursePriceList) {
            items[value] = null
          }
        })
        .catch(() => {})
    },
    // 保存价格
    saveCoursePrice() {
      for (const items of this.coursePriceList) {
        for (const item in items) {
          if (items[item] == null || items[item] == '') {
            this.$alert('价格不能为空哦！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: action => {}
            })
            return
          }
        }
      }
      this.$confirm('只可提交一次,确认提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const urlParams = '?id=' + this.courseRowData.Id
          const res = await saveCoursePriceList(urlParams, this.coursePriceList)
          if (res.code == 200) {
            this.common.go_alert('设置成功')
            this.getCoursePrice()
          }
        })
        .catch(e => {})
    }
  }
}
</script>
<style scoped>
</style>
