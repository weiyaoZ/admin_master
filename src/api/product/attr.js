// 平台属性管理模块请求文件
import request from '@/utils/request'

// 获取一级分类数据的接口
// /admin/product/getCategory1  method：get
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1`, method: 'GET' })

// 获取二级分类数据的接口
// /admin/product/getCategory2/{category1ID}  method：get
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'GET' })

// 获取三级分类数据的接口
// /admin/product/getCategory3/{category2ID}  method：get
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'GET' })

// 获取平台商品属性的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'GET' })

// 添加属性和属性值
// /admin/product/saveAttrInfo  method：post
export const reqAddOrUpdateAttr = (attrInfo) => request({ url: '/admin/product/saveAttrInfo', method: 'POST', data: attrInfo })

// 删除属性的接口
// /admin/product/deleteAttr/{attrId}  method : delete
export const deleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'DELETE' })