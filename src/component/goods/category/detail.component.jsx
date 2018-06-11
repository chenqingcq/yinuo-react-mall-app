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

import styles from "../style.less";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_not_add: false,
      detail: {},
      goodsClass: [],
      submitting: false
    };
  }

  componentDidMount() {
    let _this = this,
      { match } = this.props,
      id = match.params.id,
      parentId = match.params.parentId;
    _this.getGoodsClass();
    if (id !== undefined) {
      this.setState({
        is_not_add: true
      });
      _this.getDateil(id);
    }
    if (parentId !== undefined) {
      let { detail } = this.state;
      detail.parentId = Number(parentId);
      this.setState({
        is_not_add: true,
        detail
      });
    }
  }

  getDateil = id => {
    let _this = this;
    Actions.getShopGoodsClassDetail({
      id: id
    }).then(response => {
      if (response.code === 0) {
        _this.setState({
          detail: response.data
        });
      }
    });
  };

  getGoodsClass() {
    this.setState({ loading: true });
    Actions.getShopGoodsClass().then(response => {
      if (response.code === 0) {
        let goodsClass = response.data
          .filter((item, index) => {
            return item.parentId == 0;
          })
          .map(record => {
            return record;
          });
        console.log(goodsClass);
        this.setState({
          goodsClass
        });
      }
    });
  }

  // 表单提交
  handleSubmit = e => {
    e.preventDefault();
    let { match, history } = this.props,
      _this = this,
      id = match.params.id,
      parentId = match.params.parentId;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (id !== undefined) {
          values.id = id;
        }
        _this.setState({
          submitting: true
        });
        if (id == undefined) {
          Actions.createShopGoodsClass(values).then(response => {
            if (response.code == 0) {
              Utils.dialog.success("保存成功", () => {
                history.push(`/goods/class/index`);
              });
            } else {
              _this.setState({
                submitting: false
              });
            }
          });
        } else if (id !== undefined) {
          Actions.updateShopGoodsClass(values).then(response => {
            if (response.code == 0) {
              Utils.dialog.success("编辑成功", () => {
                history.push(`/goods/class/index`);
              });
            } else {
              _this.setState({
                submitting: false
              });
            }
          });
        }
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
      detail[prop] = file.response.data;
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

    const { detail, submitting, goodsClass } = this.state;

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
      onChange: this.shandleChange.bind(this, "icon"),
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
            <Link to={`/goods/class/index`}>
              <span>商品分类</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {this.state.is_not_add ? "商品分类详情" : "新增商品分类"}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="商品分类名称">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "请输入名称"
                  }
                ],
                initialValue: detail.name
              })(<Input placeholder="最多可输入20个字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="上级分类">
              {getFieldDecorator("parentId", {
                rules: [
                  {
                    required: true,
                    message: "请选择上级分类"
                  }
                ],
                initialValue: detail.parentId
              })(
                <Select disabled={this.state.is_not_add}>
                  <Option value={0} key='id'>
                    顶级
                  </Option>
                  {goodsClass.map((el, index) => {
                    return (
                      <Option value={el.id} key={el.id}>
                        {el.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="分类图标">
              {getFieldDecorator("icon", {
                rules: [
                  {
                    required: true,
                    message: "请上传商品分类图标"
                  }
                ],
                getValueFromEvent: this.normFile.bind(this),
                initialValue: detail.icon
              })(
                <Upload {...props}>
                  {detail.icon ? (
                    <img src={detail.icon} alt="" className="avatar " />
                  ) : (
                    <Icon type="plus" className="avatar-uploader-trigger" />
                  )}
                </Upload>
              )}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="排序">
              {getFieldDecorator("sort", {
                rules: [
                  {
                    required: false,
                    message: "请输入"
                  }
                ],
                initialValue: detail.sort ? detail.sort : 0
              })(<InputNumber />)}
            </FormItem> */}
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {submitting ? "正在提交..." : "提交"}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
const ShopsGoodsClassDetail = Form.create()(Detail);
export default ShopsGoodsClassDetail;
