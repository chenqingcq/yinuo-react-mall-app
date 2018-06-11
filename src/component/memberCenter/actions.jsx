import AppService from '../../common/utils/app.service'
export const uploadFile = AppService.uploadFile


// TODO 会员信息
const member_info = 'member/memberInfo'
export function getMemberInfo() {  // 获取会员信息
  return AppService.getRequest(`${member_info}/get`)
}

export function updateMemberInfo(params) {  // 更新会员信息
  return AppService.postRequest(`${member_info}/update`,params)
}


// TODO 会员人脉
const member_contacts = 'member/memberContacts'
export function getMemberContactList(params) {  // 获取人脉列表接口
  return AppService.getRequest(`${member_contacts}/search`, params)
}

export function getMemberContactsCount(params) { // 获取人脉人数
  return AppService.getRequest(`${member_contacts}/contactsCount`, params)
}

// TODO 会员收货地址
const member_address = 'member/memberAddress'
export function getMemberAddressList(params) {  // 获取会员地址列表
  return AppService.getRequest(`${member_address}/list`, params)
}
export function getMemberAddressDetail(params) {  // 获取会员地址详情
  return AppService.getRequest(`${member_address}/get`, params)
}
export function createMemberAddress(params) {  // 创建地址
  return AppService.postRequest(`${member_address}/create`, params)
}
export function updateMemberAddress(params) {  // 更新地址
  return AppService.postRequest(`${member_address}/update`, params)
}
export function deleteMemberAddress(params) {  // 删除地址
  return AppService.postRequest(`${member_address}/delete`, params)
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



// 会员注册日志
const register_log_host = 'boss/setAreaCode';
export function getMemberRegisterLogList(params) {
  return AppService.getRequest(`${register_log_host}`, params)
}