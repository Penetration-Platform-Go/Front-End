import request from '@/utils/request'
import Qs from 'qs'

export function login(userInfo) {
  return request({
    url: 'http://www.rowtoolong.cn:8001/auth',
    method: 'post',
    transformRequest: [function(data) {
      data = Qs.stringify(data)
      return data
    }],
    data: {
      'username': userInfo.username,
      'password': userInfo.password
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getInfo() {
  return request({
    url: 'http://www.rowtoolong.cn:8001/userinfo',
    method: 'get'
  })
}

export function register(userInfo) {
  return request({
    url: 'http://www.rowtoolong.cn:8000/api/user',
    method: 'post',
    transformRequest: [function(data) {
      data = Qs.stringify(data)
      return data
    }],
    data: {
      'username': userInfo.username,
      'password': userInfo.password,
      'email': userInfo.email,
      'nickname': userInfo.nickname,
      'photo': 'http://www.rowtoolong.cn/platform/init.png'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function update(userInfo) {
  return request({
    url: 'http://www.rowtoolong.cn:8000/api/user',
    method: 'put',
    transformRequest: [function(data) {
      data = Qs.stringify(data)
      return data
    }],
    data: {
      'username': userInfo.username,
      'email': userInfo.email,
      'nickname': userInfo.nickname,
      'photo': userInfo.photo
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function GetAllUsers() {
  return request({
    url: 'http://www.rowtoolong.cn:8003/admin/user/',
    method: 'get'
  })
}

export function GetUserByUsername(params) {
  return request({
    url: 'http://www.rowtoolong.cn:8003/admin/user/username?username=' + params.username,
    method: 'get'
  })
}

export function DeleteUser(params) {
  return request({
    url: 'http://www.rowtoolong.cn:8003/admin/user/username?username=' + params.username,
    method: 'delete'
  })
}
