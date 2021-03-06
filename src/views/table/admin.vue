<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="ListQuery.Title" placeholder="Title" style="width: 200px;" class="filter-item" />
      <el-input v-model="ListQuery.Author" placeholder="Author" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>
    <div style="height: 20px" />
    <el-table
      v-loading="ListLoading"
      :data="ProjectList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Index" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="210">
        <template slot-scope="scope">
          {{ scope.row.Id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Title">
        <template slot-scope="scope">
          {{ scope.row.Title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.User }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Equipment Number" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.EquipmentList.length }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Robot" width="80" align="center">
        <template slot-scope="scope">
          <el-button @click="GetRobotScore(scope.$index)">
            {{ scope.row.Robot.Score }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Score" width="80" align="center">
        <template slot-scope="scope">
          {{ !!!scope.row.Score ? 'Not rated':scope.row.Score }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="260">
        <template slot-scope="scope">
          <el-button class="el-icon-search" @click="ViewMapTable(scope.$index, scope.row)" />
          <el-button class="el-icon-edit" @click="EvaluatePorject(scope.$index, scope.row)" />
          <el-button class="el-icon-delete" @click="DeleteProject(scope.$index, scope.row.Id)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Score" :visible.sync="EditScoreVisible">
      <el-form ref="SelectProject" :model="SelectProject" label-width="120px">
        <el-form-item label="Score">
          <el-input v-model="SelectProject.Score" style="width:350px" />
        </el-form-item>
        <el-form-item>
          <el-button style="width:150px" type="primary" @click="onEvaluatePorject">Evaluate</el-button>
          <el-button style="width:150px" @click="onCancle">Cancle</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="Robot Score" :visible.sync="RobotScoreVisible">
      <el-form label-width="120px">
        <el-form-item label="Robot Score">
          <el-input v-model="SelectProject.Robot.Score" style="width:350px" :disabled="true" />
        </el-form-item>
        <el-form-item label="Information">
          <textarea v-model="SelectProject.Robot.Information" style="width:450px; font-size:16px; resize: none; font-family:Arial;" :rows="SelectProject.Robot.RowNumber" disabled />
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="SelectProject.Title" :visible.sync="ViewMapTableVisible" width="1000px">
      <el-form ref="SelectProject" :model="SelectProject" label-width="120px">
        <el-form-item label="Score">
          <el-input v-model="SelectProject.Score" style="width:350px" />
        </el-form-item>
        <el-table
          v-model="SelectProject"
          :data="SelectProject.EquipmentList"
          border
          fit
          highlight-current-row
          max-height="400px"
        >
          <el-table-column align="center" label="Equipment" width="150px">
            <template slot-scope="scope">
              {{ scope.row.type + ':' + scope.row.name + (!!scope.row.ip.length?'('+scope.row.ip+')':'') }}
            </template>
          </el-table-column>
          <el-table-column v-for="e in SelectProject.EquipmentList" :key="e.name" :label="e.type + ':' + e.name + (!!e.ip.length?'('+e.ip+')':'')" align="center">
            <template slot-scope="scope">
              <el-switch v-model="SelectProject.MapTable[scope.$index][SelectProject.EquipmentList.indexOf(e)]" :disabled="true" />
            </template>
          </el-table-column>
        </el-table>
        <el-form-item />
        <vis style="height: 500px; border: 1px solid lightgray;" :equipment-list="SelectProject.EquipmentList" :map-table="SelectProject.MapTable" />
        <el-form-item />
        <el-form-item>
          <el-button style="width:150px" type="primary" @click="onEvaluatePorject">Evaluate</el-button>
          <el-button style="width:150px" @click="onCancle">Cancle</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="Node.SelectEquipment.name" :visible.sync="ViewNodeInfoVisible">
      <el-form ref="SelectEquipment" :model="Node" label-width="120px">
        <el-form-item label="IP List">
          <el-select v-model="Node.Select" style="width:300px" placeholder="IP">
            <el-option v-for="ip in Node.SelectEquipment.ip" :key="ip" :value="ip" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { GetScoreRobot, GetProjectsAdmin, DeleteProjectAdmin, UpdateProjectAdmin, QueryListAdmin } from '@/api/table'
import vis from '@/components/Network/index'

export default {
  components: { vis },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  provide() {
    return {
      onDoubleClickNode: this.onDoubleClickNode,
      onClickNode: this.onClickNode
    }
  },
  data() {
    return {
      ProjectList: [],
      ViewMapTableVisible: false,
      EditScoreVisible: false,
      RobotScoreVisible: false,
      SelectProject: {
        Id: '',
        index: 0,
        Score: 0,
        Title: '',
        EquipmentList: [],
        MapTable: [],
        Robot: {
          Information: '',
          Score: 0,
          RowNumber: 0
        }
      },
      ListQuery: {
        Title: '',
        Author: ''
      },
      ListLoading: true,
      Node: {
        SelectEquipment: {
          name: '',
          ip: []
        }
      },
      ViewNodeInfoVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.ListLoading = true
      GetProjectsAdmin().then(async response => {
        var data = response.data
        for (var index in data) {
          var each = {}
          each.Id = data[index].id
          each.User = data[index].user
          each.Title = data[index].title
          each.Score = data[index].score
          each.EquipmentList = data[index].equipment
          each.MapTable = []
          const MapT = data[index].map['column']
          for (var i in MapT) {
            each.MapTable.push(MapT[i]['connected'])
          }
          await GetScoreRobot({ id: each.Id }).then(res => {
            each.Robot = {
              Score: res.data.score,
              Information: res.data.information,
              RowNumber: res.data.information.split('\n').length
            }
          })
          this.ProjectList.push(each)
        }
        this.ListLoading = false
      })
    },
    handleFilter() {
      this.ListLoading = true
      QueryListAdmin(this.ListQuery).then(async response => {
        this.ProjectList = []
        var data = response.data
        for (var index in data) {
          var each = {}
          each.Id = data[index].id
          each.User = data[index].user
          each.Title = data[index].title
          each.Score = data[index].score
          each.EquipmentList = data[index].equipment
          each.MapTable = []
          const MapT = data[index].map['column']
          for (var i in MapT) {
            each.MapTable.push(MapT[i]['connected'])
          }
          await GetScoreRobot({ id: each.Id }).then(res => {
            each.Robot = {
              Score: res.data.score,
              Information: res.data.information,
              RowNumber: res.data.information.split('\n').length
            }
          })
          this.ProjectList.push(each)
        }
        this.ListLoading = false
      })
    },
    GetRobotScore(id) {
      this.SelectProject.Robot = this.ProjectList[id].Robot
      this.RobotScoreVisible = true
    },
    EvaluatePorject(index, data) {
      this.SelectProject.Id = data.Id
      this.SelectProject.index = index
      this.SelectProject.Score = data.Score
      this.EditScoreVisible = true
    },
    onEvaluatePorject() {
      UpdateProjectAdmin({ 'id': this.SelectProject.Id, 'score': this.SelectProject.Score }).then((res) => {
        this.ProjectList[this.SelectProject.index].Score = this.SelectProject.Score
        this.$message({
          message: 'Evaluate Project Successfully!',
          type: 'success'
        })
        this.onCancle()
      }).catch(() => {
        this.$message({
          message: 'Error!',
          type: 'error'
        })
      })
    },
    onCancle() {
      this.ViewMapTableVisible = false
      this.EditScoreVisible = false
    },
    DeleteProject(index, id) {
      DeleteProjectAdmin({ 'id': id }).then((res) => {
        this.ProjectList.splice(index, 1)
        this.$message({
          message: 'Delete Project Successfully!',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: 'Error!',
          type: 'error'
        })
      })
    },
    ViewMapTable(index, data) {
      this.SelectProject.Id = data.Id
      this.SelectProject.Score = data.Score
      this.SelectProject.index = index
      this.SelectProject.Title = data.Title
      this.SelectProject.EquipmentList = data.EquipmentList
      this.SelectProject.MapTable = data.MapTable
      this.ViewMapTableVisible = true
    },
    onDoubleClickNode(index) {
      return
    },
    onClickNode(index) {
      this.Node.SelectEquipment = this.SelectProject.EquipmentList[index]
      this.ViewNodeInfoVisible = true
    }
  }
}
</script>
