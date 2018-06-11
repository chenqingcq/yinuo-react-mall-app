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
        <div className="content">
          <div className={`${style.detail}`}>
            <div className={`${style.block}`}>
                <div className={`${style.title}`}>商品信息</div>
                <div className={`${style.info}`}>
                    <Row gutter={24}>
                        <Col md={8} sm={24} className="flex">
                            <div className={`${style.term}`}>店铺等级名称</div>
                            <div className={`${style.termDetail} flex-item`}>一级店铺</div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>店铺等级价格</div>
                            <div className={`${style.termDetail} flex-item`}>¥8888.00</div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>店铺等级期限</div>
                            <div className={`${style.termDetail} flex-item`}>2018-12-23 10:00</div>
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
                            <div className={`${style.term}`}>交易金额</div>
                            <div className={`${style.termDetail} flex-item`}>
                                ¥888.00
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>支付方式</div>
                            <div className={`${style.termDetail} flex-item`}>
                                诺宝支付
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className={`${style.term}`}>店铺名称</div>
                            <div className={`${style.termDetail} flex-item`}>
                                美食超级旗舰店
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
                                13784561236
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

const OrderShopGradeDetail = Form.create()(Detail);
export default OrderShopGradeDetail;
