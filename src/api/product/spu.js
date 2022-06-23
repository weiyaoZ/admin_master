import request from '@/utils/request'

// 获取 SPU 列表数据的接口
// /admin/product/{page}/{limit}  methods
export const reqSpuInfoList = (page, pageSize, category3Id) => request({ url: `/admin/product/${page}/${pageSize}`, method: 'GET', params: { category3Id } })

// 获取某个 SPU 信息
// /admin/product/getSpuById/{spuId}  method: GET 
export const reqSpuInfo = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'GET' })

// 获取品牌的信息
// /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'GET' })

// 获取 SPU 图片的接口
// /admin/product/spuImageList/{spuId}  method: GET
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'GET' })

// 获取产品全部的销售属性 --- 整个平台属性一共三个 
// /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'GET' })

// 修改SPU | 添加 SPU：对于修改或者添加，携带给服务器参数大致一样的，唯一区别就是携带的参数是否有 id
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带的参数包含 id --- 修改 SPU
  if (spuInfo.id) {
    return request({ url: '/admin/product/updateSpuInfo', method: 'POST', data: spuInfo })
  } else {
    return request({ url: '/admin/product/saveSpuInfo', method: 'POST', data: spuInfo })
  }
}

// 删除 SPU
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'DELETE'})

// 获取 SKU 列表的数据的接口
// /admin/product/findBySpuId/{spuId}  method: GET
export const reqSkuList = (spuId) => request({url:`/admin/product/findBySpuId/${spuId}`, method: 'GET'})

