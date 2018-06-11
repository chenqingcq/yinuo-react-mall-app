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
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { getFieldDecorator } = this.props.form;
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
        <OrderStatusBox status={`订单状态:待付款`} statusRemark={`等待买家付款,剩余时间11时59分`} icon={`anticon-shuoming`}/>
        <div className="content">
          <div className={`${style.detail}`}>
            <div className={`${style.block}`}>
                <div className={`${style.title}`}>商品信息</div>
                <div className={`${style.info}`}>
                    <Row gutter={24}>
                        <Col md={8} sm={24} className="flex">
                            <div className={`${style.term}`}>商品名称</div>
                            <div className={`${style.termDetail} flex-item`}>零食 500ml</div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>商品价格</div>
                            <div className={`${style.termDetail} flex-item`}>¥3.00</div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>商品数量</div>
                            <div className={`${style.termDetail} flex-item`}>2</div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>商品规格</div>
                            <div className={`${style.termDetail} flex-item`}>300ml</div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>商品生成诺米数</div>
                            <div className={`${style.termDetail} flex-item`}>12.3652</div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>运费</div>
                            <div className={`${style.termDetail} flex-item`}>
                                ¥0.00
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>交易金额</div>
                            <div className={`${style.termDetail} flex-item`}>
                                ¥6.00
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>商家实收金额</div>
                            <div className={`${style.termDetail} flex-item`}>
                                ¥5.00
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col md={24} sm={24}>
                            <div className={`${style.term}`} style={{ verticalAlign: "top" }}>商品图片</div>
                            <div className={`${style.termDetail} flex-item`}>
                                <span className={`${style.img}`}>
                                    <img src={`http://img2.imgtn.bdimg.com/it/u=303301514,1779585330&fm=27&gp=0.jpg`} />
                                </span>
                                <span className={`${style.img}`}>
                                    <img src={`http://img2.imgtn.bdimg.com/it/u=303301514,1779585330&fm=27&gp=0.jpg`} />
                                </span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className={`${style.block}`}>
                <div className={`${style.title}`}>订单信息</div>
                <div className={`${style.info}`}>
                    <Row gutter={24}>
                        <Col md={8} sm={24} className="flex">
                            <div className={`${style.term}`}>订单号</div>
                            <div className={`${style.termDetail} flex-item`}>
                                78945132456
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>订单状态</div>
                            <div className={`${style.termDetail} flex-item`}>
                                {/* <Badge status='success' text='交易成功' /> */}
                                交易成功
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>物流运费</div>
                            <div className={`${style.termDetail} flex-item`}>
                              ￥{Utils.moneyMinuteToYuan(detail.shippingPrice)}
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>支付方式</div>
                            <div className={`${style.termDetail} flex-item`}>
                                诺宝支付
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>买家ID</div>
                            <div className={`${style.termDetail} flex-item`}>
                                456789456
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>买家账号</div>
                            <div className={`${style.termDetail} flex-item`}>
                                139854854565
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>收货信息</div>
                            <div className={`${style.termDetail} flex-item`}>
                                广东省广州市海珠区琶洲中心，陈先生，<a href="javascript:;">13784561236</a>
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>买家备注</div>
                            <div className={`${style.termDetail} flex-item`}>
                                暂无
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>下单时间</div>
                            <div className={`${style.termDetail} flex-item`}>
                                2018-02-26 10:58
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

const OrderConvertDetail = Form.create()(Detail);
export default OrderConvertDetail;
