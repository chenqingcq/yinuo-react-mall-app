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

import OrderStatusBox from "../../../common/component/orderStatus/index.component"

class Detail extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
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
        if(response.code === 0){
          this.setState({
            detail:response.data,
          })
        }
      })
    }
  
    render() {
      const { getFieldDecorator } = this.props.form;
      const { detail } = this.state;
      return (
        <div id="wrap">
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item>
              <Link to={`/order/offline/index`}>
                <span>线下订单</span>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span>线下订单详情</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <OrderStatusBox 
            status={detail.orderStatusLog.currentStatus} 
            statusRemark={`货款结算至你的余额账户，请注意查收。`} 
            icon={`anticon-chenggong`}
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
                              <div className={`${style.term}`}>交易金额</div>
                              <div className={`${style.termDetail} flex-item`}>
                                  ¥{Utils.moneyMinuteToYuan(detail.payAmount)}
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
                              <div className={`${style.term}`}>下单时间</div>
                              <div className={`${style.termDetail} flex-item`}>
                                  {Utils.formatDate(detail.gmtCreate,'yyyy-mm-dd hh:ii:ss')}
                              </div>
                          </Col>
                      </Row>
                  </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  const OrderOfflineDetail = Form.create()(Detail);
  export default OrderOfflineDetail;
