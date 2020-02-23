<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Avatar">
        <div class="components-container">
          <pan-thumb :image="image" />
          <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
            Change Avatar
          </el-button>
          <image-cropper
            v-show="imagecropperShow"
            :width="300"
            :height="300"
            url="http://localhost:8000/api/avatar"
            lang-type="en"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
        </div>
      </el-form-item>
      <el-form-item label="Username">
        <el-input v-model="form.username" disabled="disabled" style="width:300px" />
      </el-form-item>
      <el-form-item label="Role">
        <el-input v-model="form.role" disabled="disabled" style="width:300px" />
      </el-form-item>
      <el-form-item label="Nickname">
        <el-input v-model="form.nickname" style="width:300px" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" style="width:300px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Update</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import store from '../../store'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      form: {
        username: store.getters.username,
        role: store.getters.role.join(','),
        nickname: store.getters.name,
        email: store.getters.email,
        avatar: store.getters.avatar
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      image: store.getters.avatar
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/update', this.form)
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.image = 'http://localhost/platform/' + resData
      this.form.avatar = this.image
      this.$store.dispatch('user/avatar', this.image)
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>

