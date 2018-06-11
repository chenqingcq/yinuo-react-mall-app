import { Link } from "react-router-dom";
import {
  Select,
  Button,
  Input,
  Form,
  Table,
  Breadcrumb,
  Row,
  Col,
  Popconfirm,
  Badge,
  Alert,
  Radio
} from "antd";
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import style from "../style.less";
import OrderStatusBox from "../../../common/component/orderStatus/index.component";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goodslist: [],
      loading: false,
      detail: {
        orderInfoVo: {
          orderAddressOutVo: {},
          orderAddressPutVo: {},
          orderGoodsVo: {},
          orderInfoExtendVo: {},
          orderPaymentVo: {
            currentStatus: ""
          },
          orderStatusLog: {}
        },
        statusText: "",
        orderRefundApplyStatusLog:{}
      },
      handleStatus: "",
      submitting: false,
      shopDeliveryAddressList: []
    };
  }

  componentDidMount() {
    let _this = this,
      { match } = this.props,
      id = match.params.id;
    this.getDetail(id);
    this.getShopDeliveryAddress();
  }

  getDetail = id => {
    Actions.getOrderRefundApplyDetail({
      id: id
    }).then(response => {
      let { goodslist } = this.state;
      goodslist.push(response.data.orderInfoVo.orderGoodsVo);
      switch (response.data.orderRefundApplyStatusLog.currentStatus) {
        case 0:
          response.data.statusText = "待处理";
          break;
        case 1:
          response.data.statusText = "同意";
          break;
        case 2:
          response.data.statusText = "拒绝";
          break;
        case 3:
          response.data.statusText = "客服介入";
          break;
        case 4:
          response.data.statusText = "撤销(关闭)";
          break;
        case 5:
          response.data.statusText = "买家已发货";
          break;
        case 6:
          response.data.statusText = "卖家已收货";
          break;
        case 7:
          response.data.statusText = "退款成功";
          break;
      }
      if (response.code === 0) {
        this.setState({
          detail: response.data,
          goodslist
        });
      }
    });
  };

  // 获取店铺发货地址列表
  getShopDeliveryAddress = () => {
    let _this = this;
    Actions.getShopDeliveryAddress({
      pageNum: 1,
      pageSize: 10000
    }).then(response => {
      if (response.code === 0) {
        _this.setState({
          shopDeliveryAddressList: response.data.rows
        });
      }
    });
  };

  onChangeStatus = e => {
    this.setState({
      handleStatus: e.target.value
    });
  };

  // 表单提交
  handleSubmit = e => {
    e.preventDefault();
    let { match, history } = this.props,
      _this = this,
      id = match.params.id;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        _this.setState({
          submitting:false
        })
        values.id = id;
        Actions.handleOrderRefundApply(values).then(response => {
          if (response.code == 0) {
            Utils.dialog.success("提交成功", () => {
              history.push(`/order/refund-apply/index`);
            });
          } else {
            _this.setState({
              submitting: false
            });
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      detail,
      handleStatus,
      submitting,
      shopDeliveryAddressList
    } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 3 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 3 },
        sm: { span: 10, offset: 3 }
      }
    };

    const columns = [
      {
        title: "商品名称",
        dataIndex: "goodsName",
        key: "goodsName",
        render: (goodsName, response) => {
          return (
            <div className={`${style.goodsItem} flex`}>
              <div className={`${style.url}`}>
                <img src={response.goodsPic} />
              </div>
              <div className={`${style.goodsinfo} flex-item`}>
                <p className={`${style.name}`}>{goodsName}</p>
                <p className={`${style.spec}`}>规格:{response.specs}</p>
              </div>
            </div>
          );
        }
      },
      {
        title: "单价",
        dataIndex: "goodsPrice",
        key: "goodsPrice",
        render: goodsPrice => {
          return (
            <span className="bule">{`¥${Utils.moneyMinuteToYuan(
              goodsPrice
            )}`}</span>
          );
        }
      },
      {
        title: "数量",
        dataIndex: "goodsNum",
        key: "goodsNum"
      }
    ];
    const footer = () => {
      return (
        <div style={{ textAlign: "right" }}>
          订单共{detail.orderInfoVo.orderGoodsVo.goodsNum}件商品，总计：<span
            style={{ color: "#d30000" }}
          >
            ¥{Utils.moneyMinuteToYuan(detail.orderInfoVo.goodsAmount)}
          </span>（含运费 ￥{Utils.moneyMinuteToYuan(
            detail.orderInfoVo.shippingPrice
          )}）
        </div>
      );
    };
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={`/order/refund-apply/index`}>
              <span>退款/退货退款申请列表</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>退款/退货退款申请详情</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className={`${style.status}  flex`}>
          <div className={`${style.icon} flex`}>
            <i className={`${style.anticon} anticon anticon-shuoming`} />
          </div>
          <div className={`${style.info}`}>
            <h3 className={`${style.name}`}>退款状态：{detail.statusText}</h3>
          </div>
        </div>
        <div className="content">
          <div className={`${style.detail}`}>
            <div className={`${style.block}`}>
              <div className={`${style.title}`}>退款/退货退款信息</div>
              <div className={`${style.info}`}>
                <Row gutter={24}>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>订单号</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.orderInfoVo.orderNo}
                    </div>
                  </Col>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>店铺名称</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.orderInfoVo.shopName}
                    </div>
                  </Col>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>申请类型</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.type === 0
                        ? "退款"
                        : detail.type === 1
                          ? "退货退款"
                          : ""}
                    </div>
                  </Col>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>买家手机</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.phone}
                    </div>
                  </Col>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>申请主题</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.subjectContent}
                    </div>
                  </Col>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>申请内容</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.note}
                    </div>
                  </Col>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>退款金额</div>
                    <div
                      className={`${style.termDetail} flex-item`}
                      style={{ color: "#108ee9" }}
                    >
                      ￥{Utils.moneyMinuteToYuan(detail.amount)}
                    </div>
                  </Col>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>拒绝退款理由</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.reason === "" ? "暂无" : detail.reason}
                    </div>
                  </Col>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>时间</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {Utils.formatDate(detail.gmtCreate, "YYYY-MM-DD hh:ii")}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className={`${style.block}`}>
              <Table
                columns={columns}
                rowKey="id"
                dataSource={this.state.goodslist}
                pagination={false}
                loading={this.state.loading}
                footer={footer}
              />
            </div>
          </div>
          {detail.orderRefundApplyStatusLog.currentStatus === 0 && (
            <div className={`${style.auditOpinion} ${style.detail}`}>
              <div className={`${style.form} ${style.block}`}>
                <div className={`${style.title}`}>处理信息</div>
                <Form style={{ marginTop: 20 }} className={`${style.info}`} onSubmit={this.handleSubmit}>
                  <Row gutter={24}>
                    <Col md={24} sm={24}>
                      <FormItem
                        {...formItemLayout}
                        label="处理意见"
                        className={`${style.antFormItem}`}
                      >
                        {getFieldDecorator("status", {
                          rules: [
                            {
                              required: true,
                              message: "请选择"
                            }
                          ]
                        })(
                          <RadioGroup onChange={this.onChangeStatus.bind(this)}>
                            <Radio value={1}>同意</Radio>
                            <Radio value={2}>拒绝</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  {handleStatus === 1 && (
                    <Row gutter={24}>
                      <Col md={24} sm={24}>
                        <FormItem {...formItemLayout} label="收货地址">
                          {getFieldDecorator("addressId", {
                            rules: [
                              {
                                required: true,
                                message: "请选择"
                              }
                            ]
                          })(
                            <Select style={{ width: 200 }}>
                              {shopDeliveryAddressList.map((el, index) => {
                                return (
                                  <Option value={el.id} key={el.id}>
                                    {el.alias !== "" ? el.alias : el.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  )}
                  {handleStatus === 2 && (
                    <Row gutter={24}>
                      <Col md={24} sm={24}>
                        <FormItem
                          className={`${style.antFormItem}`}
                          {...formItemLayout}
                          label="拒绝理由"
                        >
                          {getFieldDecorator("reason", {
                            rules: [
                              {
                                required: true,
                                message: "请填写"
                              }
                            ]
                          })(
                            <Input
                              type="textarea"
                              placeholder="填写拒绝理由"
                              className={`${style.textarea}`}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  )}
                  <Row gutter={24}>
                    <Col md={24} sm={24}>
                      <FormItem {...submitFormLayout}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={submitting}
                        >
                          {submitting ? "正在提交..." : "提交"}
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const RefundApplyDetail = Form.create()(Detail);
export default RefundApplyDetail;
