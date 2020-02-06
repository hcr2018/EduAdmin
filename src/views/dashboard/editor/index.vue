<template>
  <div class="dashboard-editor-container">
    <div class="flex_column hgt_full">
      <div class="btn_fenxi">
        <div>
          <el-radio-group v-model="radio1" @change="getDataAnalysis()">
            <el-radio-button label="fromid">录入数量</el-radio-button>
            <!-- <el-radio-button  abel="money">成交金额</el-radio-button> -->
            <el-radio-button label="strack">跟进数量</el-radio-button>
          </el-radio-group>
        </div>
        <div class="m-t-15">
          <el-radio-group v-model="days" @change="getDataAnalysis()">
            <el-radio-button label="7">7天</el-radio-button>
            <el-radio-button label="30">30天</el-radio-button>
            <el-radio-button label="100">100天</el-radio-button>
            <el-radio-button label="120">120天</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div id="myChart" :style="{width: '100%', height: '100%'}" />
    </div>
  </div>
</template>

<script>
import {
  GetStudentDataFromAnalysis,
  GetStudentDataTrackAnalysis
} from '@/api/home'
import { getToken } from '../../../utils/auth'
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      radio1: 'fromid',
      days: '30',
      myChart: null
    }
  },
  mounted() {
    this.myChart = this.$echarts.init(document.getElementById('myChart'))
    this.myChart.on('updateAxisPointer', this.setChartFunction)
    this.getDataAnalysis()
  },
  methods: {
    setChartFunction(event) {
      var xAxisInfo = event.axesInfo[0]
      if (xAxisInfo) {
        var dimension = xAxisInfo.value + 1
        this.myChart.setOption({
          series: {
            id: 'pie',
            label: {
              formatter: '{b}: {@[' + dimension + ']} ({d}%)'
            },
            encode: {
              value: dimension,
              tooltip: dimension
            }
          }
        })
      }
    },
    getDataAnalysis() {
      const that = this

      // 校区-客户数据
      if (that.radio1 == 'fromid') {
        GetStudentDataFromAnalysis(that.days)
          .then(res => {
            that.drawChart(res)
          })
          .catch(err => {
            console.log('GetStudentDataFromAnalysis Error:', err)
          })
      } else if (that.radio1 == 'strack') {
        GetStudentDataTrackAnalysis(that.days)
          .then(res => {
            that.drawChart(res)
          })
          .catch(err => {
            console.log('GetStudentDataTrackAnalysis Error:', err)
          })
      }
      that.loading = false
    },
    drawChart(res) {
      if (res == null) {
        return
      }
      const title = res.title ? res.title : []
      // 基于准备好的dom，初始化echarts实例

      const option = {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: res.data
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: []
      }

      title.forEach(element => {
        option.series.unshift({
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        })
      })
      let tooltipvalue = '0'
      if (res.data[0] && res.data[0][res.data[0].length - 1]) {
        tooltipvalue = res.data[0][res.data[0].length - 1]
      }
      option.series.unshift({
        type: 'pie',
        id: 'pie',
        radius: '30%',
        center: ['50%', '30%'],
        label: {
          formatter: '{b}: {@' + tooltipvalue + '} ({d}%)'
        },
        encode: {
          itemName: 'day',
          value: tooltipvalue,
          tooltip: tooltipvalue
        }
      })

      this.myChart.setOption(option)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
select {
  appearance: none;
  -webkit-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  background-color: transparent;
}
ul,
ol {
  list-style: none;
}
a img {
  border: none;
}
a,
a:link {
  text-decoration: none;
  color: #333;
}
button {
  overflow: visible;
  padding: 0;
  margin: 0;
  border: 0 none;
  background-color: transparent;
}
button::-moz-focus-inner {
  padding: 0;
}
textarea,
input {
  background: none;
  padding: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
}
input[type="number"] {
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  -moz-appearance: textfield;
}
input[type="search"] {
  appearance: none;
  -webkit-appearance: none;
  border: 0;
}
input[type="text"] {
  appearance: none;
  -webkit-appearance: none;
  border: 0;
}
input[type="password"] {
  -webkit-text-security: disc;
  appearance: none;
  -webkit-appearance: none;
  border: 0;
}
textarea:focus,
input:focus,
button:focus {
  outline: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.btn_fenxi {
  position: absolute;
  top: 100px;
  right: 120px;
  z-index: 1000;
}
</style>
