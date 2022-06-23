// 这个模块主要获取的是品牌管理的数据

import request from '@/utils/request'
// 获取品牌的列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'GET' })

// 添加品牌的接口
// /admin/product/baseTrademark/save   method:post  携带参数：品牌名称和品牌logo
// 切记：对于新增的品牌，给服务器传递参数，不需要传递 ID，ID 由服务器生成

// 修改品牌的接口
// /admin/product/baseTrademark/update  method:put 携带三个参数
// 切记：对于修改某一品牌的操作，前端携带的参数需要带上 ID
// 两者接口参数类似，，将其封装为一个函数来区分调用
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 带给服务器数据携带 ID --- 调用修改品牌信息的接口
  if (tradeMark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'PUT', data: tradeMark })
  } else {
    return request({ url: '/admin/product/baseTrademark/save', method: 'POST', data: tradeMark })
  }
}

// 删除品牌的接口
// /admin/product/baseTrademark/remove/{id} method: delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })