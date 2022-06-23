import request from '@/utils/request'

// SPU 模块中与 SKU 相关的接口 
// 获取当前 spu 的图片的接口
// /admin/product/spuImageList/{spuId}  method：GET
export const reqSpuImageList = (spuId) => request.get(`/admin/product/spuImageList/${spuId}`)

// 获取当前 spu 的销售属性的接口
// /admin/product/spuSaleAttrList/{spuId}  method： GET
export const reqSpuSaleAttrList =  (spuId) => request.get(`/admin/product/spuSaleAttrList/${spuId}`)

// 获取平台属性的数据
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   method： GET
export  const reqAttrInfoList = (category1Id, category2Id, category3Id) => request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)

// 添加 SKU
// /admin/product/saveSkuInfo  method: GET
export const reqAddSku = (skuInfo) => request({url:'/admin/product/saveSkuInfo', method: 'POST', data:skuInfo})


// SKU 模块的接口
// 获取 sku 列表的数据
// /admin/product/list/{page}/{pageSize}  method: GET
export const reqSkuList = (page,pageSize) => request.get(`/admin/product/list/${page}/${pageSize}`)

// 上架的接口
// /admin/product/onSale/{skuId}  method: GET
export const reqSkuOnSale = (skuId) => request.get(`/admin/product/onSale/${skuId}`)

// 下架的接口
// /admin/product/cancelSale/{skuId}  method： GET
export const reqSkuCancelSale = (skuId) => request.get(`/admin/product/cancelSale/${skuId}`)

// 获取 SKU 详情的接口
// /admin/product/getSkuById/{skuId}  method： GET
export const reqSkuById = (skuId) => request.get(`admin/product/getSkuById/${skuId}`)

// 删除 sku
// /admin/product/deleteSku/{skuId}  method：DELETE
export const reqDeleteSku = (skuId) => request.delete(`/admin/product/deleteSku/${skuId}`)