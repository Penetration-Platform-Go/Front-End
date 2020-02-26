<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="ListQuery.username" placeholder="Username" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>
    <div style="height: 20px" />
    <el-table
      v-loading="ListLoading"
      :data="UserList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Index" width="80">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Username" width="225">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Nickname" width="225">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Email" width="225">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Project Number" width="225">
        <template slot-scope="scope">
          <span>{{ scope.row.ProjectNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions">
        <template slot-scope="scope">
          <el-button class="el-icon-search" @click="ViewUser(scope.$index, scope.row)" />
          <el-button class="el-icon-delete" @click="DeleteUser(scope.$index, scope.row.username)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="SelectUser.username" :visible.sync="ViewUserVisible" width="1000px">
      <el-table
        v-loading="ListLoading"
        :data="SelectUser.ProjectList"
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
        <el-table-column align="center" label="Title" width="150">
          <template slot-scope="scope">
            {{ scope.row.Title }}
          </template>
        </el-table-column>
        <el-table-column label="Equipment number" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.EquipmentList.length }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Score" width="110" align="center">
          <template slot-scope="scope">
            {{ !!!scope.row.Score ? 'Not rated':scope.row.Score }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Actions">
          <template slot-scope="scope">
            <el-button class="el-icon-search" @click="ViewProjectMapTable(scope.$index, scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="SelectUser.SelectProject.Title" :visible.sync="ViewMapTableVisible" width="1000px">
      <el-form ref="SelectProject" :model="SelectUser.SelectProject" label-width="120px">
        <el-form-item label="Score">
          <el-input v-model="SelectUser.SelectProject.Score" style="width:350px" />
        </el-form-item>
        <el-table
          v-model="SelectUser.SelectProject"
          :data="SelectUser.SelectProject.EquipmentList"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="Equipment" width="150px">
            <template slot-scope="scope">
              {{ scope.row.type + ':' + scope.row.name + (!!scope.row.ip?'('+scope.row.ip+')':'') }}
            </template>
          </el-table-column>
          <el-table-column v-for="e in SelectUser.SelectProject.EquipmentList" v-bind:key="e.name" v-bind:label="e.type + ':' + e.name + (!!e.ip?'('+e.ip+')':'')" align="center">
            <template slot-scope="scope">
              <el-switch v-model="SelectUser.SelectProject.MapTable[scope.$index][SelectUser.SelectProject.EquipmentList.indexOf(e)]" :disabled="true" />
            </template>
          </el-table-column>
        </el-table>
        <el-form-item />
        <vis style="height: 500px; border: 1px solid lightgray;" :equipment-list="SelectUser.SelectProject.EquipmentList" :map-table="SelectUser.SelectProject.MapTable" />
        <el-form-item />
        <el-form-item>
          <el-button style="width:150px" type="primary" @click="onEvaluateProject">Evaluate</el-button>
          <el-button style="width:150px" @click="onCancleEvaluateProject">Cancle</el-button>
        </el-form-item>
        <el-form-item />
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { GetAllUsers, DeleteUser, GetUserByUsername } from '@/api/user'
import { QueryListAdmin, UpdateProjectAdmin } from '@/api/table'
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
  data() {
    return {
      UserList: [],
      ViewUserVisible: false,
      ViewMapTableVisible: false,
      ListQuery: {
        username: ''
      },
      SelectUser: {
        index: 0,
        Username: '',
        ProjectList: [],
        SelectProject: {
          index: 0,
          Id: '',
          Score: 0,
          Title: '',
          EquipmentList: [],
          MapTable: []
        }
      },
      ListLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.ListLoading = true
      GetAllUsers().then(async response => {
        var adminindex = 0
        this.UserList = response.data
        for (var index in this.UserList) {
          if (this.UserList[index].username === 'admin') {
            adminindex = index
            continue
          }
          await QueryListAdmin({ Title: '', Author: this.UserList[index].username }).then(res => {
            this.UserList[index].ProjectList = this.HandleProjectData(res.data)
            this.UserList[index].ProjectNumber = this.UserList[index].ProjectList.length
          })
        }
        this.UserList.splice(adminindex, 1)
        this.ListLoading = false
      })
    },
    ViewUser(index, data) {
      this.SelectUser.index = index
      this.SelectUser.username = data.username
      this.SelectUser.ProjectList = data.ProjectList
      this.ViewUserVisible = true
    },
    ViewProjectMapTable(index, data) {
      this.SelectUser.SelectProject.index = index
      this.SelectUser.SelectProject.Id = data.Id
      this.SelectUser.SelectProject.Score = data.Score
      this.SelectUser.SelectProject.Title = data.Title
      this.SelectUser.SelectProject.EquipmentList = data.EquipmentList
      this.SelectUser.SelectProject.MapTable = data.MapTable
      this.ViewMapTableVisible = true
    },
    onEvaluateProject() {
      UpdateProjectAdmin({ 'id': this.SelectUser.SelectProject.Id,
        'score': this.SelectUser.SelectProject.Score }).then(response => {
        this.UserList[this.SelectUser.index].ProjectList[this.SelectUser.SelectProject.index].Score = this.SelectUser.SelectProject.Score
        this.$message({
          message: 'Evaluate Project Successfully!',
          type: 'success'
        })
        this.ViewMapTableVisible = false
      }).catch(() => {
        this.$message({
          message: 'Error!',
          type: 'error'
        })
      })
    },
    onCancleEvaluateProject() {
      this.ViewMapTableVisible = false
    },
    DeleteUser(index, user) {
      DeleteUser({ username: user }).then(response => {
        this.UserList.splice(index, 1)
        this.$message({
          message: 'Delete User Successfully!',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: 'Error!',
          type: 'error'
        })
      })
    },
    handleFilter() {
      if (this.ListQuery.username === '') {
        return
      }
      GetUserByUsername({ username: this.ListQuery.username }).then(async response => {
        this.ListLoading = true
        this.UserList = response.data
        await QueryListAdmin({ Title: '', Author: this.UserList[0].username }).then(res => {
          this.UserList[0].ProjectList = this.HandleProjectData(res.data)
          this.UserList[0].ProjectNumber = this.UserList[0].ProjectList.length
        })
        this.ListLoading = false
      })
    },
    HandleProjectData(data) {
      var ProjectList = []
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
        ProjectList.push(each)
      }
      return ProjectList
    }
  }
}
</script>
