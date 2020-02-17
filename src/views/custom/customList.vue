<template  >
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <!-- 条件查询表单 -->
      <div class="p-t-20">
        <el-form :inline="true">
          <!-- 我的校区的时候使用，用来展示本校区所属的工作人员 -->
          <div v-show="this.currentPlatform>0">
            <el-form-item label>
              <el-switch
                v-model="queryFromLabel"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :inactive-text="queryFromLabel?'录入员':'管理员'"
                @change="searchSubmit"
              />
              <el-radio-group
                v-model="searchWorkerId"
                :disabled="!isPlatformMaster"
                @change="getCustomList"
              >
                <el-radio-button :label="0">全部</el-radio-button>
                <el-radio-button
                  v-for="item in myWorkerList"
                  :key="item.Id"
                  :label="item.Id"
                >{{ item.Realname }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="between-center flex_wrap">
            <div class="flex_1">
              <el-form-item label="客户类型">
                <el-select
                  v-model="searchTypeVal"
                  class="wid110"
                  placeholder="请选择类型"
                  @change="getCustomList"
                >
                  <el-option
                    v-for="(item,index) in common.IntentionalCustomerType"
                    :key="index"
                    :label="item.Label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="录入时间段">
                <el-date-picker
                  v-model="queryEndDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="common.datePickerOptions"
                  style="width:220px;"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="searchContentVal"
                  placeholder="请输入搜索内容"
                  class="input-with-select"
                  @keyup.enter.native="searchSubmit"
                >
                  <el-select
                    slot="prepend"
                    v-model="seaechConditionVal"
                    placeholder="请选择查询条件"
                    class="wid90"
                  >
                    <el-option
                      v-for="(item,index) in searchCustomOptions"
                      :key="index"
                      :label="item.Label"
                      :value="item.value"
                    />
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchSubmit">查询</el-button>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <!-- 客户显示列表 -->
      <!-- 图片预览 -->
      <my-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
      <el-table
        ref="refCustomListTable"
        :data="customTableDataList"
        border
        tooltip-effect="light"
        style="width: 100%"
        height="100%"
        @selection-change="selectionCustomChange"
      >
        <el-table-column width="120" fixed label="姓名">
          <template slot-scope="scope">
            <span
              class="color-1890ff font-w6 cursor"
              @click="openMoreOperationDialog(scope.$index, scope.row)"
            >{{ scope.row.Realname }}</span>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="40" />
        <el-table-column prop="id" width="80" label="编号" />
        <el-table-column label="提醒" width="50">
          <template slot-scope="scope">
            <i class="el-icon-bell font20" @click="addAlarm(scope.$index, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column width="50" label="关注">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.Star"
              :max="1"
              class="customStar"
              @change="(val)=>{return setCustomStar(val, scope.row,scope.$index)}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="Description" width="100" label="描述" :show-overflow-tooltip="true" />
        <el-table-column prop="Platform" width="110" label="归属校区">
          <template
            slot-scope="scope"
          >{{ common.FormatSelect($store.getters.app.platformList,scope.row.Platform) }}</template>
        </el-table-column>
        <el-table-column width="50" label="图片">
          <template slot-scope="scope">
            <div>
              <img
                v-if="scope.row.firstAttachImage"
                @click="onPreview(scope.row.firstAttachImage)"
                class="wid20"
                src="/static/img/slice/uploadedIcon.png"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column width="130" label="最近跟进时间">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="light"
              :content="scope.row.RecentTrack.substr(17)"
              placement="top-start"
            >
              <span class="color-1890ff font-w6 cursor">{{ scope.row.RecentTrack.substr(0,16) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Sex" width="50" label="性别" />
        <el-table-column prop="Telephone" width="100" label="电话号码" />
        <el-table-column prop="FromLabel" width="100" label="渠道来源" />
        <el-table-column width="75" label="管理员">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="light"
              :content="'电话:'+scope.row.ManagerTel"
              placement="top-start"
            >
              <span class="color-1890ff font-w6 cursor">{{ scope.row.ManagerLabel }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="FocusCourse" width="120" label="意向课程" :show-overflow-tooltip="true" />
        <el-table-column prop="Kind" width="75" label="意向情况">
          <template slot-scope="scope">
            <span>{{ common.FormatSelect(common.IntentionalCustomerType,scope.row.Kind) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Createtime" width="130" :formatter="TimeFormatter" label="录入时间" />
        <el-table-column prop="Comments" width="200" label="备注" :show-overflow-tooltip="true" />
        <el-table-column label="操作" width="310" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="danger"
              style="margin:0px;"
              @click="addCustomContract(scope.$index, scope.row)"
            >办理报名</el-button>
            <el-button
              style="margin:0px"
              size="mini"
              v-show="scope.row.status==1"
              type="info"
              @click="setCustomAccountStatus(scope.$index, scope.row,0)"
            >禁用</el-button>
            <el-button
              style="margin:0px"
              v-show="scope.row.status==0"
              type="success"
              size="mini"
              @click="setCustomAccountStatus(scope.$index, scope.row,1)"
            >启用</el-button>
            <el-button
              style="margin:0px"
              :id="'callId'+scope.row.id"
              :disabled="connectTelStatus<=0"
              type="warning"
              size="mini"
              @click="callTelephone($event,scope.row)"
            >打电话</el-button>
            <el-button
              :disabled="connectTelStatus<=0"
              size="mini"
              style="margin:0px"
              @click="openSendSMSDialog(scope.row)"
            >发短信</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="between-center m-v-15">
        <div class="between-center m-l-10">
          <el-button type="primary" @click="openItemDialog()">新增客户</el-button>
          <el-button type="warning" @click="changeManager">客户移交</el-button>
        </div>
        <div>
          <el-pagination
            background
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
            @current-change=" getCustomListNowpage"
          />
        </div>
      </div>
    </div>
    <div>
      <!-- 客户更多操作弹出框 -->

      <my-dialog
        :visible.sync="moreOperationDialog"
        :close-show="true"
        :title="customFormData.Realname"
      >
        <!-- 展示校区的基本信息 -->
        <div slot="left_content">
          <custom-row-detail :formItemData="customFormData" />
        </div>
        <div slot="right_content" class="p_both20 p-b-20">
          <el-tabs v-model="activElTab" @tab-click="changDialogTab">
            <el-tab-pane id="gjjl" label="跟进记录" name="gjjl">
              <custom-track :custom-data="customFormData" @subClickEvent="updateCustomRecentTrack" />
            </el-tab-pane>
            <el-tab-pane id="gmjl" label="购买记录" name="gmjl">
              <custom-buy-record :customData="customFormData" />
            </el-tab-pane>
            <el-tab-pane id="htdd" label="合同订单" name="htdd">
              <custom-contract-list :customData="customFormData" />
            </el-tab-pane>
            <el-tab-pane id="cjlr" label="成绩录入" name="cjlr">
              <scoreEntry :customData="customFormData" />
            </el-tab-pane>
            <el-tab-pane id="dazl" label="档案资料" name="dazl">
              <scoreEntry :customData="customFormData" />
            </el-tab-pane>
          </el-tabs>~
        </div>
      </my-dialog>

      <!-- 新增信息弹出框 -->
      <el-dialog
        :visible.sync="editDialog"
        width="600px"
        :title="customFormData.Id>0?'编辑'+customFormData.Label:'新增'"
      >
        <custom-row-detail
          style="padding:20px 20px 20px 20px"
          :editEnable="true"
          :formItemData="customFormData"
        />
      </el-dialog>

      <!--  发送短信弹出框 -->
      <custom-send-sms-dialog ref="refsendSMSDialog" @sendSMS="sendSMS" />

      <!-- 合同信息弹出框 -->
      <custom-contract-dialog ref="refContractDialog" />
      <!-- 添加提醒弹出框 -->
      <add-alarm-dialog ref="refAlarmForm" />
      <!-- 添加提醒弹出框 -->
      <batchChangeManagerView ref="refChangeManager" @subClickEvent="updateCustomList" />
    </div>
  </div>
</template>
<script>
import $ from "jquery";
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

import {
  queryPlatform,
  addPlatform,
  updatePlatform,
  setPlatformWorker,
  setNewPlatformWorks,
  getPlatformAboutWorkers,
  getPlatformWorkers,
  setPlatformMaster,
  getWorkersCustomList,
  addWorkersCustom,
  editWorkersCustom
} from "@/api/platform";
import customRowDetail from "@/views/custom/component/customRowDetail";
import customSendSmsDialog from "@/views/custom/component/customSendSmsDialog";
import customTrack from "@/views/custom/component/customTrack";
import customBuyRecord from "@/views/custom/component/customBuyRecord";
import customContractDialog from "@/views/custom/component/customContractDialog";
import customContractList from "@/views/custom/component/customContractList";
import addAlarmDialog from "@/views/custom/component/addAlarmDialog";
import batchChangeManagerView from "@/views/custom/component/batchChangeManager";
import alarmList from "@/views/custom/component/alarmList";
import scoreEntry from "@/views/custom/component/scoreEntry";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import myDialog from "@/components/myDialog/myDialog";
import Tinymce from "@/components/Tinymce";
import common from "@/utils/common";
import { error } from "util";

export default {
  name: "customList",
  components: {
    myDialog,
    myImageViewer,
    Tinymce,
    customSendSmsDialog,
    customRowDetail,
    customContractDialog,
    customContractList,
    scoreEntry,
    customTrack,
    customBuyRecord,
    alarmList,
    addAlarmDialog,
    batchChangeManagerView
  },
  data() {
    return {
      // 更多操作弹窗
      moreOperationDialog: false,
      // 更多操作弹窗
      editDialog: false,
      common,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 我的校区-当前工作人员可管理的其他工作人员的列表
      //当前校区.0代表所有
      currentPlatform: 0,
      myWorkerList: [],
      // 我的校区-当前所选中销售人员的ID-条件查询
      searchWorkerId: null,
      // 获取当前登录用的角色权限
      qxRole: "",
      // 搜索学生的类型-条件查询
      searchTypeVal: -1,
      // 查询客户的条件选项
      searchCustomOptions: [
        {
          value: "realname",
          Label: "姓名"
        },

        {
          value: "tel",
          Label: "电话"
        },
        {
          value: "comments",
          Label: "备注"
        }
      ],
      // 查询客户所选条件值
      seaechConditionVal: "",
      // 查询客户内容的值
      searchContentVal: "",
      // 筛选客户-全部，公海，意向，成单
      searchHasbuy: 0,
      // 日期选择-日期筛选
      queryEndDate: null,
      queryFromLabel: false, // 是否根据这个客户的录入员进行查询
      // 存放客户列表数据-table
      customTableDataList: [],
      // 数据总条数-分页
      allRows: 0,
      // 当前页数-分页
      nowPage: 1,
      // 每页数据的总条-分页
      rows: 40,
      // 单条客户的数据
      customFormData: {},
      // 客户更多操作的弹出框
      customMoreOperationDialog: false,
      // 当前所在tab页
      activElTab: "gjjl",
      // 平台的下拉选择框
      platFormOps: [],
      // 存放选中的角色-模态框
      platFormSelect: "",
      // 存放选中的平台-模态框
      platFormSelect: "",
      // 当前选中行的数据索引
      currentCustomIndex: null,
      // 当前操作学生的Id-打电话用
      currentStudentid: 0,
      addStudentBuyCourseDialog: false,
      addStudentBuyCourseFormData: {},
      // 客户的跟进记录列表
      customTracksData: [],
      // 用户成绩录入的列表信息
      customScoreEntry: [],

      // 获取选中的学生ID
      mulSelectionCustomId: [],
      // 是否是本站的管理员
      isPlatformMaster: false,
      // ------------------------电话
      connectTelStatus: "0", // 0 没连接。1 已经连接。2.拨号中。3.通话中。
      webSocket: null,
      timer: null,
      // 通讯设备是否连接成功
      connecTelSuccess: false,
      // 要连接的URL；这是WebSocket服务器将响应的URL。
      websocketURL: "ws://127.0.0.1:8555/api"
    };
  },

  created() {
    this.seaechConditionVal = this.searchCustomOptions[0].value;
    this.initWebSocket();
  },
  mounted() {
    this.qxRole = sessionStorage.ROLE;
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = paths[paths.length - 1];
    // 因为客户管理和我的校区应用的是同一个页面所有让当路由有参数是就代表但是我的校区
    if (this.currentPlatform > 0) {
      // 获取该校区下所属我的所有销售成员
      this.getPlatformWorkers(this.currentPlatform);
    } else {
      // 客户管理-直接获取客户列表
      this.getCustomList();
    }
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
    // 我的校区-根据当前登录用户选择的校区获取该校区下所属自己的销售
    async getPlatformWorkers(platformId) {
      const res = await getPlatformWorkers(platformId);
      if (res.code == 200) {
        // 默认查看自己的客户
        this.searchWorkerId = this.$store.getters.manager.Id;
        this.myWorkerList = res.data ? res.data : [];
        this.isPlatformMaster = res.title;
      }
      this.getCustomList();
    },
    // 条件查询客户
    searchSubmit() {
      this.nowPage = 1;
      this.getCustomList();
    },
    // 获取客户列表-tableData
    async getCustomList() {
      const that = this;
      this.listLoading = true;
      // 取数据的位置
      const offsetRow = (this.nowPage - 1) * this.rows;
      let res;
      let notInKind = 0; // sql中标识为   kind!=
      if (this.searchTypeVal == -1) {
        // 选择全部客户的时候， 要排除kind=6 的公海客户
        notInKind = 6;
      }
      let startDate;
      let endDate;
      if (this.queryEndDate && this.queryEndDate.length == 2) {
        startDate = parseInt(this.queryEndDate[0] / 1000);
        endDate = parseInt(this.queryEndDate[1] / 1000 + 3600 * 24 - 1);
      }
      if (this.currentPlatform) {
        // 校区-客户数据
        res = await getCustomInfoList("", {
          platformManager: this.searchWorkerId,
          limit: this.rows,
          offset: offsetRow,
          kind: this.searchTypeVal,
          platform: this.currentPlatform,
          notInKind: notInKind,
          startDate: startDate,
          endDate: endDate,
          queryFrom: this.queryFromLabel,
          [this.seaechConditionVal]: this.searchContentVal
        });
      } else {
        // 客户管理-客户数据
        res = await getCustomInfoList("", {
          limit: this.rows,
          offset: offsetRow,
          kind: this.searchTypeVal,
          notInKind: notInKind,
          startDate: startDate,
          endDate: endDate,
          [this.seaechConditionVal]: this.searchContentVal
        });
      }
      if (res.code == 200) {
        this.customTableDataLis = [];
        this.allRows = res.title;
        this.customTableDataList = res.data ? res.data : [];
        this.customTableDataList.forEach(item => {
          if (item.Info) {
            const info = JSON.parse(item.Info);
            if (info.attach_image) {
              const imgArr = info.attach_image.split(",");
              item.firstAttachImage = imgArr[0];
            }
          }
        });
      }
      this.listLoading = false;
    },

    // 分页获取数据
    getCustomListNowpage(val) {
      this.nowPage = val;
      this.getCustomList();
    },
    // 格式化显示时间
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue, 2);
    },

    // 设置重点客户
    async setCustomStar(val, row, rowIndex) {
      const res = await setStar(row.id);
      if (res.code == 200) {
        this.customTableDataList[rowIndex].Star = res.data;
      }
    },
    // 新增客户合同-办理报名
    addCustomContract(index, row) {
      this.$refs.refContractDialog.getContractFormData(
        {
          StudentLabel: row.Realname,
          StudentID: row.id,
          YouhuiPrice: 0,
          QiankuanPrice: 0,
          Id: 0
        },
        1
      );
    },
    // 禁用或启用客户的账户
    setCustomAccountStatus(index, row, status) {
      const that = this;
      let msg;
      if (status == 0) {
        msg = "确认禁用该账户?";
      } else if (status == 1) {
        msg = "确认启用该账户?";
      }
      that
        .$confirm(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          const res = await setCustomAccountStatus(
            row.id,
            { status: status },
            false,
            true
          );
          if (res.code == 200) {
            that.$set(that.customTableDataList, index, res.data);
            if (res.title != "ok") {
              this.$confirm(
                "启用成功，并设置密码为：" + res.title + " 已发送短信告知对方",
                {
                  confirmButtonText: "确定",
                  type: "success"
                }
              );
            } else {
              this.$alert("设置成功");
            }
          }
        })
        .catch(() => {});
    },

    openItemDialog() {
      this.editDialog = true;
      this.customFormData = {};
    },
    // 打开更多操作的弹出框
    openMoreOperationDialog(index, row) {
      this.currentPlatformIndex = index;
      this.customFormData = row;
      this.moreOperationDialog = true;
    },

    // 切换tabs标签页在调用函数
    changDialogTab(tab) {
      if (tab.$attrs.id == "gjjl") {
        // this.$refs.refCustomTrack.getCustomId(this.customFormData.id);
      } else if (tab.$attrs.id == "gmjl") {
        // this.$refs.refBuyRecord.getCustomId(this.customFormData.id);
      } else if (tab.$attrs.id == "htdd") {
        // this.$refs.refCustomContract.getCustomRowData(this.customFormData);
      } else if (tab.$attrs.id == "xj") {
        // this.$refs.refCustomStuStatus.getCustomRowData(this.customFormData);
      } else if (tab.$attrs.id == "cjlr") {
        // this.getScoreEntry(this.customFormData.id);
      }
    },
    // // 打开客户信息弹窗
    // openCustomDialog(type) {
    //   // type=1新增，type=0编辑
    //   if (type) {
    //     this.$refs.refCustomDialog.getCustomRowData({ id: 0 });
    //   } else {
    //     this.$refs.refCustomDialog.getCustomRowData({
    //       ...this.customFormData
    //     });
    //   }
    // },
    // 获取选中的学生
    selectionCustomChange(val) {
      this.mulSelectionCustomId = [];
      val.forEach(item => {
        this.mulSelectionCustomId.push(item.id);
      });
    },
    // 转移学员的管理员到其他管理名下
    changeManager() {
      if (this.mulSelectionCustomId.length <= 0) {
        this.$message("你还没有勾选学员哦！");
        return;
      }
      this.$refs.refChangeManager.getCustomIds(this.mulSelectionCustomId);
    },
    // 更新客户列表数据-转移客户之后
    updateCustomList(rowsDatas) {
      rowsDatas.forEach(row => {
        this.customTableDataList.forEach(item => {
          if (item.id == row.id) {
            item.ManagerID = row.ManagerID;
            item.ManagerLabel = row.ManagerLabel;
            item.ManagerTel = row.ManagerTel;
          }
        });
      });
      this.$refs.refCustomListTable.clearSelection();
    },
    // 更新客户列表数据
    updateCustomInfoList(type, rowData) {
      // type=1添加，type=0修改，type=-1取消
      // 显示第一章图片格式化
      if (rowData) {
        if (rowData.Info) {
          const info = JSON.parse(rowData.Info);
          if (info.attach_image) {
            const imgArr = info.attach_image.split(",");
            rowData.firstAttachImage = imgArr[0];
          }
        }
      }
      if (type == -1) {
      } else if (type == 1) {
        this.customTableDataList.unshift(rowData);
      } else if (type == 0) {
        this.customFormData = { ...rowData };
        this.$set(this.customTableDataList, this.currentCustomIndex, rowData);
        this.$refs.refCustomDetail.getCustomRowData({ ...rowData });
      }
    },
    // 添加跟进记录后更新用户列表的最新跟进记录
    updateCustomRecentTrack(RecentTrack) {
      this.customFormData.RecentTrack = RecentTrack;
      this.$set(
        this.customTableDataList,
        this.currentCustomIndex,
        this.customFormData
      );
    },
    // 强制刷新
    change(e) {
      this.$forceUpdate();
    },
    // 显示日期处理
    dateFormat({ cellValue, row, column }) {
      return this.common.dateFormat(cellValue, false);
    },
    // 显示来电用户的信息 msgJsonData.dynamicdata.number
    async showIncomeingUserInfo(telephone) {
      const res = await checkTelephone(telephone);
      if (res.code == 200 && res.data) {
        const content = res.data.Description
          ? res.data.Description
          : "暂无描述";
        this.$alert("客户描述：" + content, res.data.Realname + "来电", {
          confirmButtonText: "知道了"
        }).catch(() => {});
      }
    },
    // 触发成绩录入子组件函数
    getScoreEntry(id) {
      this.$refs.scoreEntryComponent.getScoreEntryData(id);
    },
    // 点击添加提醒弹出模态框
    addAlarm(index, row) {
      this.$refs.refAlarmForm.getCustomInfo(row);
    },
    // -----------------------------------------------电话

    initWebSocket() {
      // 初始化weosocket
      this.webSocket = new WebSocket(this.websocketURL);
      this.webSocket.onopen = this.websocketonopen;
      this.webSocket.onerror = this.websocketonerror;
      this.webSocket.onmessage = this.websocketonmessage;
      this.webSocket.onclose = this.websocketclose;
    },
    // 当WebSocket 的连接状态readyState 变为“OPEN”时调用;这意味着当前连接已经准备好发送和接受数据
    // 这个事件处理程序通过 事件（建立连接时）触发。
    websocketonopen() {
      this.webSocket.send('{"command":"GetConnectedState"}');
      this.websocketsend('{"command":"SMSEnable","arguments":{"content":"1"}}');
      this.timer = setInterval(this.HeartBeatCheck, 10000);
    },
    HeartBeatCheck() {
      this.webSocket.send("HeartBeatData");
    },
    // 在 WebSocket.onerror 属性，发生错误时执行的回调函数
    websocketonerror(e) {
      // 错误
      this.connectTelStatus = "-1";
      this.webSocket = new WebSocket(this.websocketURL);
      clearInterval(this.timer);
    },
    // WebSocket.onclose 属性返回一个事件监听器，这个事件监听器将在 WebSocket 连接的readyState 变为 CLOSED时被调用
    websocketclose(e) {
      this.connectTelStatus = "-2";
    },
    formatTelephoneStatus() {
      switch (this.connectTelStatus) {
        case "-2":
          this.connecTelSuccess = false;
          return "通讯设备连接异常";
          break;
        case "-1":
          this.connecTelSuccess = false;
          return "通讯设备异常";
          break;
        case "0":
          this.connecTelSuccess = false;
          return "通讯设备未连接";
          break;
        case "1":
          this.connecTelSuccess = true;
          return "通讯设备已连接";
          break;
        case "2":
          this.connecTelSuccess = true;
          return "正在拨号中";
          break;
        case "3":
          this.connecTelSuccess = true;
          return "正在通话中";
          break;
        default:
          this.connecTelSuccess = false;
          return "未知状态";
          break;
      }
    },
    OnOpenDevice() {
      if (this.connectTelStatus == "1") {
        this.webSocket.send('{"command":"CloseDevice"}');
      } else {
        this.webSocket.send('{"command":"OpenDevice"}');
      }
    },
    // WebSocket.onmessage 属性是一个当收到来自服务器的消息时被调用的 EventHandler。它由一个MessageEvent调用。
    websocketonmessage(e) {
      // 数据接收
      const msgJsonData = JSON.parse(e.data); // 注意：长连接我们是后台直接1秒推送一条数据，
      // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
      // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
      var msg = msgJsonData.message;
      var now;
      if (msgJsonData.type == "InstructionTrace") {
      } else if (msgJsonData.type == "RealTimeState") {
        if (msgJsonData.dynamicdata) {
          switch (msgJsonData.dynamicdata.realtimestate) {
            case "outgoing":
              $("#callId" + this.currentStudentid + " > span").html("正在拨号");
              this.connectTelStatus = "2";
              break;
            case "hangup":
              $("#callId" + this.currentStudentid + " > span").html("已挂断");

              this.connectTelStatus = "1";
              this.websocketsend('{"command":"HungUp"}');
              break;
            case "outconnected":
              $("#callId" + this.currentStudentid + " > span").html("正在录音");
              this.connectTelStatus = "2";
              now = new Date().getTime();
              this.websocketsend(
                '{"command":"StartRecord","arguments":{"content":"' +
                  now +
                  '.wav"}}'
              );
              break;
            case "ringback":
              $("#callId" + this.currentStudentid + " > span").html("对方振铃");
              this.connectTelStatus = "2";
              break;
            case "incoming":
              this.connectTelStatus = "2";
              // 显示来电用户的信息
              this.showIncomeingUserInfo(msgJsonData.dynamicdata.number);
              break;
            case "inconnected":
              $("#callId" + this.currentStudentid + " > span").html("正在录音");
              this.connectTelStatus = "2";
              now = new Date().getTime();
              this.websocketsend(
                '{"command":"StartRecord","arguments":{"content":"' +
                  now +
                  '.wav"}}'
              );
              break;
          }
        }
      } else if (msgJsonData.type == "CommandResponse") {
        switch (msgJsonData.data.invoke_command) {
          case "OpenDevice":
            if (msgJsonData.data.state == true) {
              this.connectTelStatus = "1";
            } else {
              this.connectTelStatus = "1";
            }

            break;
          case "Dial":
            if (msgJsonData.data.state == true) {
              $("#callId" + this.currentStudentid + " > span").html("点击停止");
              this.connectTelStatus = "2";
            } else {
              $("#callId" + this.currentStudentid + " > span").html("拨打电话");
              this.connectTelStatus = "1";
            }
            break;
          case "HungUp":
            $("#callId" + this.currentStudentid + " > span").html("拨打电话");
            this.connectTelStatus = "1";
            this.websocketsend(
              '{"command":"StopRecord","arguments":{"isconverttomp3":true}}'
            );

            break;
          case "CloseDevice":
            this.connectTelStatus = "0";
            break;
          case "UploadFile":
            console.log("上传录音文件结果1:" + msgJsonData.data);

            break;
          case "GetConnectedState":
            if (msgJsonData.data.state) {
              this.connectTelStatus = "1";
            } else {
              this.connectTelStatus = "0";
            }
            break;
          case "SMSEnable":
            if (msgJsonData.data.state == true) {
              console.log("可以收取短信:", msgJsonData.data);
            } else {
              console.log("不能收取短信:", msgJsonData.data);
            }

            break;
          case "GetSMSCount":
            console.log("短信条数:" + msgJsonData.dynamicdata);
            break;
          case "ReadSms":
            console.log(
              "收到的短信:" + msgJsonData.dynamicdata.phone,
              msgJsonData.dynamicdata.content
            );

            this.receiveSMS(msgJsonData.dynamicdata);

            this.websocketsend('{"command":"GetSMSCount"}');
            break;
          case "SendSMS":
            if (msgJsonData.data.state) {
              this.waitSendSMS();
            } else {
              console.log("短信发送失败:" + msgJsonData.data.message);

              this.$alert("短信发送失败", {
                confirmButtonText: "知道了"
              });
            }
            break;
          case "StopRecord":
            // 开始上传录音文件+
            if (msgJsonData.dynamicdata) {
              const currentRecordname =
                this.$store.state.userInformation.Id +
                "-" +
                this.currentStudentid;
              const url =
                window.location.protocol + "//" + window.location.hostname;

              this.websocketsend(
                '{"command":"UploadFile","arguments":{"url":"' +
                  url +
                  '/api/managecourse/uploadFile/telRecord","file":"' +
                  msgJsonData.dynamicdata.recordpath +
                  '","diykey":"attach","diyvalue":"' +
                  currentRecordname +
                  '"}}'
              );
            }

            break;
          default:
            break;
        }
      } else if (msgJsonData.type == "DeviceConnectedState") {
        if (msgJsonData.dynamicdata.state) {
          this.connectTelStatus = "1";
        } else {
          this.connectTelStatus = "0";
        }
      } else if (msgJsonData.type == "NewSMS") {
        console.log("收到了新短信", msgJsonData);
        this.websocketsend('{"command":"ReadSms","arguments":{"content":"1"}}');
      } else {
        if (msg != null) {
          // console.log(" -------------:", msg);
        }
        if (msgJsonData.dynamicdata != null) {
          if (msgJsonData.type == "SpeechRecogn") {
            msgJsonData.dynamicdata.result;
          }
        }
        if (msgJsonData.data != null) {
          if (msgJsonData.data.invoke_command.toLowerCase() == "readsms") {
            var a = msgJsonData.dynamicdata;
            "时间：" + a.time + "\n电话：" + a.phone + "\n内容：" + a.content;
          }

          if (
            msgJsonData.data.invoke_command.toLowerCase() ==
            "getspeechrecognenbale"
          ) {
            if (msgJsonData.data.state) {
              ("打开");
            } else {
              ("关闭");
            }
          }
        }
      }
    },
    // 收到客户发回来的短信
    async receiveSMS(msg) {
      const res = await receiveSmsTrack(msg.phone, msg.content);
    },
    async waitSendSMS() {
      const trackRow = {};
      trackRow.student_id = this.customFormData.id;
      trackRow.track_method = "短信联系";
      trackRow.content = this.$refs.refsendSMSDialog.getContent();
      trackRow.kind = 6;
      this.$refs.refsendSMSDialog.closeDialog();
      const res = await addcustomTracks(trackRow);
      this.$message("短信发送成功");
    },
    websocketsend(agentData) {
      // 数据发送
      // 			webSocket.send('{"command":"CloseSpeechRecogn"}');
      this.webSocket.send(agentData);
    },
    // 拨打电话
    callTelephone(event, row) {
      this.currentStudentid = row.id;
      if (this.connectTelStatus == "2") {
        this.websocketsend(
          '{"command":"HungUp","arguments":{"phone":"' + row.Telephone + '"}}'
        );
      } else {
        this.websocketsend(
          '{"command":"Dial","arguments":{"phone":"' + row.Telephone + '"}}'
        );
      }
    },
    // 打开发送短信对话框
    openSendSMSDialog(row) {
      this.customFormData = row;
      this.$refs.refsendSMSDialog.getCustomRowData(row);
    },
    // 发送短信
    sendSMS(sendMSG) {
      this.websocketsend(
        '{"command":"SendSMS","arguments":{"phone":"' +
          sendMSG.Telephone +
          '","content":"' +
          sendMSG.Content +
          '"}}'
      );
    }
  }
};
</script>
<style scoped>
.boxShadow1 {
  box-shadow: 0px 2px 2px 0px rgba(4, 0, 0, 0.3);
}
.boxShadow2 {
  box-shadow: 0px 2px 13px 0px rgba(81, 109, 158, 0.1);
}
.customStar >>> .el-rate__icon {
  font-size: 22px;
}
</style>
