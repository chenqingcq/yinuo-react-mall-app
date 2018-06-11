import AppService from '../../common/utils/app.service'
export const uploadFile = AppService.uploadFile

// TODO 店铺信息
const shop_info = 'shop/shopInfo'
export function getShopInfo() { //获取店铺信息
  return AppService.getRequest(`${shop_info}/getMyShop`)
}
export function updateShopInfo(params) { //更新店铺信息
  return AppService.postRequest(`${shop_info}/updateBaseInfo`,params)
}

// TODO 店铺发货地址
const shop_delivery_address = 'shop/shopDeliveryAddress'
export function getShopDeliveryAddress(params) {  // 获取店铺发货列表
  return AppService.getRequest(`${shop_delivery_address}/list`, params)
}
export function getShopDeliveryAddressDetail(params) {  // 获取店铺发货详情
  return AppService.getRequest(`${shop_delivery_address}/get`, params)
}
export function createShopDeliveryAddress(params) {  // 创建店铺发货
  return AppService.postRequest(`${shop_delivery_address}/create`, params)
}
export function updateShopDeliveryAddress(params) {  // 更新店铺发货
  return AppService.postRequest(`${shop_delivery_address}/update`, params)
}
export function deleteShopDeliveryAddress(params) {  // 删除店铺发货
  return AppService.postRequest(`${shop_delivery_address}/delete`, params)
}

// TODO 店铺轮播图
const shop_carousel_map = 'shop/shopCarouselMap'
export function getShopCarouselMapList(params) {  // 获取店铺轮播图列表
  return AppService.getRequest(`${shop_carousel_map}/list`, params)
}
export function getShopCarouselMapDetail(params) {  // 获取店铺轮播图详情
  return AppService.getRequest(`${shop_carousel_map}/get`, params)
}
export function createShopCarousel(params) {  // 创建店铺轮播图
  return AppService.postRequest(`${shop_carousel_map}/create`, params)
}
export function updateShopCarousel(params) {  // 更新店铺轮播图
  return AppService.postRequest(`${shop_carousel_map}/update`, params)
}
export function deleteShopCarousel(params) {  // 删除店铺轮播图
  return AppService.postRequest(`${shop_carousel_map}/delete`, params)
}
export function updateShopCarouselSort(params) {  // 店铺轮播图更改序号
  return AppService.postRequest(`${shop_carousel_map}/sort`, params)
}

// TODO 店铺图片
const shop_photo = 'shop/shopPhoto'
export function getShopPhotoList(params) {  // 获取店铺轮播图列表
  return AppService.getRequest(`${shop_photo}/list`, params)
}
export function getShopPhotoDetail(params) {  // 获取店铺轮播图详情
  return AppService.getRequest(`${shop_photo}/get`, params)
}
export function createShopPhoto(params) {  // 创建店铺轮播图
  return AppService.postRequest(`${shop_photo}/create`, params)
}
export function updateShopPhoto(params) {  // 更新店铺轮播图
  return AppService.postRequest(`${shop_photo}/update`, params)
}
export function deleteShopPhoto(params) {  // 删除店铺轮播图
  return AppService.postRequest(`${shop_photo}/delete`, params)
}
export function updateShopPhotoSort(params) {  // 店铺轮播图更改序号
  return AppService.postRequest(`${shop_photo}/sort`, params)
}

//TODO 店铺广告位申请
const shop_ad_apply = 'shop/shopAdApply'
export function createShopAdApply(params) {  // 新增广告位申请
  return AppService.postRequest(`${shop_ad_apply}/create`, params)
}
export function deleteShopAdApply(params) {  // 删除广告位申请
  return AppService.postRequest(`${shop_ad_apply}/delete`, params)
}
export function getShopAdApplyDetail(params) {  // 获取广告位申请详情
  return AppService.getRequest(`${shop_ad_apply}/get`, params)
}
export function getShopAdApplyList(params) {  // 获取广告位申请列表
  return AppService.getRequest(`${shop_ad_apply}/list`, params)
}
export function updateShopAdApply(params) {  // 更新广告位申请详情
  return AppService.postRequest(`${shop_ad_apply}/update`, params)
}

export function shopAdAdPositions(params) {  // 平台可申请广告位列表
  return AppService.getRequest(`${shop_ad_apply}/listAdPositions`, params)
}
export function shopAdWithdraw(params) {  //广告位申请撤回
  return AppService.postRequest(`${shop_ad_apply}/withdraw`, params)
}

//TODO seo关键词
const shop_shopSeo = 'shop/shopSeo'
export function createShopSeo(params) {  // 新增关键词
  return AppService.postRequest(`${shop_shopSeo}/create`, params)
}
export function deleteShopSeo(params) {  // 删除关键词
  return AppService.postRequest(`${shop_shopSeo}/delete`, params)
}
export function getShopSeoList(params) {  // 获取关键词列表
  return AppService.getRequest(`${shop_shopSeo}/list`, params)
}
export function updateShopSeo(params) {  // 更新关键词
  return AppService.postRequest(`${shop_shopSeo}/update`, params)
}

//TODO 运费模板
const shop_shopShipTpl = 'shop/shopShipTpl'
export function createShopShipTpl(params) {  // 新增运费模板
  return AppService.postRequest(`${shop_shopShipTpl}/create`, params)
}
export function deleteShopShipTpl(params) {  // 删除运费模板
  return AppService.postRequest(`${shop_shopShipTpl}/delete`, params)
}
export function getShopShipTplList(params) {  // 获取运费模板列表
  return AppService.getRequest(`${shop_shopShipTpl}/list`, params)
}
export function getShopShipTplDetail(params) {  // 获取运费模板详情
  return AppService.getRequest(`${shop_shopShipTpl}/get`, params)
}
export function updateShopShipTpl(params) {  // 更新运费模板
  return AppService.postRequest(`${shop_shopShipTpl}/update`, params)
}
export function setDefaultShopShipTpl(params) {  //  设置默认模板
  return AppService.postRequest(`${shop_shopShipTpl}/setDefault`, params)
}

// 地区
const area_host = 'boss/setAreaCode'
export function getProvinceList(params) {
  return AppService.getRequest(`${area_host}/listProvinces`, params)
}

export function getListParentId(params) {
  return AppService.getRequest(`${area_host}/listByParentId`, params)
}

export function getParentPaths(params) {
  return AppService.getRequest(`${area_host}/getParentPaths`, params)
}

export function getListProvincesAndCities(params) {
  return AppService.getRequest(`${area_host}/listProvincesAndCities`, params)
}