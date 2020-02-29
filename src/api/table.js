import request from '@/utils/request'

export function GetProjectList() {
  return request({
    url: 'http://localhost:8002/api/project/',
    method: 'get'
  })
}

export function GetProjectsAdmin() {
  return request({
    url: 'http://localhost:8003/admin/project/',
    method: 'get'
  })
}

export function CreateProject(params) {
  return request({
    url: 'http://localhost:8002/api/project/',
    method: 'post',
    data: {
      'equipment': params['equipment'],
      'map': {
        'column': params['map']
      },
      'title': params['title']
    }
  })
}

export function DeleteProject(params) {
  return request({
    url: 'http://localhost:8002/api/project/?id=' + params['id'],
    method: 'delete'
  })
}

export function DeleteProjectAdmin(params) {
  return request({
    url: 'http://localhost:8003/admin/project/?id=' + params['id'],
    method: 'delete'
  })
}

export function UpdateProject(params) {
  return request({
    url: 'http://localhost:8002/api/project/',
    method: 'put',
    data: {
      'id': params['id'],
      'equipment': params['equipment'],
      'map': {
        'column': params['map']
      },
      'title': params['title']
    }
  })
}
export function UpdateProjectAdmin(params) {
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
  if (params.Title !== '') {
    return request({
      url: 'http://localhost:8003/admin/project/title?title=' + params.Title,
      method: 'get'
    })
  }
  if (params.Author !== '') {
    return request({
      url: 'http://localhost:8003/admin/project/user?username=' + params.Author,
      method: 'get'
    })
  }
  return request({
    url: 'http://localhost:8003/admin/project/',
    method: 'get'
  })
}

export function AdminGetInfo() {
  return request({
    url: 'http://localhost:8003/admin/info/',
    method: 'get'
  })
}

export function GetScoreRobot(params) {
  return request({
    url: 'http://localhost:8003/admin/project/score?id=' + params.id,
    method: 'get'
  })
}
