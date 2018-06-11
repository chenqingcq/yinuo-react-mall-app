import AppService from '../../common/utils/app.service'
export const uploadImgUrl = AppService.uploadImgUrl
// 订单
const order_info = 'order/orderInfo'

export function getOrderList(params) {
  return AppService.getRequest(`${order_info}/list`, params)
}

export function getOrderDetail(params) {
  return AppService.getRequest(`${order_info}/get`, params)
}

export function exportOrderList(params) {
  return AppService.getRequest(`${order_info}/export`, params)
}

export function batchDeliver(params) {
  return AppService.postRequest(`${order_info}/batchDeliver`, params)
}

// 退款/退货退款申请
const order_refund_apply = 'order/orderRefundApply'

export function getOrderRefundApplyList(params) {
  return AppService.getRequest(`${order_refund_apply}/list`, params)
}

export function getOrderRefundApplyDetail(params) {
  return AppService.getRequest(`${order_refund_apply}/get`, params)
}

export function handleOrderRefundApply(params) {
  return AppService.postRequest(`${order_refund_apply}/handle`, params)
}


// 获取店铺发货列表
const shop_delivery_address = 'shop/shopDeliveryAddress'
export function getShopDeliveryAddress(params) {  
  return AppService.getRequest(`${shop_delivery_address}/list`, params)
}