import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/admin/login',
    // url: '/user/login',
    // url: '/gathering/gathering',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/admin/info',
    // url: '/user/info',
    method: 'get',
    // params: {token},
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
}

export function logout() {
  return request({
    url: '/user/admin/logout',
    // url: '/user/logout',
    // url: '/gathering/gathering',
    method: 'post',

  })
}
