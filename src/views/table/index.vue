<template>
  <div class="app-container">
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
      <el-table-column label="Map" align="center" width="100">
        <template slot-scope="scope">
          <el-button class="el-icon-search" @click="onViewMap(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Score" width="110" align="center">
        <template slot-scope="scope">
          {{ !!!scope.row.score? "Not rated":scope.row.score }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="scope">
          <el-button class="el-icon-edit" :disabled="scope.row.score != 0" @click="editProject(scope.$index, scope.row)" />
          <el-button class="el-icon-delete" :disabled="scope.row.score != 0" @click="deleteProject(scope.$index, scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Edit Project" :visible.sync="dialogFormVisible" width="1000px">
      <el-form ref="temp" :model="temp" label-width="120px">
        <el-form-item label="Title">
          <el-input v-model="temp.title" style="width:300px" />
        </el-form-item>
        <el-form-item label="New Ip">
          <el-input v-model="temp.newip" style="width:300px" /> <el-button style="width:80px" type="primary" @click="onNewIp">Add</el-button>
        </el-form-item>
        <el-form-item label="Ip List">
          <el-select v-model="temp.selectip" style="width:300px" placeholder="Please select IP you want to delete">
            <el-option v-for="ip in temp.iplist" v-bind:key="ip" v-bind:value="ip" />
          </el-select>
          <el-button style="width:80px" type="primary" @click="onDeleteIp">Delete</el-button>
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
          <el-button style="width:150px" type="primary" @click="onUpdate">Update</el-button>
          <el-button style="width:150px" @click="onCancle">Cancle</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="temp.title" :visible.sync="ViewdialogFormVisible" width="1000px">
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
    </el-dialog>

  </div>
</template>

<script>
import { getList, deleteProject, updateProject } from '@/api/table'

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
      dialogFormVisible: false,
      ViewdialogFormVisible: false,
      temp: {
        id: '',
        index: 0,
        title: '',
        newip: '',
        selectip: '',
        iplist: [],
        map: []
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
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
    editProject(index, data) {
      this.temp = data
      this.temp.index = index
      this.dialogFormVisible = true
    },
    deleteProject(index, id) {
      deleteProject({ 'id': id }).then((res) => {
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
    onUpdate() {
      if (this.temp.iplist.length === 1) {
        this.$message({
          message: 'IP number wrong!',
          type: 'error'
        })
        return
      }
      var data = {
        'id': this.temp.id,
        'title': this.temp.title,
        'ip': [],
        'map': []
      }
      for (var i in this.temp.iplist) {
        data.ip.push({ 'id': i, 'value': this.temp.iplist[i] })
        var map = this.temp.map[i].whether
        var connect = { 'connected': [] }
        for (var j in this.temp.iplist) {
          connect['connected'].push(map[this.temp.iplist[j]])
        }
        data.map.push(connect)
      }
      updateProject(data)
        .then((res) => {
          this.$message({
            message: 'Update Project Successfully!',
            type: 'success'
          })
          this.list[this.temp.index] = this.temp
          this.dialogFormVisible = false
        })
        .catch(() => {
          this.$message({
            message: 'Error!',
            type: 'error'
          })
        })
    },
    onViewMap(data) {
      this.temp.title = data.title
      this.temp.iplist = data.iplist
      this.temp.map = data.map
      this.ViewdialogFormVisible = true
    },
    onDeleteIp() {
      this.temp.iplist.splice(this.temp.iplist.indexOf(this.temp.selectip), 1)
      var removeIndex = 0
      for (var index in this.temp.map) {
        if (this.temp.map[index]['ip'] === this.temp.selectip) {
          removeIndex = index
        }
        delete this.temp.map[index].whether[this.temp.selectip]
      }
      this.temp.map.splice(removeIndex, 1)
      this.temp.selectip = ''
      this.$message({
        message: 'Delete ' + this.temp.selectip,
        type: 'warning'
      })
    },
    onCancle() {
      this.ViewdialogFormVisible = false
      this.dialogFormVisible = false
    },
    onNewIp() {
      var newip = this.temp.newip
      var pattern = new RegExp('^((25[0-5]|2[0-4]\\d|[1]{1}\\d{1}\\d{1}|[1-9]{1}\\d{1}|\\d{1})($|(?!\\.$)\\.)){4}$')
      if (this.temp.iplist.indexOf(newip) >= 0) {
        this.$message({
          message: 'IP exists',
          type: 'error'
        })
        return
      }
      if (this.temp.newip.length <= 16 && pattern.test(newip)) {
        this.$message({
          message: 'Add IP successfully!',
          type: 'success'
        })
        var newipmap = {
          'ip': newip,
          whether: {}
        }
        newipmap['whether'][newip] = true
        for (var index in this.temp.map) {
          this.temp.map[index]['whether'][newip] = false
          newipmap['whether'][this.temp.map[index]['ip']] = false
        }
        this.temp.map.push(newipmap)
        this.temp.iplist.push(newip)
        this.temp.newip = ''
      } else {
        this.$message({
          message: 'IP format error!',
          type: 'error'
        })
      }
    }
  }
}
</script>
