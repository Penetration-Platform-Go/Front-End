<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="200px">
      <el-form-item label="Project Title">
        <el-input v-model="form.Title" style="width:300px" placeholder="Project Name" />
      </el-form-item>
      <el-form-item label="New Equipment">
        <el-input v-model="NewEquipment.name" style="width:300px" placeholder="New equipment name" />
        <el-select v-model="NewEquipmentType" style="width:300px" placeholder="New equipment type">
          <el-option v-for="e in form.EquipmentsType" :key="e" :value="e" />
        </el-select>
        <el-button style="width:80px" type="primary" @click="onAddEquipment">Add</el-button>
      </el-form-item>
      <el-form-item label="Equipment List">
        <el-select v-model="form.DeleteEquipment" style="width:300px" placeholder="Equipment Delete">
          <el-option v-for="e in form.EquipmentList" :key="e.name" :value="e.name" />
        </el-select>
        <el-button style="width:80px" type="primary" @click="onDeleteEquipment">Delete</el-button>
      </el-form-item>
      <el-table
        v-model="form"
        :data="form.EquipmentList"
        border
        fit
        highlight-current-row
        max-height="400px"
        @row-click="onClickTableHead"
      >
        <el-table-column align="center" label="Equipment(click⬇️)" width="160px">
          <template slot-scope="scope">
            {{ scope.row.type + ':' + scope.row.name + (!!scope.row.ip.length?'('+scope.row.ip+')':'') }}
          </template>
        </el-table-column>
        <el-table-column v-for="e in form.EquipmentList" :key="e.name" :label="e.type + ':' + e.name + (!!e.ip.length?'('+e.ip+')':'')" align="center">
          <template slot-scope="scope">
            <el-switch v-model="form.MapTable[scope.$index][form.EquipmentList.indexOf(e)]" :disabled="form.EquipmentList.indexOf(e) >= scope.$index ? true : false" />
          </template>
        </el-table-column>
      </el-table>
      <el-form-item />
      <vis style="height: 500px; border: 1px solid lightgray;" :equipment-list="form.EquipmentList" :map-table="form.MapTable" />
      <el-form-item />
      <el-form-item>
        <el-button style="width:150px" type="primary" @click="onSubmit">Create</el-button>
        <el-button style="width:150px" @click="onCancel">Clear</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="Edit" :visible.sync="EditEquipmentVisible">
      <el-form ref="SelectEquipment" :model="form" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="form.SelectEquipment.name" style="width:300px" />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.SelectEquipment.type" style="width:300px" placeholder="Equipment type">
            <el-option v-for="e in form.EquipmentsType" :key="e" :value="e" />
          </el-select>
        </el-form-item>
        <el-form-item label="Add IP">
          <el-input v-model="form.SelectEquipment.NewIP" style="width:300px" placeholder="New IP" />
          <el-button style="width:80px" type="primary" @click="onAddIP">Add</el-button>
        </el-form-item>
        <el-form-item label="IP List">
          <el-select v-model="form.SelectEquipment.SelectIP" style="width:300px" placeholder="IP">
            <el-option v-for="ip in form.SelectEquipment.ip" :key="ip" :value="ip" />
          </el-select>
          <el-button style="width:80px" type="primary" @click="onDeleteIP">Delete</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width:150px" type="primary" @click="onEditEquipment">Change</el-button>
          <el-button style="width:150px" @click="onCancleEditEquipment">Cancle</el-button>
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

import { CreateProject } from '@/api/table'
import vis from '@/components/Network/index'

export default {
  components: { vis },
  provide() {
    return {
      onDoubleClickNode: this.onDoubleClickNode,
      onClickNode: this.onClickNode
    }
  },
  data() {
    return {
      form: {
        Title: '',
        EquipmentsType: ['PC', 'Route', 'Switch'],
        EquipmentList: [{
          name: 'PC-0',
          type: 'PC',
          ip: ['192.168.0.100/24']
        }],
        MapTable: [[true]],
        SelectEquipment: {
          index: 0,
          name: '',
          type: '',
          ip: [],
          SelectIP: '',
          NewIP: ''
        },
        DeleteEquipment: ''
      },
      EditEquipmentVisible: false,
      NewEquipment: {
        name: 'PC-1',
        type: '',
        ip: []
      },
      NewEquipmentType: 'PC',
      Node: {
        SelectEquipment: {
          name: '',
          ip: []
        }
      },
      ViewNodeInfoVisible: false
    }
  },
  watch: {
    NewEquipmentType: {
      handler(val, oldVal) {
        this.getNewEquipmentName(0)
      },
      deep: true
    }
  },
  methods: {
    onSubmit() {
      if (this.form.Title === '') {
        this.$message({
          message: 'Project title empty!',
          type: 'warning'
        })
        return
      }
      if (this.form.EquipmentList.length === 1) {
        this.$message({
          message: 'Equipment number wrong!',
          type: 'error'
        })
        return
      }
      var data = {
        'title': this.form.Title,
        'equipment': this.form.EquipmentList,
        'map': []
      }
      for (var i in this.form.MapTable) {
        if (this.form.EquipmentList[i].ip.length === 0) {
          this.$message({
            message: 'Some equipments\' IP wrong!',
            type: 'error'
          })
          return
        }
        var temp = {
          'connected': []
        }
        for (var j in this.form.MapTable[i]) {
          temp['connected'].push(this.form.MapTable[i][j])
        }
        data['map'].push(temp)
      }
      CreateProject(data)
        .then((res) => {
          this.form.Title = ''
          this.NewEquipment = {
            name: 'PC-1',
            type: 'PC',
            ip: []
          }
          this.form.DeleteEquipment = ''
          this.form.EquipmentList = [{
            name: 'PC-0',
            type: 'PC',
            ip: ['192.168.0.100/24']
          }]
          this.form.MapTable = [[true]]
          this.$message({
            message: 'Create Project Successfully!',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message({
            message: 'Error!',
            type: 'error'
          })
        })
    },
    onCancel() {
      this.form.Title = ''
      this.NewEquipment = {
        name: 'PC-1',
        type: 'PC',
        ip: []
      }
      this.form.DeleteEquipment = ''
      this.form.EquipmentList = [{
        name: 'PC-0',
        type: 'PC',
        ip: ['192.168.0.100/24']
      }]
      this.form.MapTable = [[true]]
      this.$message({
        message: 'Clear!',
        type: 'warning'
      })
    },
    onDeleteEquipment() {
      const removeIndex = this.getIndexByName(this.form.DeleteEquipment)
      this.form.EquipmentList.splice(removeIndex, 1)
      this.form.MapTable.splice(removeIndex, 1)
      for (var i = 0; i < this.form.MapTable.length; i++) {
        this.form.MapTable[i].splice(removeIndex, 1)
      }
      this.$message({
        message: 'Delete ' + this.form.DeleteEquipment,
        type: 'warning'
      })
      this.form.DeleteEquipment = ''
    },
    onClickTableHead(row, column, event) {
      if (column.realWidth) {
        return
      }
      this.form.SelectEquipment.name = row.name
      this.form.SelectEquipment.type = row.type
      this.form.SelectEquipment.SelectIP = ''
      this.form.SelectEquipment.ip = row.ip
      this.form.SelectEquipment.index = this.getIndexByName(row.name)
      this.EditEquipmentVisible = true
    },
    onClickNode(index) {
      this.Node.SelectEquipment = this.form.EquipmentList[index]
      this.ViewNodeInfoVisible = true
    },
    onDoubleClickNode(index) {
      this.form.SelectEquipment.name = this.form.EquipmentList[index].name
      this.form.SelectEquipment.type = this.form.EquipmentList[index].type
      this.form.SelectEquipment.ip = this.form.EquipmentList[index].ip
      this.form.SelectEquipment.SelectIP = ''
      this.form.SelectEquipment.index = index
      this.EditEquipmentVisible = true
    },
    onEditEquipment() {
      // TODO: integrate into function
      var selectEquipment = this.form.SelectEquipment
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
      this.form.EquipmentList[index].name = selectEquipment.name
      this.form.EquipmentList[index].type = selectEquipment.type
      this.form.EquipmentList[index].ip = selectEquipment.ip
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
      this.NewEquipment.type = this.NewEquipmentType
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
      for (var i = 0; i < this.form.EquipmentList.length; i++) {
        newEquipmentMap.push(false)
        this.form.MapTable[i].push(false)
      }
      newEquipmentMap.push(true)
      this.form.MapTable.push(newEquipmentMap)
      this.form.EquipmentList.push(newEquipment)
      this.$message({
        message: 'Add Equipment successfully!',
        type: 'success'
      })
      this.NewEquipment = {
        name: '',
        type: this.NewEquipmentType,
        ip: []
      }
      this.getNewEquipmentName(0)
    },
    onAddIP() {
      if (!this.checkIP(this.form.SelectEquipment.NewIP)) {
        this.$message({
          message: 'IP format error',
          type: 'error'
        })
        return
      }
      if (this.form.SelectEquipment.ip.indexOf(this.form.SelectEquipment.NewIP) >= 0) {
        this.$message({
          message: 'IP exists',
          type: 'error'
        })
        return
      }
      this.form.SelectEquipment.ip.push(this.form.SelectEquipment.NewIP)
      this.form.SelectEquipment.NewIP = ''
    },
    onDeleteIP() {
      for (var i = 0; i < this.form.SelectEquipment.ip.length; i++) {
        if (this.form.SelectEquipment.ip[i] === this.form.SelectEquipment.SelectIP) {
          this.form.SelectEquipment.ip.splice(i, 1)
          this.form.SelectEquipment.SelectIP = ''
          return
        }
      }
    },
    getNewEquipmentName(index) {
      this.NewEquipment.name = this.NewEquipmentType + '-' + index
      for (var i = 0; i < this.form.EquipmentList.length; i++) {
        if (this.NewEquipment.name === this.form.EquipmentList[i].name) {
          return this.getNewEquipmentName(index + 1)
        }
      }
    },
    getIndexByName(name) {
      for (var i = 0; i < this.form.EquipmentList.length; i++) {
        if (name === this.form.EquipmentList[i].name) {
          return i
        }
      }
      return -1
    },
    checkIP(ip) {
      var pattern = new RegExp(/^((25[0-5]|2[0-4]\d|[1]\d{2}|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|[1]\d{2}|[1-9]\d|\d)(\/(\d|[1-2]\d|3[0-2]))?$/)
      if (pattern.test(ip)) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

