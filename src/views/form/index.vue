<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Title">
        <el-input v-model="form.title" style="width:300px" />
      </el-form-item>
      <el-form-item label="New Ip">
        <el-input v-model="form.newip" style="width:300px" /> <el-button style="width:80px" type="primary" @click="onNewIp">Add</el-button>
      </el-form-item>
      <el-form-item label="Ip List">
        <el-select v-model="form.selectip" style="width:300px" placeholder="Please select IP you want to delete">
          <el-option v-for="ip in form.iplist" v-bind:key="ip" v-bind:value="ip" />
        </el-select>
        <el-button style="width:80px" type="primary" @click="onDeleteIp">Delete</el-button>
      </el-form-item>
      <el-table
        v-model="form"
        :data="form.map"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="IP" width="150px">
          <template slot-scope="scope">
            {{ scope.row.ip }}
          </template>
        </el-table-column>
        <el-table-column v-for="ip in form.iplist" v-bind:key="ip" v-bind:label="ip" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.whether[ip]" />
          </template>
        </el-table-column>
      </el-table>
      <el-form-item />
      <el-form-item>
        <el-button style="width:150px" type="primary" @click="onSubmit">Create</el-button>
        <el-button style="width:150px" @click="onCancel">Clear</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { createProject } from '@/api/table'

export default {
  data() {
    return {
      form: {
        title: '',
        newip: '',
        selectip: '',
        iplist: ['127.0.0.1'],
        map: [{ 'ip': '127.0.0.1', whether: { '127.0.0.1': true }}]
      }
    }
  },
  methods: {
    onSubmit() {
      if (this.form.iplist.length === 1) {
        this.$message({
          message: 'IP number wrong!',
          type: 'error'
        })
        return
      }
      var data = {
        'title': this.form.title,
        'ip': [],
        'map': []
      }
      for (var i in this.form.iplist) {
        data.ip.push({ 'id': i, 'value': this.form.iplist[i] })
        var map = this.form.map[i].whether
        var connect = { 'connected': [] }
        for (var j in this.form.iplist) {
          connect['connected'].push(map[this.form.iplist[j]])
        }
        data.map.push(connect)
      }
      createProject(data)
        .then((res) => {
          this.form.title = ''
          this.form.newip = ''
          this.form.iplist = ['127.0.0.1']
          this.form.map = [{ 'ip': '127.0.0.1', whether: { '127.0.0.1': true }}]

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
      this.$message({
        message: 'Clear!',
        type: 'warning'
      })
      this.form.title = ''
      this.form.newip = ''
      this.form.iplist = ['127.0.0.1']
      this.form.map = [{ 'ip': '127.0.0.1', whether: { '127.0.0.1': true }}]
    },
    onDeleteIp() {
      this.form.iplist.splice(this.form.iplist.indexOf(this.form.selectip), 1)
      var removeIndex = 0
      for (var index in this.form.map) {
        if (this.form.map[index]['ip'] === this.form.selectip) {
          removeIndex = index
        }
        delete this.form.map[index].whether[this.form.selectip]
      }
      this.form.map.splice(removeIndex, 1)
      this.form.selectip = ''
      this.$message({
        message: 'Delete ' + this.form.selectip,
        type: 'warning'
      })
    },
    onNewIp() {
      var newip = this.form.newip
      var pattern = new RegExp('^((25[0-5]|2[0-4]\\d|[1]{1}\\d{1}\\d{1}|[1-9]{1}\\d{1}|\\d{1})($|(?!\\.$)\\.)){4}$')
      if (this.form.iplist.indexOf(newip) >= 0) {
        this.$message({
          message: 'IP exists',
          type: 'error'
        })
        return
      }
      if (this.form.newip.length <= 16 && pattern.test(newip)) {
        this.$message({
          message: 'Add IP successfully!',
          type: 'success'
        })
        var newipmap = {
          'ip': newip,
          whether: {}
        }
        newipmap['whether'][newip] = true
        for (var index in this.form.map) {
          this.form.map[index]['whether'][newip] = false
          newipmap['whether'][this.form.map[index]['ip']] = false
        }
        this.form.map.push(newipmap)
        this.form.iplist.push(newip)
        this.form.newip = ''
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

<style scoped>
.line{
  text-align: center;
}
</style>

