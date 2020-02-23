<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.author" placeholder="Author" style="width: 200px;" class="filter-item" />
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
      <el-table-column align="center" label="Index" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="250">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
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
      <el-table-column align="center" label="Actions" width="300">
        <template slot-scope="scope">
          <el-button class="el-icon-search" @click="onViewMap(scope.$index, scope.row)" />
          <el-button class="el-icon-edit" @click="updateProject(scope.$index, scope.row)" />
          <el-button class="el-icon-delete" @click="deleteProject(scope.$index, scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Score" :visible.sync="dialogFormVisible">
      <el-form ref="temp" :model="temp" label-width="120px">
        <el-form-item label="Score">
          <el-input v-model="temp.score" style="width:350px" />
        </el-form-item>
        <el-form-item>
          <el-button style="width:150px" type="primary" @click="onUpdate">Evaluate</el-button>
          <el-button style="width:150px" @click="onCancle">Cancle</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="temp.title" :visible.sync="ViewdialogFormVisible" width="1000px">
      <el-form ref="temp" :model="temp" label-width="120px">
        <el-form-item label="Score">
          <el-input v-model="temp.score" style="width:350px" />
        </el-form-item>
        <el-table
          v-model="temp"
          :data="temp.map"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="IP" width="150px">
            <template slot-scope="scope">
              {{ scope.row.ip }}
            </template>
          </el-table-column>
          <el-table-column v-for="ip in temp.iplist" v-bind:key="ip" v-bind:label="ip" align="center">
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
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getListAdmin, deleteProjectAdmin, updateProjectAdmin, QueryListAdmin } from '@/api/table'

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
      dialogFormVisible: false,
      temp: {
        index: 0,
        score: 0,
        title: '',
        iplist: [],
        map: []
      },
      listQuery: {
        title: '',
        author: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getListAdmin().then(response => {
        var temp = response.data
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
          this.list.push(each)
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      if (this.listQuery.author === '' && this.listQuery.title === '') {
        return
      }
      this.listLoading = true
      QueryListAdmin(this.listQuery).then(response => {
        this.list = []
        var temp = response.data
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
          this.list.push(each)
        }
        this.listLoading = false
      })
    },
    updateProject(index, data) {
      this.temp.id = data.id
      this.temp.index = index
      this.temp.score = data.score
      this.dialogFormVisible = true
    },
    onUpdate() {
      updateProjectAdmin({ 'id': this.temp.id, 'score': this.temp.score }).then((res) => {
        this.list[this.temp.index].score = this.temp.score
        this.$message({
          message: 'Evaluate Project Successfully!',
          type: 'success'
        })
        this.ViewdialogFormVisible = false
        this.dialogFormVisible = false
      }).catch(() => {
        this.$message({
          message: 'Error!',
          type: 'error'
        })
      })
    },
    onCancle() {
      this.ViewdialogFormVisible = false
      this.dialogFormVisible = false
    },
    deleteProject(index, id) {
      deleteProjectAdmin({ 'id': id }).then((res) => {
        this.list.splice(index, 1)
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
    onViewMap(index, data) {
      this.temp.id = data.id
      this.temp.index = index
      this.temp.title = data.title
      this.temp.iplist = data.iplist
      this.temp.map = data.map
      this.ViewdialogFormVisible = true
    }
  }
}
</script>
