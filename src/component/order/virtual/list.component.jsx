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
  Badge,
  Alert
} from "antd";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import AppService from '../../../common/utils/app.service'
import queryString from 'query-string';
import moment from "moment";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {},
      config: {
        orderType:5,
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      orderTimeStart:'',
      orderTimeEnd:'',
      status:'',
      selectedRowKeys:[]
    };
  }

  componentDidMount() {
    this.getList()
  }

  // 获取列表数据
  getList(params) {
    params = {...this.state.config, ...params}
    this.setState({loading: true})
    Actions.getOrderList(params).then(response => {
      const pagination = {...this.state.pagination};
      pagination.current = params.pageNum;
      pagination.total = response.data.totalCount;
      pagination.showTotal = (total) => {
        return `总共 ${total} 条`
      }
      this.setState({
        loading: false,
        list: response.data.rows,
        pagination,
      });
    })
  }

  // 顶部搜索条件 点击查询按钮 -->  调用getList
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.date !== undefined){
        values.orderTimeStart = values.date[0].valueOf();
        values.orderTimeEnd = values.date[1].valueOf();
        delete values.date
      }
      this.setState({
        filters: values
      })
      this.getList({...values})
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

  onDatePicker = (date) => {
    this.setState({
      orderTimeStart:date[0].valueOf(),
      orderTimeEnd:date[1].valueOf(),
    })
  }

  onSelectStatus = (valus) => {
    this.setState({
      status:valus
    })
  }

  onExportOrder = () => {
    let params = {
      orderType:5
    };
    let { orderTimeStart, orderTimeEnd, status} = this.state;
    if(orderTimeStart !== '' || orderTimeEnd !== ''){
      params.orderTimeStart = orderTimeStart
      params.orderTimeEnd = orderTimeEnd
    }
    if(status !== ''){
      params.status = status
    }
    window.open(`${AppService.apiHost}order/orderInfo/export?` + queryString.stringify(params))
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: "订单号",
        dataIndex: "orderNo",
        key: "orderNo"
      },
      {
        title: "商品名称",
        dataIndex: "orderGoodsVo.goodsName",
        key: "orderGoodsVo.goodsName"
      },
      {
        title: "单价",
        dataIndex: "orderGoodsVo.goodsPrice",
        key: "orderGoodsVo.goodsPrice",
        render : (orderGoodsVo,res) => {
            return <span className='bule'>{`¥${Utils.moneyMinuteToYuan(res.orderGoodsVo.goodsPrice)}`}</span>
        }
      },
      {
        title: "数量",
        dataIndex: "orderGoodsVo.goodsNum",
        key: "orderGoodsVo.goodsNum"
      },
      // {
      //   title: "让利比",
      //   dataIndex: "goodsRate",
      //   key: "goodsRate"
      // },
      // {
      //   title: "买家诺米数",
      //   dataIndex: "buyerNuomi",
      //   key: "buyerNuomi",
      // },
      {
        title: "买家账号",
        dataIndex: "buyerPhone",
        key: "buyerPhone",
        render : (id, res, index) => {
          return <div>
            {/* <div>{res.buyerName}</div> */}
            <div>{res.buyerPhone}</div>
          </div>
        }
      },
      {
        title: "状态",
        dataIndex: "orderStatusLog.currentStatus",
        key: "orderStatusLog.currentStatus",
        render : (orderStatusLog,response) => {
          let statusText, text, status = response.orderStatusLog.currentStatus;
          switch (status) {
            case 0:
              statusText = "default";
              text = "待支付";
              break;
            case 1:
              statusText = "default";
              text = "已取消";
              break;
            case 2:
              statusText = "default";
              text = "过期未支付";
              break;
            case 3:
              statusText = "success";
              text = "已付款";
              break;
            case 4:
              statusText = "success";
              text = "已发货";
              break;
            case 5:
              statusText = "success";
              text = "已收货";
              break;
            case 6:
              statusText = "warning";
              text = "待退款";
              break;
            case 7:
              statusText = "success";
              text = "已退款";
              break;   
          }
          return <Badge status={statusText} text={text} />;
        }
      },
      {
        title: "下单时间",
        dataIndex: "gmtCreate",
        key: "gmtCreate",
        render : gmtCreate => {
          return Utils.formatDate(gmtCreate, "YYYY-MM-DD hh:ii");
        }
      },
      {
        title: "实际成交额",
        dataIndex: "goodsAmount",
        key: "goodsAmount",
        render : goodsAmount => {
            return <span className='bule'>{`¥${Utils.moneyMinuteToYuan(goodsAmount)}`}</span>
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: id => {
          return (
            <div className="operation">
              <Link to={`/order/online/index/view/${id}`}><Button>查看详情</Button></Link>
            </div>
          );
        }
      }
    ];

    // 全选 或 全不选
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys:selectedRowKeys
        });
      },
    };
    
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>线上订单</span>
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
                  {getFieldDecorator("orderNo")(<Input placeholder='订单号'/>)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="订单状态">
                  {getFieldDecorator("status")(
                    <Select onSelect={this.onSelectStatus.bind(this)}>
                        <Option value=''>全部</Option>
                        <Option value={0}>待支付</Option>
                        <Option value={1}>已取消</Option>
                        <Option value={2}>过期未支付</Option>
                        <Option value={3}>已付款</Option>
                        <Option value={4}>已发货</Option>
                        <Option value={5}>已收货</Option>
                        <Option value={6}>待退款</Option>
                        <Option value={7}>已退款</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="下单时间">
                    {getFieldDecorator('date', {
                        rules: [{
                        required: false, message: '请选择起止日期',
                        }],
                    })(
                        <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} onChange={this.onDatePicker.bind(this)}/>
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row>
                <Col md={24} sm={24} style={{textAlign:"right"}}>
                    <span className="submitButtons operation">
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                        <Button onClick={this.onExportOrder.bind(this)}>
                            导出订单
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

const OrderVirtualList = Form.create()(List);
export default OrderVirtualList;
