import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Breadcrumb,
  Button,
  Cascader,
  Tabs,
  Tooltip,
  Icon,
  InputNumber,
  Radio,
  Select,
  Upload
} from "antd";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const { Option } = Select;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";

import styles from "../index.less";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {
        shopInfoVo:{},
        shopInfoExtendVo:{},
        shopOperateVos:[],
        shopSeoVos:[]
      },
      submitting: false,
      submittingLogo:false
    };
  }

  componentDidMount() {
    this.getMyInfo();
  }

  // 获取店铺信息
  getMyInfo = () => {
    let _this = this;
    Actions.getShopInfo().then(response => {
      if (response.code === 0) {
        this.setState({
          detail: response.data
        });
      }
    });
  };

  // 更新店铺基本信息
  handleSubmit = e => {
    e.preventDefault();
    let _this = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        _this.setState({
          submitting: true
        });
        values.id = _this.state.detail.id;
        values.benefitPercent = values.benefitPercent/100;
        Actions.updateShopInfo(values).then(response => {
          if (response.code == 0) {
            Utils.dialog.success("编辑成功");
            _this.setState({
              submitting: false
            });
          }
          let detail = _this.state.detail;
          _this.setState({ detail: Object.assign({}, detail, response.data) });
        });
      }
    });
  };

  // 更新店铺log
  handleSubmitLogo = e => {
    e.preventDefault();
    let _this = this;
    this.props.form.validateFieldsAndScroll(['logo'],(err, values) => {
      if (!err) {
        _this.setState({
          submittingLogo: true
        });
        values.id = _this.state.detail.id;
        Actions.updateShopInfo(values).then(response => {
          _this.setState({
            submittingLogo: false
          });
          if (response.code == 0) {
            Utils.dialog.success("编辑成功");
          }
          let detail = _this.state.detail;
          _this.setState({ detail: Object.assign({}, detail, response.data) });
        });
      }
    });
  };

  // 获取选中标签的key
  onChengeTabActiveKey = key => {
    // console.log(key)
  };

  // 上传图片之前
  beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Utils.dialog.error("图片大小不能超过2MB!");
    }
    return isLt2M;
  }

  // 图片改变
  shandleChange = (prop, { file, fileList }) => {
    if (file.response && file.response.code === 0) {
      let detail = this.state.detail;
      detail.shopInfoVo[prop] = file.response.data;
      this.setState({ detail });
    } else if (file.response && file.response.code !== 0) {
      Utils.dialog.error(file.response.errorMsg);
    }
  };

  // 上传图片时，转换返回的数据
  normFile = e => {
    let fileList = e.fileList
      .filter(file => {
        if (file.response) {
          if (file.response.code === 0) {
            file.url = file.response.data;
            return true;
          }
        }
        return true;
      })
      .slice(-1);
    return fileList[0].url;
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const { detail, submitting, submittingLogo } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };

    const props = {
      className: "avatar-uploader",
      action: Actions.uploadFile,
      showUploadList: false,
      withCredentials: true,
      beforeUpload: this.beforeUpload.bind(this),
      onChange: this.shandleChange.bind(this, "logo"),
      name: "upfile",
      accept: "image/*",
      data: {
        withStatus: true
      },
      headers: {
        "X-Requested-With": null
      },
      onProgress: null
    };

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>基本信息</Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Tabs
            defaultActiveKey="1"
            onChange={this.onChengeTabActiveKey.bind(this)}
          >
            <TabPane tab="基本信息" key="1">
              <Form
                onSubmit={this.handleSubmit}
                hideRequiredMark
                style={{ marginTop: 8 }}
              >
                <FormItem {...formItemLayout} label="店铺名称">
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "请输入名称"
                      }
                    ],
                    initialValue:detail.shopInfoVo.name
                  })(<Input placeholder="给店铺起个名字" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="店铺类型">
                  {getFieldDecorator("goal", {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(<span>{detail.shopInfoVo.type === 0 ? "个人店铺" : "企业店铺"}</span>)}
                </FormItem>
                <FormItem {...formItemLayout} label="店铺让利比">
                  {getFieldDecorator("benefitPercent",{
                    rules: [
                      {
                        required: false,
                        message: "请输入让利比"
                      }
                    ],
                    initialValue: detail.shopInfoExtendVo.benefitPercent * 100
                  })(
                    <InputNumber placeholder="请输入" min={10} max={90} />
                  )}
                  <span>%</span>
                </FormItem>
                <FormItem {...formItemLayout} label="线上店铺简介">
                  {getFieldDecorator("introduction", {
                    rules: [
                      {
                        required: false,
                        message: "请输入简介"
                      }
                    ],
                    initialValue: detail.shopInfoExtendVo.introduction
                  })(
                    <TextArea
                      style={{ minHeight: 32 }}
                      placeholder="最多可输入200个字"
                      rows={4}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="线下店铺简介">
                  {getFieldDecorator("offlineIntroduction", {
                    rules: [
                      {
                        required: false,
                        message: "请输入简介"
                      }
                    ],
                    initialValue: detail.shopInfoExtendVo.offlineIntroduction
                  })(
                    <TextArea
                      style={{ minHeight: 32 }}
                      placeholder="最多可输入200个字"
                      rows={4}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="店铺经营范围">
                  {getFieldDecorator("businessSphere", {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(<span>{
                    detail.shopOperateVos.map((el,index) => {
                      if(detail.shopOperateVos.length === (index+1)){
                        return el.name
                      }else{
                        return el.name + '/'
                      }
                    })
                  }</span>)}
                </FormItem>
                <FormItem {...formItemLayout} label="店铺状态">
                  <div>
                    {getFieldDecorator("status", {
                      rules: [
                        {
                          required: false
                        }
                      ],
                      initialValue: detail.shopInfoVo.status
                    })(
                      <Radio.Group>
                        <Radio value={0}>开启</Radio>
                        <Radio value={1}>关闭</Radio>
                        <Radio value={2}>装修中</Radio>
                      </Radio.Group>
                    )}
                  </div>
                </FormItem>
                <FormItem {...formItemLayout} label="店铺区域">
                  {getFieldDecorator("mergeName", {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(<span>{detail.shopInfoVo.mergeName}</span>)}
                </FormItem>
                <FormItem {...formItemLayout} label="详细地址">
                  {getFieldDecorator("detailAddr", {
                    rules: [
                      {
                        required: true,
                        message: "请输入详细地址"
                      }
                    ],
                    initialValue: detail.shopInfoVo.detailAddr
                  })(
                    <TextArea
                      style={{ minHeight: 32 }}
                      placeholder="请输入详细地址"
                      rows={4}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="经纬度">
                  {getFieldDecorator("lng",{
                    rules: [
                      {
                        required: false
                      }
                    ],
                    initialValue: detail.shopInfoVo.lng
                  })(
                    <Input placeholder="请输入经度" style={{ width: 200 }} />
                  )}
                   - 
                  {getFieldDecorator("lat",{
                    rules: [
                      {
                        required: false
                      }
                    ],
                    initialValue: detail.shopInfoVo.lat
                  })(
                    <Input placeholder="请输入纬度" style={{ width: 200 }} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="联系人姓名">
                  {getFieldDecorator("contactsName",{
                    rules: [
                      {
                        required: false
                      }
                    ],
                    initialValue: detail.shopInfoExtendVo.contactsName
                  })(
                    <Input placeholder="请输入" style={{ width: 200 }} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="联系人电话">
                  {getFieldDecorator("contactsPhone",{
                    rules: [
                      {
                        required: false
                      }
                    ],
                    initialValue: detail.shopInfoExtendVo.contactsPhone
                  })(
                    <Input placeholder="请输入" style={{ width: 200 }} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="联系人邮箱">
                  {getFieldDecorator("contactsEmail",{
                    rules: [
                      {
                        required: false
                      }
                    ],
                    initialValue: detail.shopInfoExtendVo.contactsEmail
                  })(
                    <Input placeholder="请输入" style={{ width: 200 }} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="售前电话">
                  {getFieldDecorator("presalePhone", {
                    rules: [
                      {
                        required: false
                      }
                    ],
                    initialValue: detail.shopInfoVo.presalePhone
                  })(<Input placeholder="请输入" style={{ width: 200 }} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="售后电话">
                  {getFieldDecorator("aftersalePhone", {
                    rules: [
                      {
                        required: false
                      }
                    ],
                    initialValue: detail.shopInfoVo.aftersalePhone
                  })(<Input placeholder="请输入" style={{ width: 200 }} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="店铺申请日期">
                  {getFieldDecorator("gmtCreate", {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(<span>{Utils.formatDate(detail.shopInfoExtendVo.gmtCreate,'yyyy-mm-dd')}</span>)}
                </FormItem>
                <FormItem {...formItemLayout} label="店铺生效日期">
                  {getFieldDecorator("gmtCreate", {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(<span>{Utils.formatDate(detail.shopInfoExtendVo.gmtCreate,'yyyy-mm-dd')}</span>)}
                </FormItem>
                <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    {submitting ? "正在提交..." : "提交"}
                  </Button>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane tab="店铺LOGO" key="2">
              <Form
                onSubmit={this.handleSubmitLogo}
                hideRequiredMark
                style={{ marginTop: 8 }}
              >
                <FormItem {...formItemLayout} label="店铺LOGO">
                  {getFieldDecorator("logo", {
                    rules: [
                      {
                        required: false,
                        message: "请选择图片"
                      }
                    ],
                    getValueFromEvent: this.normFile.bind(this),
                    initialValue: detail.shopInfoVo.logo
                  })(
                    <Upload {...props}>
                      {detail.shopInfoVo.logo ? (
                        <img
                          src={detail.shopInfoVo.logo}
                          alt=""
                          className="avatar "
                        />
                      ) : (
                        <Icon type="plus" className="avatar-uploader-trigger" />
                      )}
                    </Upload>
                  )}
                </FormItem>
                <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                  <Button type="primary" htmlType="submit" loading={submittingLogo}>
                    {submittingLogo ? "正在提交..." : "提交"} 
                  </Button>
                </FormItem>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
const ShopsInfoDetail = Form.create()(Detail);
export default ShopsInfoDetail;
