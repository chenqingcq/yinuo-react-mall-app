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
  Upload,
  Popconfirm,
  Modal
} from "antd";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const { Option } = Select;
const confirm = Modal.confirm;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";

import styles from "../index.less";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {
        shopInfoVo: {},
        shopInfoExtendVo: {},
        shopOperateVos: {},
        shopSeoVos: []
      },
      onlineSubmitting: false,
      offlineSubmitting: false,
      onlineSeoList: [],
      offlineSeoList: [],
      currentOnlineSeoIndex:-1,
      currentOfflineSeoIndex:-1,
      onlineSeo:'',
      offlineSeo:'',
    };
  }

  componentDidMount() {
    this.getList(0);
    this.getList(1);
  }

  // 获取关键词列表
  getList = shopType => {
    let _this = this;
    Actions.getShopSeoList({
      shopType: shopType
    }).then(response => {
      if (response.code === 0) {
        if (shopType === 0) {
          _this.setState({ onlineSeoList: response.data });
        } else if (shopType === 1) {
          _this.setState({ offlineSeoList: response.data });
        }
      }
    });
  };

  // 创建线上店铺关键词
  handleSubmitOnline = e => {
    e.preventDefault();
    let _this = this;
    this.props.form.validateFieldsAndScroll(["online_seo"], (err, values) => {
      if (!err) {
        _this.setState({
          onlineSubmitting: true
        });
        let param = {};
        param.seo = values.online_seo;
        param.shopType = 0; // 0 为线上店铺
        Actions.createShopSeo(param).then(response => {
          if (response.code == 0) {
            Utils.dialog.success("保存成功");
            _this.setState({
              onlineSubmitting: false,
              onlineSeo:''
            });
            this.getList(0)
          } else {
            _this.setState({
              onlineSubmitting: false
            });
          }
        });
      }
    });
  };

  // 创建线下店铺关键词
  handleSubmitOffline = e => {
    e.preventDefault();
    let _this = this;
    this.props.form.validateFieldsAndScroll(["offline_seo"], (err, values) => {
      if (!err) {
        _this.setState({
          offlineSubmitting: true
        });
        let param = {};
        param.seo = values.offline_seo;
        param.shopType = 1; // 1 为线下店铺
        Actions.createShopSeo(param).then(response => {
          if (response.code == 0) {
            Utils.dialog.success("保存成功");
            _this.setState({
              offlineSubmitting: false,
              offlineSeo:''
            });
            this.getList(1)
          } else {
            _this.setState({
              offlineSubmitting: false
            });
          }
        });
      }
    });
  };

  // 删除关键词
  onDelete = (id, index, shopType) => {
    let _this = this;
    confirm({
      title: '您确定要删除该关键词吗?',
      content: '',
      onOk() {
        Actions.deleteShopSeo({
          id: id
        }).then(result => {
          if (result.code == 0) {
            Utils.dialog.success("删除成功");
            if(shopType === 0){
              let onlineSeoList = _this.state.onlineSeoList
              onlineSeoList.splice(index, 1)
              _this.setState({onlineSeoList})
            }
            if(shopType === 1){
              let offlineSeoList = _this.state.offlineSeoList
              offlineSeoList.splice(index, 1)
              _this.setState({offlineSeoList})
            }
          } else {
            Utils.dialog.error(result.errorMsg);
          }
        });
      },
      onCancel() {

      },
    });
  };

  // 鼠标进入线上seo
  handleOnlineMouseEnter = (item, index) => {
    this.setState({
      currentOnlineSeoIndex: index
    });
  };

  // 鼠标离开线上seo
  handleOnlineMouseLeave = (item, index) => {
    this.setState({
      currentOnlineSeoIndex: -1
    });
  };

  // 鼠标进入线下seo
  handleOfflineMouseEnter = (item, index) => {
    this.setState({
      currentOfflineSeoIndex: index
    });
  };

  // 鼠标离开线下seo
  handleOfflineMouseLeave = (item, index) => {
    this.setState({
      currentOfflineSeoIndex: -1
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const { detail, onlineSubmitting, offlineSubmitting, onlineSeoList, offlineSeoList, currentOnlineSeoIndex, currentOfflineSeoIndex, onlineSeo, offlineSeo } = this.state;

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

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>基本信息</Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Tabs defaultActiveKey="1">
            <TabPane tab="线上店铺" key="1">
              <Form
                onSubmit={this.handleSubmitOnline}
                hideRequiredMark
                style={{ marginTop: 8 }}
              >
                <FormItem
                  {...formItemLayout}
                  extra="请输入线上店铺SEO关键词名称,有用搜索引擎检索"
                >
                  {getFieldDecorator("online_seo", {
                    rules: [
                      {
                        required: true,
                        message: "请输入关键词"
                      }
                    ],
                    initialValue:onlineSeo
                  })(<Input placeholder="6字以内" style={{ width: 300 }} />)}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={onlineSubmitting}
                    style={{ marginLeft: 10 }}
                  >
                    {onlineSubmitting ? "正在保存..." : "保存"}
                  </Button>
                </FormItem>
              </Form>
              <div className={`${styles.seoList}`}>
                {
                  onlineSeoList.map((el,index) => {
                    return <span className={`${styles.seoItem}`} key={index} 
                      onMouseEnter={this.handleOnlineMouseEnter.bind(this, el, index)}
                      onMouseLeave={this.handleOnlineMouseLeave.bind(this, el, index)}>
                      <span>{el.seo}</span>
                      {currentOnlineSeoIndex === index && (
                      <div
                        className={`${styles.icon} flex flex-middle flex-center`}
                      >
                        <Icon
                          type="delete"
                          style={{ color: "#fff", margin: "0 5px" }}
                          onClick={this.onDelete.bind(this,el.id,index,0)}
                        />
                      </div>
                      )}
                      {currentOnlineSeoIndex === index && (
                      <div
                        className={`${styles.mask} flex flex-middle flex-center`}
                      />
                      )}
                    </span>
                  })
                }  
              </div>
            </TabPane>
            <TabPane tab="线下店铺" key="2">
              <Form
                onSubmit={this.handleSubmitOffline}
                hideRequiredMark
                style={{ marginTop: 8 }}
              >
                <FormItem
                  {...formItemLayout}
                  extra="请输入线下店铺SEO关键词名称,有用搜索引擎检索"
                >
                  {getFieldDecorator("offline_seo", {
                    rules: [
                      {
                        required: true,
                        message: "请输入关键词"
                      }
                    ],
                    initialValue:offlineSeo
                  })(<Input placeholder="6字以内" style={{ width: 300 }} />)}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={offlineSubmitting}
                    style={{ marginLeft: 10 }}
                  >
                    {offlineSubmitting ? "正在保存..." : "保存"}
                  </Button>
                </FormItem>
              </Form>
              <div className={`${styles.seoList}`}>
                {
                  offlineSeoList.map((el,index) => {
                    return <span className={`${styles.seoItem}`} key={index} 
                      onMouseEnter={this.handleOfflineMouseEnter.bind(this, el, index)}
                      onMouseLeave={this.handleOfflineMouseLeave.bind(this, el, index)}>
                      <span>{el.seo}</span>
                      {currentOfflineSeoIndex === index && (
                      <div
                        className={`${styles.icon} flex flex-middle flex-center`}
                      >
                        <Icon
                          type="delete"
                          style={{ color: "#fff", margin: "0 5px" }}
                          onClick={this.onDelete.bind(this,el.id,index,1)}
                        />
                      </div>
                      )}
                      {currentOfflineSeoIndex === index && (
                      <div
                        className={`${styles.mask} flex flex-middle flex-center`}
                      />
                      )}
                    </span>
                  })
                }  
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
const ShopsSeoDetail = Form.create()(Detail);
export default ShopsSeoDetail;
