import request from '@/utils/request'

export function getList() {
  return request({
    url: 'http://localhost:8002/api/project/',
    method: 'get'
  })
}

export function getListAdmin() {
  return request({
    url: 'http://localhost:8003/admin/project/',
    method: 'get'
  })
}

export function createProject(params) {
  return request({
    url: 'http://localhost:8002/api/project/',
    method: 'post',
    data: {
      'ip': params['ip'],
      'map': {
        'column': params['map']
      },
      'title': params['title']
    }
  })
}

export function deleteProject(params) {
  return request({
    url: 'http://localhost:8002/api/project/?id=' + params['id'],
    method: 'delete'
  })
}

export function deleteProjectAdmin(params) {
  return request({
    url: 'http://localhost:8003/admin/project/?id=' + params['id'],
    method: 'delete'
  })
}

export function updateProject(params) {
  return request({
    url: 'http://localhost:8002/api/project/',
    method: 'put',
    data: {
      'id': params['id'],
      'ip': params['ip'],
      'map': {
        'column': params['map']
      },
      'title': params['title']
    }
  })
}
export function updateProjectAdmin(params) {
  return request({
    url: 'http://localhost:8003/admin/project/score',
    method: 'put',
    data: {
      'id': params['id'],
      'score': parseInt(params['score'])
    }
  })
}

export function QueryListAdmin(params) {
  if (params.title !== '') {
    return request({
      url: 'http://localhost:8003/admin/project/title?title=' + params.title,
      method: 'get'
    })
  }
  if (params.author !== '') {
    return request({
      url: 'http://localhost:8003/admin/project/user?username=' + params.author,
      method: 'get'
    })
  }
}

export function adminGetInfo() {
  return request({
    url: 'http://localhost:8003/admin/info/',
    method: 'get'
  })
}
