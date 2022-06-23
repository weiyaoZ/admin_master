// 将四个模块的请求接口函数统一暴露
import * as tradeMark from './product/tradeMark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'

// 权限相关的接口文件
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'
// 对外暴露
export default {
  tradeMark,
  attr,
  sku,
  spu,
  user,
  role,
  permission
}