<template>
  <div class="dashboard-editor-container">
    <panel-group :chart-data="dataNumber" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>

import PanelGroup from '@/components/PanelGroup'
import LineChart from '@/components/LineChart'
import { AdminGetInfo } from '@/api/table'

export default {
  components: { PanelGroup, LineChart },
  data() {
    return {
      dataNumber: {
        Users: 0,
        AllProjects: 0,
        NewProjects: 0,
        Views: 0
      },
      lineChartData: {
        actualData: []
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      AdminGetInfo().then(response => {
        const data = response.data
        this.dataNumber.Users = data.usernumber
        this.dataNumber.AllProjects = data.allprojectnumber
        this.dataNumber.NewProjects = (!data.notratedprojectnumber ? 0 : data.notratedprojectnumber)
        this.dataNumber.Views = data.allviews
        this.lineChartData.actualData = data.ViewsBeforeWeek
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
