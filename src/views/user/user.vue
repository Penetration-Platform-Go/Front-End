<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="Username" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>
    <div style="height: 20px" />
    <el-table
      v-loading="listLoading"
      :data="list"
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
          <span>{{ scope.row.projectNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions">
        <template slot-scope="scope">
          <el-button class="el-icon-search" @click="onView(scope.$index, scope.row)" />
          <el-button class="el-icon-delete" @click="onDelete(scope.$index, scope.row.username)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="temp.username" :visible.sync="ViewdialogFormVisible" width="1000px">
      <el-table
        v-loading="listLoading"
        :data="temp.list"
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
        <el-table-column align="center" label="ID" width="220">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Title" width="150">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="IP number" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.iplist.length }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Score" width="110" align="center">
          <template slot-scope="scope">
            {{ !!!scope.row.score ? 'Not rated':scope.row.score }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Actions">
          <template slot-scope="scope">
            <el-button class="el-icon-search" @click="onViewMap(scope.$index, scope.row)" />
            <el-button class="el-icon-delete" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="temp.project.title" :visible.sync="ViewMapdialogFormVisible" width="1000px">
      <el-form ref="temp" :model="temp.project" label-width="120px">
        <el-form-item label="Score">
          <el-input v-model="temp.project.score" style="width:350px" />
        </el-form-item>
        <el-table
          v-model="temp.project"
          :data="temp.project.map"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="IP" width="150px">
            <template slot-scope="scope">
              {{ scope.row.ip }}
            </template>
          </el-table-column>
          <el-table-column v-for="ip in temp.project.iplist" v-bind:key="ip" v-bind:label="ip" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.whether[ip]" />
            </template>
          </el-table-column>
        </el-table>
        <el-form-item />
        <el-form-item>
          <el-button style="width:150px" type="primary" @click="onUpdate">Evaluate</el-button>
          <el-button style="width:150px" @click="onCancle">Cancle</el-button>
        </el-form-item>
        <el-form-item />
        <!-- <el-form-item>
          <el-button style="width:150px" type="primary" @click="onUpdate">Evaluate</el-button>
          <el-button style="width:150px" @click="onCancle">Cancle</el-button>
        </el-form-item> -->
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getAllUsers, deleteUser, getUserByUsername } from '@/api/user'
import { QueryListAdmin, updateProjectAdmin } from '@/api/table'

export default {
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
      list: [],
      listLoading: true,
      ViewdialogFormVisible: false,
      ViewMapdialogFormVisible: false,
      listQuery: {
        username: ''
      },
      temp: {
        index: 0,
        username: '',
        list: [],
        project: {
          index: 0,
          id: '',
          score: 0,
          title: '',
          iplist: '',
          map: []
        }
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAllUsers().then(async response => {
        var adminindex = 0
        this.list = response.data
        for (var index in this.list) {
          if (this.list[index].username === 'admin') {
            adminindex = index
            continue
          }
          await QueryListAdmin({ title: '', author: this.list[index].username }).then(res => {
            this.list[index].project = this.handleProjectData(res.data)
            this.list[index].projectNumber = this.list[index].project.length
          })
        }
        this.list.splice(adminindex, 1)
        this.listLoading = false
      })
    },
    onView(index, data) {
      this.temp.index = index
      this.temp.username = data.username
      this.temp.list = data.project
      this.ViewdialogFormVisible = true
    },
    onViewMap(index, data) {
      this.temp.project.index = index
      this.temp.project.id = data.id
      this.temp.project.score = data.score
      this.temp.project.title = data.title
      this.temp.project.iplist = data.iplist
      this.temp.project.map = data.map
      this.ViewMapdialogFormVisible = true
    },
    onUpdate() {
      updateProjectAdmin({ 'id': this.temp.project.id,
        'score': this.temp.project.score }).then(response => {
        this.list[this.temp.index].project[this.temp.project.index].score = this.temp.project.score
        this.$message({
          message: 'Evaluate Project Successfully!',
          type: 'success'
        })
        this.ViewMapdialogFormVisible = false
      }).catch(() => {
        this.$message({
          message: 'Error!',
          type: 'error'
        })
      })
    },
    onCancle() {
      this.ViewMapdialogFormVisible = false
    },
    onDelete(index, user) {
      deleteUser({ username: user }).then(response => {
        this.list.splice(index, 1)
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
      if (this.listQuery.username === '') {
        return
      }
      getUserByUsername({ username: this.listQuery.username }).then(async response => {
        this.listLoading = true
        this.list = response.data
        for (var index in this.list) {
          await QueryListAdmin({ title: '', author: this.list[index].username }).then(res => {
            this.list[index].project = this.handleProjectData(res.data)
            this.list[index].projectNumber = this.list[index].project.length
          })
        }
        this.listLoading = false
      })
    },
    handleProjectData(data) {
      var temp = data
      var list = []
      for (var index in temp) {
        var each = {}
        each.id = temp[index].id
        each.user = temp[index].user
        each.title = temp[index].title
        each.score = temp[index].score
        each.iplist = []
        for (var n in temp[index].ip) {
          each.iplist.push(temp[index].ip[n].value)
        }
        each.map = []
        for (var i in temp[index].map.column) {
          var eachmap = {
            'ip': each.iplist[i],
            whether: {}
          }
          for (var j in temp[index].map.column[i]['connected']) {
            eachmap.whether[each.iplist[j]] = temp[index].map.column[i]['connected'][j]
          }
          each.map.push(eachmap)
        }
        list.push(each)
      }
      return list
    }
  }
}
</script>
