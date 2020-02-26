<template>
  <div class="app-container">
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
      <el-table-column label="Equipment number" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.EquipmentList.length }}
        </template>
      </el-table-column>
      <el-table-column label="MapTable" align="center" width="100">
        <template slot-scope="scope">
          <el-button class="el-icon-search" @click="onViewMap(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Score" width="110" align="center">
        <template slot-scope="scope">
          {{ !!!scope.row.Score? "Not rated":scope.row.Score }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="scope">
          <el-button class="el-icon-edit" :disabled="scope.row.Score != 0" @click="EditProject(scope.$index, scope.row)" />
          <el-button class="el-icon-delete" :disabled="scope.row.Score != 0" @click="DeleteProject(scope.$index, scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Edit Project" :visible.sync="EditProjectVisiable" width="1000px">
      <el-form ref="EditProjectData" :model="EditProjectData" label-width="150px">
        <el-form-item label="Project Title">
          <el-input v-model="EditProjectData.Title" style="width:300px" placeholder="Project Title" />
        </el-form-item>
        <el-form-item label="New Equipment">
          <el-input v-model="NewEquipment.name" style="width:300px" placeholder="New equipment name" />
          <el-select v-model="NewEquipment.type" style="width:300px" placeholder="New equipment type">
            <el-option v-for="e in EquipmentsType" v-bind:key="e" v-bind:value="e" />
          </el-select>
          <el-button style="width:80px" type="primary" @click="onAddEquipment">Add</el-button>
        </el-form-item>
        <el-form-item label="Delete Equipment">
          <el-select v-model="EditProjectData.DeleteEquipment" style="width:300px" placeholder="Equipment Delete">
            <el-option v-for="e in EditProjectData.EquipmentList" v-bind:key="e.name" v-bind:value="e.name" />
          </el-select>
          <el-button style="width:80px" type="primary" @click="onDeleteEquipment">Delete</el-button>
        </el-form-item>
        <el-table
          v-model="EditProjectData"
          :data="EditProjectData.EquipmentList"
          border
          fit
          highlight-current-row
          @row-click="onClickTableHead"
          max-height="400px"
        >
          <el-table-column align="center" label="Equipment" width="150px">
            <template slot-scope="scope">
              {{ scope.row.type + ':' + scope.row.name + (!!scope.row.ip.length?'('+scope.row.ip+')':'') }}
            </template>
          </el-table-column>
          <el-table-column v-for="e in EditProjectData.EquipmentList" v-bind:key="e.name" v-bind:label="e.type + ':' + e.name + (!!e.ip.length?'('+e.ip+')':'')" align="center">
            <template slot-scope="scope">
              <el-switch v-model="EditProjectData.MapTable[scope.$index][EditProjectData.EquipmentList.indexOf(e)]" v-bind:disabled="EditProjectData.EquipmentList.indexOf(e) >= scope.$index ? true : false" />
            </template>
          </el-table-column>
        </el-table>
        <el-form-item />
        <vis style="height: 500px; border: 1px solid lightgray;" :equipment-list="EditProjectData.EquipmentList" :map-table="EditProjectData.MapTable" />
        <el-form-item />
        <el-form-item>
          <el-button style="width:150px" type="primary" @click="onUpdateProject">Update</el-button>
          <el-button style="width:150px" @click="onCancelEditProject">Cancle</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="Edit" :visible.sync="EditEquipmentVisible">
      <el-form ref="SelectEquipment" :model="EditProjectData.SelectEquipment" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="EditProjectData.SelectEquipment.name" style="width:300px" />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="EditProjectData.SelectEquipment.type" style="width:300px" placeholder="Equipment type">
            <el-option v-for="e in EquipmentsType" v-bind:key="e" v-bind:value="e" />
          </el-select>
        </el-form-item>
        <el-form-item label="Add IP">
          <el-input v-model="EditProjectData.SelectEquipment.NewIP" style="width:300px" placeholder="New IP" />
          <el-button style="width:80px" type="primary" @click="onAddIP">Add</el-button>
        </el-form-item>
        <el-form-item label="Delete IP">
          <el-select v-model="EditProjectData.SelectEquipment.SelectIP" style="width:300px" placeholder="IP">
            <el-option v-for="ip in EditProjectData.SelectEquipment.ip" v-bind:key="ip" v-bind:value="ip" />
          </el-select>
          <el-button style="width:80px" type="primary" @click="onDeleteIP">Delete</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width:150px" type="primary" @click="onEditEquipment">Change</el-button>
          <el-button style="width:150px" @click="onCancleEditEquipment">Cancle</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="MapTable" :visible.sync="ViewMapTableVisible" width="1000px">
      <vis style="height: 500px; border: 1px solid lightgray;" :equipment-list="EditProjectData.EquipmentList" :map-table="EditProjectData.MapTable" />
    </el-dialog>

  </div>
</template>

<script>
import { GetProjectList, DeleteProject, UpdateProject } from '@/api/table'
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
      ProjectList: [],
      EditProjectData: {
        index: 0,
        EquipmentList: [],
        MapTable: [],
        Title: '',
        SelectEquipment: {
          name: '',
          type: '',
          ip: [],
          NewIP: '',
          SelectIP: ''
        },
        DeleteEquipment: ''
      },
      EquipmentsType: ['PC', 'Route'],
      NewEquipment: {
        name: '',
        type: '',
        ip: []
      },
      ListLoading: false,
      EditProjectVisiable: false,
      EditEquipmentVisible: false,
      ViewMapTableVisible: false
    }
  },
  watch: {
    NewEquipment: {
      handler(val, oldVal) {
        var number = {
          'PC': 0,
          'Route': 0
        }
        for (var i = 0; i < this.EditProjectData.EquipmentList.length; i++) {
          number[this.EditProjectData.EquipmentList[i].type]++
        }
        this.NewEquipment.name = this.NewEquipment.type + '-' + number[this.NewEquipment.type]
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.ListLoading = true
      GetProjectList().then(response => {
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
          this.ProjectList.push(each)
        }
        this.ListLoading = false
      })
    },
    EditProject(index, data) {
      this.EditProjectData.EquipmentList = data.EquipmentList
      this.EditProjectData.MapTable = data.MapTable
      this.EditProjectData.Title = data.Title
      this.EditProjectData.Id = data.Id
      this.EditProjectData.index = index
      this.EditProjectVisiable = true
    },
    DeleteProject(index, id) {
      DeleteProject({ 'id': id }).then((res) => {
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
    onUpdateProject() {
      var data = {
        'id': this.EditProjectData.Id,
        'title': this.EditProjectData.Title,
        'equipment': this.EditProjectData.EquipmentList,
        'map': []
      }
      for (var i in this.EditProjectData.MapTable) {
        if (this.EditProjectData.EquipmentList[i].ip.length === 0) {
          this.$message({
            message: 'Some equipments\' IP wrong!',
            type: 'error'
          })
          return
        }
        var temp = {
          'connected': []
        }
        for (var j in this.EditProjectData.MapTable[i]) {
          temp['connected'].push(this.EditProjectData.MapTable[i][j])
        }
        data['map'].push(temp)
      }
      UpdateProject(data).then(() => {
        const index = this.EditProjectData.index
        this.ProjectList[index].EquipmentList = this.EditProjectData.EquipmentList
        this.ProjectList[index].MapTable = this.EditProjectData.MapTable
        this.ProjectList[index].Title = this.EditProjectData.Title
        this.EditProjectData = {
          index: 0,
          EquipmentList: [],
          MapTable: [],
          Title: '',
          SelectEquipment: {
            name: '',
            type: '',
            ip: [],
            NewIP: '',
            SelectIP: ''
          },
          DeleteEquipment: ''
        }
        this.EditProjectVisiable = false
        this.$message({
          message: 'Update Project Successfully!',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: 'Error!',
          type: 'error'
        })
      })
    },
    onDeleteEquipment() {
      const removeIndex = this.getIndexByName(this.EditProjectData.DeleteEquipment)
      this.EditProjectData.EquipmentList.splice(removeIndex, 1)
      this.EditProjectData.MapTable.splice(removeIndex, 1)
      for (var i = 0; i < this.EditProjectData.MapTable.length; i++) {
        this.EditProjectData.MapTable[i].splice(removeIndex, 1)
      }
      this.$message({
        message: 'Delete ' + this.EditProjectData.DeleteEquipment,
        type: 'warning'
      })
      this.EditProjectData.DeleteEquipment = ''
    },
    onAddIP() {
      if (!this.checkIP(this.EditProjectData.SelectEquipment.NewIP)) {
        this.$message({
          message: 'IP format error',
          type: 'error'
        })
        return
      }
      if (this.EditProjectData.SelectEquipment.ip.indexOf(this.EditProjectData.SelectEquipment.NewIP) >= 0) {
        this.$message({
          message: 'IP exists',
          type: 'error'
        })
        return
      }
      this.EditProjectData.SelectEquipment.ip.push(this.EditProjectData.SelectEquipment.NewIP)
      this.EditProjectData.SelectEquipment.NewIP = ''
    },
    onDeleteIP() {
      for (var i = 0; i < this.EditProjectData.SelectEquipment.ip.length; i++) {
        if (this.EditProjectData.SelectEquipment.ip[i] === this.EditProjectData.SelectEquipment.SelectIP) {
          this.EditProjectData.SelectEquipment.ip.splice(i, 1)
          this.EditProjectData.SelectEquipment.SelectIP = ''
          return
        }
      }
    },
    onClickTableHead(row, column, event) {
      if (column.realWidth) {
        return
      }
      this.EditProjectData.SelectEquipment.name = row.name
      this.EditProjectData.SelectEquipment.type = row.type
      this.EditProjectData.SelectEquipment.ip = row.ip
      this.EditProjectData.SelectEquipment.index = this.getIndexByName(row.name)
      this.EditEquipmentVisible = true
    },
    onEditEquipment() {
      // TODO: integrate into function
      var selectEquipment = this.EditProjectData.SelectEquipment
      if (!(!!selectEquipment.name && !!selectEquipment.type)) {
        return
      }
      if (this.getIndexByName(selectEquipment.name) >= 0 && this.getIndexByName(selectEquipment.name) !== selectEquipment.index) {
        this.$message({
          message: 'Equipment name repeat!',
          type: 'error'
        })
        return
      }

      const index = selectEquipment.index
      this.EditProjectData.EquipmentList[index].name = selectEquipment.name
      this.EditProjectData.EquipmentList[index].type = selectEquipment.type
      this.EditProjectData.EquipmentList[index].ip = selectEquipment.ip
      this.EditEquipmentVisible = false
      this.$message({
        message: 'Edit equirement successfully!',
        type: 'success'
      })
    },
    onCancleEditEquipment() {
      this.EditEquipmentVisible = false
    },
    onAddEquipment() {
      var newEquipment = this.NewEquipment
      if (!(!!newEquipment.name && !!newEquipment.type)) {
        return
      }
      if (this.getIndexByName(newEquipment.name) >= 0) {
        this.$message({
          message: 'Equipment name repeat!',
          type: 'error'
        })
        return
      }
      var newEquipmentMap = []
      for (var i = 0; i < this.EditProjectData.EquipmentList.length; i++) {
        newEquipmentMap.push(false)
        this.EditProjectData.MapTable[i].push(false)
      }
      newEquipmentMap.push(true)
      this.EditProjectData.MapTable.push(newEquipmentMap)
      this.EditProjectData.EquipmentList.push(newEquipment)
      this.$message({
        message: 'Add Equipment successfully!',
        type: 'success'
      })
      this.NewEquipment = {
        name: '',
        type: newEquipment.type,
        ip: []
      }
    },
    onCancelEditProject() {
      this.EditProjectData = {
        index: 0,
        EquipmentList: [],
        MapTable: [],
        SelectEquipment: {
          name: '',
          type: '',
          ip: []
        },
        DeleteEquipment: ''
      }
      this.NewEquipment = {
        name: '',
        type: '',
        ip: []
      }
      this.EditProjectVisiable = false
    },
    onViewMap(data) {
      this.EditProjectData.EquipmentList = data.EquipmentList
      this.EditProjectData.MapTable = data.MapTable
      this.ViewMapTableVisible = true
    },
    getIndexByName(name) {
      for (var i = 0; i < this.EditProjectData.EquipmentList.length; i++) {
        if (name === this.EditProjectData.EquipmentList[i].name) {
          return i
        }
      }
      return -1
    },
    checkIP(ip) {
      var pattern = new RegExp(`^((25[0-5]|2[0-4]\\d|[1]{1}\\d{1}\\d{1}|[1-9]{1}\\d{1}|\\d{1})($|(?!\\.$)\\.)){4}$`)
      if (pattern.test(ip)) {
        return true
      }
      return false
    }
  }
}
</script>
