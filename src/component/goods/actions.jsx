import AppService from "../../common/utils/app.service";
export const uploadFile = AppService.uploadFile;

const goodsInfo = `goods/publish`;

export function goodsPublish(params) { // 商品发布
  return AppService.postRequest(`${goodsInfo}/create`, params);
}

export function getGoodsDetail(params) { // 商品详情
  return AppService.getRequest(`${goodsInfo}/get`, params);
}

export function updateGoodsDetail(params) { // 更新商品
  return AppService.postRequest(`${goodsInfo}/update`, params);
}

export function getGoodsList(params) { // 商品列表
  return AppService.getRequest(`${goodsInfo}/listGoods`, params);
}

export function deleteGoods(params) { // 删除商品
  return AppService.postRequest(`${goodsInfo}/delete`, params);
}

export function offShelfGoods(params) { // 下架商品
  return AppService.postRequest(`${goodsInfo}/offShelf`, params);
}

export function onShelfGoods(params) { // 上架商品
  return AppService.postRequest(`${goodsInfo}/onShelf`, params);
}

export function getGoodsClasses(params) { // 商品分类
  return AppService.getRequest(`${goodsInfo}/listGoodsClass`, params);
}

export function getGoodSpec(params) { // 商品规格
  return AppService.getRequest(`${goodsInfo}/listSkuSpec`, params);
}

export function getGoodAttr(params) { // 商品属性
  return AppService.getRequest(`${goodsInfo}/listSpuAttr`, params);
}

export function getBrandList(params) { // 品牌列表
  return AppService.getRequest(`${goodsInfo}/listBrand`, params);
}

export function getListShopGoodsClass(params) { // 店铺商品分类列表
  return AppService.getRequest(`${goodsInfo}/listShopGoodsClass`, params);
}

export function getListDeliveryTime(params) { // 获取发货时间
  return AppService.getRequest(`${goodsInfo}/listDeliveryTime`, params);
}

export function updateSaleInfo(params) { // 修改sku价格
  return AppService.postRequest(`${goodsInfo}/updateSaleInfo`, params);
}

// TODO 运费模板
const shop_shopShipTpl = 'shop/shopShipTpl'
export function getShopShipTplList(params) {  // 获取运费模板列表
  return AppService.getRequest(`${shop_shopShipTpl}/list`, params)
}

// 获取店铺发货列表
const shop_delivery_address = 'shop/shopDeliveryAddress'
export function getShopDeliveryAddress(params) {  
  return AppService.getRequest(`${shop_delivery_address}/list`, params)
}


// TODO 商品分类
const shop_goods_class = 'goods/shopGoodsClass'

export function getShopGoodsClass(params) { // 商品分类列表
  return AppService.getRequest(`${shop_goods_class}/listAll`, params);
}

export function getShopGoodsClassDetail(params) { // 获取商品分类的详情
  return AppService.getRequest(`${shop_goods_class}/get`, params);
}

export function createShopGoodsClass(params) { // 创建商品分类
  return AppService.postRequest(`${shop_goods_class}/create`, params);
}

export function updateShopGoodsClass(params) { // 更新商品分类
  return AppService.postRequest(`${shop_goods_class}/update`, params);
}

export function deleteShopGoodsClass(params) { // 删除商品分类
  return AppService.postRequest(`${shop_goods_class}/delete`, params);
}

export function sortShopGoodsClass(params) { // 排序商品分类
  return AppService.postRequest(`${shop_goods_class}/sort`, params);
}