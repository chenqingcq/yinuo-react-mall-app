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
      goodslist: [
        
      ],
      loading: false,
      detail:{
        orderAddressOutVo:{},
        orderAddressPutVo:{},
        orderGoodsVo:{},
        orderInfoExtendVo:{},
        orderPaymentVo:{
          currentStatus:''
        },
        orderStatusLog:{}
      }
    };
  }

  componentDidMount(){
    let _this = this, {match} = this.props, id = match.params.id
    this.getDetail(id);
  }

  getDetail = (id) => {
    Actions.getOrderDetail({
      id:id
    }).then(response => {
      let { goodslist } = this.state;
      goodslist.push(response.data.orderGoodsVo)
      if(response.code === 0){
        this.setState({
          detail:response.data,
          goodslist
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;
    const columns = [
      {
        title: "商品名称",
        dataIndex: "goodsName",
        key: "goodsName",
        render: (goodsName,response) => {
          return (
            <div className={`${style.goodsItem} flex`}>
              <div className={`${style.url}`}>
                <img
                  src={response.goodsPic}
                />
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
          return <span className="bule">{`¥${Utils.moneyMinuteToYuan(goodsPrice)}`}</span>;
        }
      },
      {
        title: "数量",
        dataIndex: "goodsNum",
        key: "goodsNum"
      },
      // {
      //   title: "让利比",
      //   dataIndex: "goodsRate",
      //   key: "goodsRate"
      // },
      // {
      //   title: "生成诺米数",
      //   dataIndex: "nuomi",
      //   key: "nuomi"
      // },
      // {
      //   title: "成交额",
      //   dataIndex: "goodsPayPrice",
      //   key: "goodsPayPrice",
      //   render: (goodsPayPrice,response) => {
      //     return <span className="bule">{`¥${goodsPayPrice}`}</span>;
      //   }
      // },
      // {
      //   title: "实收交额",
      //   dataIndex: "goodsAmount",
      //   key: "goodsAmount",
      //   render: goodsAmount => {
      //     return <span className="bule">{`¥${goodsAmount}`}</span>;
      //   }
      // }
    ];
    const footer = () => {
      return (
        <div style={{ textAlign: "right" }}>
          订单共{detail.orderGoodsVo.goodsNum}件商品，总计：<span style={{ color: "#d30000" }}>¥{Utils.moneyMinuteToYuan(detail.goodsAmount)}</span>
        </div>
      );
    };
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={`/order/online/index`}>
              <span>线上订单</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>线上订单详情</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <OrderStatusBox
          status={detail.orderStatusLog.currentStatus}
          // statusRemark={`买家已付款至结算账户，请尽快发货，否则买家有权申请退款。`}
          // icon={`anticon-shuoming`}
        />
        <div className="content">
          <div className={`${style.detail}`}>
            <div className={`${style.block}`}>
              <div className={`${style.title}`}>订单信息</div>
              <div className={`${style.info}`}>
                <Row gutter={24}>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>订单号</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.orderNo}
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>支付方式</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.orderPaymentVo === null ? '无' : detail.orderPaymentVo.payChannelName}
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>店铺名称</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.shopName}
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>买家ID</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.buyerId}
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>买家账号</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.buyerPhone}
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>买家获得诺米数</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.buyerNuomi}
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>卖家获得诺米数</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {detail.sellerNuomi}
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>买家留言</div>
                    <div className={`${style.termDetail} flex-item`}>
                      暂无
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>下单时间</div>
                    <div className={`${style.termDetail} flex-item`}>
                      {Utils.formatDate(detail.gmtCreate,'yyyy-mm-dd hh:ii:ss')}
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
        </div>
      </div>
    );
  }
}

const OrderVirtualDetail = Form.create()(Detail);
export default OrderVirtualDetail;
