import AppService from '../../common/utils/app.service'
export const uploadFile = AppService.uploadFile

// TODO 商品推荐
const goods_recommend = 'goods/recommend'
export function getGoodsRecommendList(params) {
  return AppService.getRequest(`${goods_recommend}/list`,params)
}
export function createGoodsRecommend(params) {
  return AppService.postRequest(`${goods_recommend}/create`,params)
}
export function sortGoodsRecommend(params) {
  return AppService.postRequest(`${goods_recommend}/sort`,params)
}
export function deleteGoodsRecommend(params) {
  return AppService.postRequest(`${goods_recommend}/delete`,params)
}

// TODO 商品列表
const goodsInfo = 'goods/publish'
export function getGoodsList(params) { // 商品列表
  return AppService.getRequest(`${goodsInfo}/listGoods`, params);
}