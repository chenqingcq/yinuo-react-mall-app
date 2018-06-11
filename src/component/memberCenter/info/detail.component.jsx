import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Radio,
  Breadcrumb,
  Icon,
  Upload,
  Checkbox,
  Button,
  Select,
  Modal,
  Tabs,
  DatePicker
} from "antd";
import moment from 'moment';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
import style from "./style.less";

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {
        memberInfoVo: {},
        memberRealnameAuthVo: {
          status:0
        },
        memberGradeVo: {},
        refereeMemberInfoVo:null
      },
      isLoading: false,
      submittHeadPortraitLoading: false
    };
  }

  componentDidMount() {
    this.getMemberInfo();
  }

  // 获取会员个人信息
  getMemberInfo = () => {
    Actions.getMemberInfo().then(response => {
      if (response.code === 0) {
        let detail = response.data;
        if(detail.memberRealnameAuthVo === null){
          detail.memberRealnameAuthVo = {}
        }
        this.setState({
          detail: detail
        });
      }
    });
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
      detail.memberInfoVo[prop] = file.response.data;
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

  // 更新会员个人信息
  handleSubmit = e => {
    e.preventDefault();
    let { match, history } = this.props,
      _this = this,
      id = match.params.id;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        _this.setState({
          isLoading: true
        });
        values.birthday = values.birthday.valueOf();
        Actions.updateMemberInfo(values).then(response => {
          _this.setState({
            isLoading: false
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

  // 更新会员头像
  handleSubmitHeadPortrait = e => {
    e.preventDefault();
    let _this = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        _this.setState({
          submittHeadPortraitLoading: true
        });
        // values.birthday = values.birthday.valueOf();
        delete values.birthday;
        Actions.updateMemberInfo(values).then(response => {
          _this.setState({
            submittHeadPortraitLoading: false
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 14,
          offset: 6
        }
      }
    };
    const props = {
      className: "avatar-uploader",
      action: Actions.uploadFile,
      showUploadList: false,
      withCredentials: true,
      beforeUpload: this.beforeUpload.bind(this),
      onChange: this.shandleChange.bind(this, "headPortrait"),
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
          <Breadcrumb.Item>
            <Link to={`/members/info/index`}>
              <span>会员列表</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>会员详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="登录账号" hasFeedback>
                  <span>{detail.memberInfoVo.phone}</span>
                </FormItem>
                <FormItem {...formItemLayout} label="昵称" hasFeedback>
                  {getFieldDecorator("nickname", {
                    rules: [
                      {
                        required: true,
                        message: "请填写昵称"
                      }
                    ],
                    initialValue: detail.memberInfoVo.nickname
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="性别" hasFeedback>
                  {getFieldDecorator("gender", {
                    rules: [
                      {
                        required: true,
                        message: "请选择性别!",
                        type: "number"
                      }
                    ],
                    initialValue: detail.memberInfoVo.gender
                  })(
                    <RadioGroup>
                      <Radio value={0}>男</Radio>
                      <Radio value={1}>女</Radio>
                      <Radio value={2}>未知</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="生日" hasFeedback>
                  {getFieldDecorator("birthday", {
                    rules: [
                      {
                        required: false,
                        message: "请选择生日"
                      }
                    ],
                    initialValue: !detail.memberInfoVo.birthday
                      ? null
                      : moment(
                          Utils.formatDate(
                            detail.memberInfoVo.birthday,
                            "YYYY-MM-DD"
                          ),
                          "YYYY-MM-DD"
                        )
                  })(<DatePicker format="YYYY-MM-DD" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="推荐人账号" hasFeedback>
                  <span>{detail.refereeMemberInfoVo === null ? '无' : detail.refereeMemberInfoVo.phone}</span>
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    disabled={this.state.isLoading}
                    loading={this.state.isLoading}
                  >
                    {this.state.isLoading ? "正在保存..." : "保存"}
                  </Button>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane tab="头像照片" key="2">
              <Form
                onSubmit={this.handleSubmitHeadPortrait}
                hideRequiredMark
                style={{ marginTop: 8 }}
              >
                <FormItem {...formItemLayout} label="头像照片" hasFeedback>
                  {getFieldDecorator("headPortrait", {
                    rules: [
                      {
                        // required: true, message: '请上传一张横排封面图',
                      }
                    ],
                    getValueFromEvent: this.normFile.bind(this),
                    initialValue: detail.memberInfoVo.headPortrait
                  })(
                    <Upload {...props}>
                      {detail.memberInfoVo.headPortrait ? (
                        <img
                          src={detail.memberInfoVo.headPortrait}
                          alt=""
                          className="avatar "
                        />
                      ) : (
                        <Icon type="plus" className="avatar-uploader-trigger" />
                      )}
                    </Upload>
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout} style={{ marginTop: 32 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={this.state.submittHeadPortraitLoading}
                  >
                    {this.state.submittHeadPortraitLoading
                      ? "正在保存..."
                      : "保存"}
                  </Button>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane tab="安全中心" key="3">
              <div className={`flex ${style.safety}`}>
                {detail.memberRealnameAuthVo.status === 0 ? (
                  <div className={`${style.icon} anticon anticon-gouxuan`} />
                ) : (
                  <div
                    className={`${style.iconJinggao} anticon anticon-jinggao`}
                  />
                )}
                <div className={`${style.shimingrenzheng}`}>
                  实名认证{" "}
                  {detail.memberRealnameAuthVo.status === 0 ? (
                    <span
                      className="anticon anticon-icon_vip_fill"
                      style={{ color: "#FF9926" }}
                    />
                  ) : (
                    <span
                      className="anticon anticon-icon_vip_fill"
                      style={{ color: "#CECECE" }}
                    />
                  )}
                </div>
                <div className="tip">
                  {detail.memberRealnameAuthVo.status === 0 ? (
                    `您认证的实名信息：${detail.memberRealnameAuthVo.realName}，${detail.memberRealnameAuthVo.idNo}`
                  ) : (
                    `您还未进行实名认证，请移至移动端进行实名认证`
                  )}
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
const MemberInfoDetailForm = Form.create()(Detail);
export default MemberInfoDetailForm;
