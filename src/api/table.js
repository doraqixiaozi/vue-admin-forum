import request from '@/utils/request'
const prefix='base';
export function getList(params) {
  return request({
    url: prefix+'/city/list',
    method: 'get',
    params
  })
}
