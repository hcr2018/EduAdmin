<template>
  <div class="p_both10 p-t-5">
    <el-table
      ref="refElTabel"
      :data="customStutatusList"
      border
      tooltip-effect="light"
      style="width: 100%"
    >
      <el-table-column prop="UniversityLabel" label="高校学院" width="200">
        <template slot-scope="scope">
          <span
            class="color-2e77f8 font-w6 cursor"
            @click="lookStuStatus(scope.$index, scope.row)"
          >{{scope.row.UniversityLabel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="UniversityMajor" label="报读专业" width="120"></el-table-column>
      <el-table-column prop="XueLiShuXing" label="学历属性" width="100"></el-table-column>
      <el-table-column prop="XueJi" label="学籍编号" width="100"></el-table-column>
      <el-table-column prop="RealName" label="姓名" width="100"></el-table-column>
      <el-table-column prop="Sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="ZhunKaoZheng" label="准考证号" width="120"></el-table-column>
      <el-table-column prop="IDCard" label="身份证号" width="160"></el-table-column>
      <el-table-column prop="Telephone" label="电话" width="100"></el-table-column>
      <el-table-column prop="ShiFouTuoGuan" label="托管" width="50"></el-table-column>
      <el-table-column prop="ShijiPrice" width="95" label="实际缴费(￥)"></el-table-column>
      <el-table-column width="120" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            class="m-r-10"
            @click="editStuStatus(scope.$index, scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="m-v-15">
      <span>学籍只能由合同产生，不能直接添加，请添加合同的时候选择对应的高校以及课程，则自动产生出学籍并可修改。</span>
      <!-- <el-button type="primary" class="m-t-20" @click="addStuStatus">添加学籍</el-button> -->
    </div>
    <!-- 学籍弹出框 -->
    <stu-status-row-dialog ref="refStuStatusDialog" @subClick="updateStuStatusList"></stu-status-row-dialog>
  </div>
</template>
<script>
import {  
  getStudentStatustByStudent
} from "@/api/custom";
 
import stuStatusRowDialog from "@/views/custom/component/stuStatusRowDialog";
export default {
  components: {
    stuStatusRowDialog
  },
  data() {
    return {
      // 客户学籍信息列表
      customStutatusList: [],
      // 客户的个人信息
      customRowData: {},
      // 当前操作学籍的索引
      currentStuStatusIndex: null
    };
  },

  methods: {
    //  获取客户信息
    getCustomRowData(customRowData) {
      // 初始化数据
      this.customStutatusList = [];
      this.customRowData = {};
      this.customRowData = { ...customRowData };
      this.getStuStatusList();
    },
    // 获取客户学籍列表
    async getStuStatusList() {
      let res = await getStudentStatustByStudent(
        this.customRowData.id
      );
      if (res.code == 200) {
        this.customStutatusList = res.data ? res.data : [];
      }
    },
    //添加学籍数据
    addStuStatus() {
      let stuStatusRow = {
        StudentID: this.customRowData.id,
        RealName: this.customRowData.Realname,
        Telephone: this.customRowData.Telephone,
        Sex: this.customRowData.Sex,
        IDCard: this.customRowData.Idcard,
        Address: this.customRowData.Address,
        QQ: this.customRowData.Qq,
        PlatformID: this.customRowData.Platform,
        RegisterTime: this.customRowData.RegisterTime,
        Email: this.customRowData.Email
      };
      this.$refs.refStuStatusDialog.getStuStatusFormData(stuStatusRow, 1);
    },
    // 编辑学籍数据
    editStuStatus(index, row) {
      this.$refs.refStuStatusDialog.getStuStatusFormData(row, 0);
      this.currentStuStatusIndex = index;
    },
    // 查看学籍数据
    lookStuStatus(index, row) {
      this.$refs.refStuStatusDialog.getStuStatusFormData(row, -1);
    },
    // 添加或者编辑成功后更新学籍数据列表
    updateStuStatusList(type, rowData) {
      if (type == 1) {
        this.customStutatusList.unshift(rowData);
      } else if (type == 0) {
        this.$set(this.customStutatusList, this.currentStuStatusIndex, rowData);
      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.$refs.refElTabel.doLayout();
    }, 2000);
  }
};
</script> 
<style scoped>
</style>