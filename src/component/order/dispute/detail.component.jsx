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
            <Link to={`/order/dispute/index`}>
              <span>纠纷订单</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>纠纷订单详情</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div style={{ marginBottom: 15 }}>
            <Alert message={`未处理`} type="warning" showIcon />     
          </div>  
          <div className={`${style.detail}`}>
            <div className={`${style.block}`}>
              <div className={`${style.title}`}>订单信息</div>
              <div className={`${style.info}`}>
                <Row gutter={24}>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>订单号</div>
                    <div className={`${style.termDetail} flex-item`}>
                      78945654
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>店铺ID</div>
                    <div className={`${style.termDetail} flex-item`}>89655</div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>会员ID</div>
                    <div className={`${style.termDetail} flex-item`}>87456</div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>会员电话</div>
                    <div className={`${style.termDetail} flex-item`}>
                      13489654458
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className={`${style.block}`}>
              <div className={`${style.title}`}>首次纠纷</div>
              <div className={`${style.info}`}>
                <Row gutter={24}>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>首次提交时间</div>
                    <div className={`${style.termDetail} flex-item`}>
                      2018-02-03 14:25
                    </div>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={`${style.term}`}>纠纷类型</div>
                    <div className={`${style.termDetail} flex-item`}>商品</div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>纠纷内容</div>
                    <div className={`${style.termDetail} flex-item`}>
                      发错货
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                    <Col md={8} sm={24} className="flex">
                        <div
                        className={`${style.term}`}
                        style={{ verticalAlign: "top" }}
                        >
                        纠纷图片
                        </div>
                        <div className={`${style.termDetail} flex-item`}>
                        <span className={`${style.img}`}>
                            <img
                            src={`https://img.adidas.com.cn/resources/2018/1/29/15172185209378692_324X324.jpg`}
                            />
                        </span>
                        <span className={`${style.img}`}>
                            <img
                            src={`https://img.adidas.com.cn/resources/2018/1/29/15172185209378692_324X324.jpg`}
                            />
                        </span>
                        </div>
                    </Col>
                </Row>
              </div>
            </div>
            <div className={`${style.block}`}>
              <div className={`${style.title}`}>追加纠纷</div>
              <div className={`${style.info}`}>
                <Row gutter={24}>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>追加时间</div>
                    <div className={`${style.termDetail} flex-item`}>
                      2018-02-08 14:25
                    </div>
                  </Col>
                  <Col md={8} sm={24} className="flex">
                    <div className={`${style.term}`}>追加内容</div>
                    <div className={`${style.termDetail} flex-item`}>
                      发错货
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                    <Col md={8} sm={24} className="flex">
                        <div
                        className={`${style.term}`}
                        style={{ verticalAlign: "top" }}
                        >
                        追加图片
                        </div>
                        <div className={`${style.termDetail} flex-item`}>
                        <span className={`${style.img}`}>
                            <img
                            src={`https://img.adidas.com.cn/resources/2018/1/29/15172185209378692_324X324.jpg`}
                            />
                        </span>
                        <span className={`${style.img}`}>
                            <img
                            src={`https://img.adidas.com.cn/resources/2018/1/29/15172185209378692_324X324.jpg`}
                            />
                        </span>
                        </div>
                    </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className={`${style.auditOpinion} ${style.detail}`}>
            <div className={`${style.form} ${style.block}`}>
              <div className={`${style.title}`}>审核信息</div>
              <Form style={{ marginTop: 20 }} className={`${style.info}`}>
                <Row gutter={24}>
                  <Col md={24} sm={24}>
                    <FormItem
                      label="平台审核意见"
                      className={`${style.antFormItem}`}
                    >
                      {getFieldDecorator("type")(
                        <RadioGroup>
                          <Radio value={1}>无效</Radio>
                          <Radio value={2}>恶意</Radio>
                          <Radio value={3}>有效</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col md={24} sm={24}>
                    <FormItem className={`${style.antFormItem}`}>
                      {getFieldDecorator("textarea")(
                        <Input
                          type="textarea"
                          placeholder="填写平台审核意见"
                          className={`${style.textarea}`}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col md={6} sm={24}>
                    <div className={`${style.term}`}>平台操作人</div>
                    <div className={`${style.termDetail} flex-item`}>
                      陈先生
                    </div>
                  </Col>
                  <Col md={6} sm={24}>
                    <div className={`${style.term}`}>平台操作人电话</div>
                    <div className={`${style.termDetail} flex-item`}>
                      13430362258
                    </div>
                  </Col>
                  <Col md={6} sm={24}>
                    <div className={`${style.term}`}>操作时间</div>
                    <div className={`${style.termDetail} flex-item`}>
                      2018-02-03 14:00
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col md={24} sm={24}>
                    <Button type="primary">提交</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const OrderDisputeDetail = Form.create()(Detail);
export default OrderDisputeDetail;
