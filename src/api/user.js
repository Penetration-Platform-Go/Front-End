import request from '@/utils/request'
import Qs from 'qs'

export function login(userInfo) {
  return request({
    url: 'http://localhost:8001/auth',
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
    url: 'http://localhost:8001/userinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
