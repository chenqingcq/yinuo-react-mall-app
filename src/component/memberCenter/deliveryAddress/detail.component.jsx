import {Link} from 'react-router-dom';
import {Form, Input, Breadcrumb, Button, Cascader, Radio} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import * as Actions from '../actions'
import Utils from '../../../common/utils/utils'

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_not_add: false, // 添加模式、编辑模式的判断
      formValible: true, // 审核结果决定编辑模式下表单是否可编辑
      detail: "",
      isLoading: false,
      options: [],
      selectedAreaId:[], // 选择区域id
      selectedAreaOptios:[]
    }
  }

  componentDidMount() {
    let _this = this, {match} = this.props, id = match.params.id;
    if (id !== undefined) {
      this.setState({
        is_not_add: true
      })
      _this.getDetail(id);
    }
    this.getProvinceList()
  }

  // 获取地区列表
  getProvinceList = () => {
    let _this = this;
    Actions.getProvinceList().then(response => {
      if (response.code == 0) {
        let options = response.data.map(record => {
          return {
            value: record.id,
            areaCode:record.areaCode,
            mergeName:record.mergerName,
            label: record.name,
            isLeaf: false,
          }
        })
        _this.setState({options})
      }
    })
  }

  // 获取地址详情
  getDetail = (id) => {
    let _this = this;
    Actions.getMemberAddressDetail({id:id}).then(response => {
      if (response.code == 0) {
        _this.setState({
          detail:response.data
        })
        this.getParentPaths(response.data)
      }
    })
  }

  // 根据AreaCode获取所有父层区域
  getParentPaths = (el) => {
    Actions.getParentPaths({
      areaCode:el.areaCode
    }).then(response => {
      if (response.code == 0) {
        let selectedAreaId = [el.areaId];
        response.data.forEach((item,index) => {
          selectedAreaId.unshift(item.id)
        })
        this.setState({
          selectedAreaId
        })
        this.backfillArea(selectedAreaId)
      }
    })
  }

  // 循环回填所在地区
  backfillArea = selectedAreaId => {
    let _this = this;
    let selectedOptions = [];
    let options = this.state.options;
    const loop = data =>
      data.map(item => {
        if(item.children) {
          loop(item.children)
        }
        if (item.value === selectedAreaId[selectedOptions.length]) {
          selectedOptions.push(item);
          _this.loadData(selectedOptions, res => {
            if (res.code === 0) {
              loop(_this.state.options);
            }
          });
        }
      });
    loop(_this.state.options);
  };

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault()
    let {match, history} = this.props, _this = this, id = match.params.id;
    let { selectedAreaOptios, detail } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        delete values.email
        values.areaId = values.areaId[values.areaId.length - 1]
        if(selectedAreaOptios.length !== 0){
          selectedAreaOptios.forEach(element => {
            if(element.value === values.areaId){
              values.areaCode  = element.areaCode
              values.mergeName = element.mergeName
            }
          });
        }else{
          values.areaCode  = detail.areaCode
          values.mergeName = detail.mergeName
        }
        if (id !== undefined) {
          values.id = id
        }
        _this.setState({
          isLoading: true
        })
        if (id == undefined) {
          Actions.createMemberAddress(values).then(response => {
            if (response.code == 0) {
              Utils.dialog.success('保存成功', () => {
                history.push(`/members/deliverAddress/index`);
                _this.setState({
                  isLoading: false
                })
              })
            }else{
              _this.setState({
                isLoading: false
              });
            }
          })
        } else if (id !== undefined) {
          Actions.updateMemberAddress(values).then(response => {
            if (response.code == 0) {
              Utils.dialog.success('编辑成功', () => {
                history.push(`/members/deliverAddress/index`);
                _this.setState({
                  isLoading: false
                })
              })
            }else{
              _this.setState({
                isLoading: false
              });
            }
          })
        }

      }
    });
  }

  loadData = (selectedOptions,cb) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    Actions.getListParentId({
      parentId: Math.floor(targetOption.value)
    }).then(response => {
      targetOption.loading = false;
      if (response.code == 0) {
        targetOption.children = response.data.map(record => {
          return {
            value: record.id,
            areaCode:record.areaCode,
            mergeName:record.mergerName,
            label: record.name,
            isLeaf: record.level > 3 ? true :false,
          }
        })
        this.setState({
          options: [...this.state.options],
        });
        if (cb) {
          cb(response);
        }
      }
    })
  }

  onChangeArea = (value, selectedOptions) => {
    this.setState({
      selectedAreaId: value,
      selectedAreaOptios: selectedOptions
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {detail, is_not_add, selectedAreaId} = this.state
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={`/members/deliverAddress/index`}>
              <span>收货地址列表</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {is_not_add ? '收货地址详情' : '新增收货地址'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="收货人"
              hasFeedback
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请填写收货人',
                }],
                initialValue: detail.name
              })(
                <Input disabled={!this.state.formValible}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所在地区"
              hasFeedback
            >
              {getFieldDecorator('areaId',
                {
                  rules: [{
                    required: true,
                    message: '请选择所在地区!',
                    type: 'array'
                  }],
                  initialValue: selectedAreaId
                }
              )
              (
                <Cascader
                  options={this.state.options}
                  loadData={this.loadData}
                  onChange={this.onChangeArea.bind(this)}
                />
              )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="详细地址"
              hasFeedback
            >
              {getFieldDecorator('detailAddr', {
                rules: [{
                  required: true, message: '请填写详细地址',
                }],
                initialValue: detail.detailAddr
              })(
                <Input disabled={!this.state.formValible}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="手机号码"
              hasFeedback
            >
              {getFieldDecorator('phone', {
                rules: [{
                  required: true, message: '请填写手机号码',
                }],
                initialValue: detail.phone
              })(
                <Input disabled={!this.state.formValible}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="固定电话"
              hasFeedback
            >
              {getFieldDecorator('tel', {
                // rules: [{
                //   required: true, message: '请填写收货人',
                // }],
                initialValue: detail.tel
              })(
                <Input disabled={!this.state.formValible}/>
              )}
            </FormItem>
            {/* <FormItem
              {...formItemLayout}
              label="电子邮箱"
              hasFeedback
            >
              {getFieldDecorator('email', {
                initialValue: detail.email
              })(
                <Input disabled={!this.state.formValible}/>
              )}
            </FormItem> */}
            <FormItem
              {...formItemLayout}
              label="收货地址别名"
              hasFeedback
            >
              {getFieldDecorator('alias', {
                // rules: [{
                //   required: true, message: '请填写收货地址别名',
                // }],
                initialValue: detail.alias
              })(
                <Input disabled={!this.state.formValible}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="设置为默认地址"
              hasFeedback
            >
              {getFieldDecorator('isDefault', {
                // rules: [{
                //   required: true, message: '请填写收货地址别名',
                // }],
                initialValue: detail !== "" ? detail.isDefault : 1
              })(
                <RadioGroup>
                  <Radio value={0}>是</Radio>
                  <Radio value={1}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" size="large" disabled={this.state.isLoading}
                      loading={this.state.isLoading}>{this.state.isLoading ? '正在保存...' : '保存'}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
const DeliveryAddressDetailForm = Form.create()(Detail)
export default DeliveryAddressDetailForm