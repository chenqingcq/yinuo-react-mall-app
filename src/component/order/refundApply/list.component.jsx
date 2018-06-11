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
  DatePicker,
  Badge
} from "antd";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import AppService from "../../../common/utils/app.service";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {},
      config: {
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      orderTimeStart: "",
      orderTimeEnd: "",
      status: ""
    };
  }

  componentDidMount() {
    this.getList();
  }

  // 获取列表数据
  getList(params) {
    params = { ...this.state.config, ...params };
    this.setState({ loading: true });
    Actions.getOrderRefundApplyList(params).then(response => {
      const pagination = { ...this.state.pagination };
      pagination.current = params.pageNum;
      pagination.total = response.data.totalCount;
      pagination.showTotal = total => {
        return `总共 ${total} 条`;
      };
      this.setState({
        loading: false,
        list: response.data.rows,
        pagination
      });
    });
  }

  // 顶部搜索条件 点击查询按钮 -->  调用getList
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.date !== undefined) {
        values.orderTimeStart = values.date[0].valueOf();
        values.orderTimeEnd = values.date[1].valueOf();
        delete values.date;
      }
      this.setState({
        filters: values
      });
      this.getList({ ...values });
    });
  };

  // 表格分页操作
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.getList({
      pageSize: 10,
      pageNum: pagination.current,
      ...this.state.filters
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: "订单号",
        dataIndex: "orderInfoVo.orderNo",
        key: "orderInfoVo.orderNo"
      },
      {
        title: "申请类型",
        dataIndex: "type",
        key: "type",
        render: type => {
          return <span>{type === 0 ? "退款" : "退货退款"}</span>;
        }
      },
      {
        title: "买家手机",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "申请主题",
        dataIndex: "subjectContent",
        key: "subjectContent"
      },
      {
        title: "状态",
        dataIndex: "orderRefundApplyStatusLog.currentStatus",
        key: "orderRefundApplyStatusLog.currentStatus",
        render: (status,response) => {
          let statusText, text;
          switch (response.orderRefundApplyStatusLog.currentStatus) {
            case 0:
              statusText = "default";
              text = "待处理";
              break;
            case 1:
              statusText = "default";
              text = "同意";
              break;
            case 2:
              statusText = "default";
              text = "拒绝";
              break;
            case 3:
              statusText = "warning";
              text = "客服介入";
              break;
            case 4:
              statusText = "success";
              text = "撤销(关闭)";
              break;
            case 5:
              statusText = "warning";
              text = "买家已发货";
              break;
            case 6:
              statusText = "warning";
              text = "卖家已收货";
              break;
            case 7:
              statusText = "success";
              text = "退款成功";
              break;
          }
          return <Badge status={statusText} text={text} />;
        }
      },
      {
        title: "时间",
        dataIndex: "gmtCreate",
        key: "gmtCreate",
        render: gmtCreate => {
          return Utils.formatDate(gmtCreate, "YYYY-MM-DD hh:ii");
        }
      },
      {
        title: "退款金额",
        dataIndex: "amount",
        key: "amount",
        render: amount => {
          return (
            <span className="bule">{`¥${Utils.moneyMinuteToYuan(
              amount
            )}`}</span>
          );
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: id => {
          return (
            <div className="operation">
              <Link to={`/order/refund-apply/index/view/${id}`}>
                <Button>查看详情</Button>
              </Link>
            </div>
          );
        }
      }
    ];

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>退款/退货退款申请列表</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content tableList">
          <Form
            className="ant-advanced-search-form tableListForm"
            layout="inline"
            onSubmit={this.handleSearch}
          >
            <Row gutter={24}>
              <Col md={8} sm={24}>
                <FormItem label="订单号">
                  {getFieldDecorator("orderNo")(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="申请类型">
                  {getFieldDecorator("type")(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value={0}>退款</Option>
                      <Option value={1}>退货退款</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="状态">
                  {getFieldDecorator("status")(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value={0}>待处理</Option>
                      <Option value={1}>同意</Option>
                      <Option value={2}>拒绝</Option>
                      <Option value={3}>客服介入</Option>
                      <Option value={4}>撤销(关闭)</Option>
                      <Option value={5}>买家已发货</Option>
                      <Option value={6}>卖家已收货</Option>
                      <Option value={7}>退款成功</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24} sm={24} style={{textAlign:'right'}}>
                <span className="submitButtons operation">
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </span>
              </Col>    
            </Row>
          </Form>
          <div className="table">
            <Table
              columns={columns}
              rowKey="id"
              dataSource={this.state.list}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const RefundApplyList = Form.create()(List);
export default RefundApplyList;
