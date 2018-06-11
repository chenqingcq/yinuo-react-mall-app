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

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          id: 1,
          orderNo: 84736237,
          goodsName:"矿泉水 550ml",
          goodsPrice:"2.00",
          goodsNum:2,
          goodsAmount:"0.00",
          goodsRate:"10%",
          goodsNuomiNum:"30.5689",
          shopName:"喜士多便利店",
          sellerPhone:13489545478,
          buyerPhone:13584578545,
          status:0,
          gmtCreate:1522655191538,
          pay:"诺米兑换"
        },
        {
          id: 2,
          orderNo: 84736237,
          goodsName:"特别好吃的蛋卷",
          goodsPrice:"5.00",
          goodsNum:2,
          goodsAmount:"0.00",
          goodsRate:"10%",
          goodsNuomiNum:"5.3625",
          shopName:"喜士多便利店",
          sellerPhone:13489545478,
          buyerPhone:13584578545,
          status:1,
          gmtCreate:1522655191538,
          pay:"诺米兑换"
        },
      ],
      pagination: {},
      config: {
        currentPage: 1,
        size: 10
      },
      loading: false,
      selectedRowKeys:[]
    };
  }

  componentDidMount() {}

  // 获取列表数据
  getList(params) {
    params = {...this.state.config, ...params}
    this.setState({loading: true})
    // Actions.getMemberOperateList(params).then(response => {
    //   const pagination = {...this.state.pagination};
    //   pagination.current = params.currentPage;
    //   pagination.total = response.data.total;
    //   pagination.showTotal = (total) => {
    //     return `总共 ${total} 条`
    //   }
    //   this.setState({
    //     loading: false,
    //     list: response.data.records,
    //     pagination,
    //   });
    // })
  }

  // 顶部搜索条件 点击查询按钮 -->  调用getList
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // this.setState({
      //   filters: values
      // })
      // this.getList({...values})
    });
  };

  // 表格分页操作
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    // this.getList({
    //   size: this.state.size ? this.state.size : 10,
    //   currentPage: pagination.current,
    //   ...this.state.filters
    // });
  };

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
        dataIndex: "goodsName",
        key: "goodsName"
      },
      {
        title: "单价",
        dataIndex: "goodsPrice",
        key: "goodsPrice",
        render : goodsPrice => {
            return <span className='bule'>{`¥${goodsPrice}`}</span>
        }
      },
      {
        title: "数量",
        dataIndex: "goodsNum",
        key: "goodsNum"
      },
      {
        title: "支付方式",
        dataIndex: "pay",
        key: "pay",
      },
      {
        title: "生成诺米数",
        dataIndex: "goodsNuomiNum",
        key: "goodsNuomiNum",
      },
      {
        title: "买家账号",
        dataIndex: "buyerPhone",
        key: "buyerPhone",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render : status => {
          let statusText, text;
          switch (status) {
            case 0:
              statusText = "success";
              text = "交易成功";
              break;
            case 1:
              statusText = "default";
              text = "待付款";
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
            return <span className='bule'>{`¥${goodsAmount}`}</span>
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: id => {
          let {match} = this.props, url = `${match.url}/view`;
          return (
            <div className="operation">
              <Link to={url}>
                <Button>查看详情</Button>
              </Link>
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
            <span>兑换订单</span>
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
                <FormItem label="订单编号">
                  {getFieldDecorator("orderNo")(<Input placeholder='订单编号'/>)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="订单状态">
                  {getFieldDecorator("orderStatus")(
                    <Select>
                        <Option value=''>全部</Option>
                        <Option value='1'>待付款</Option>
                        <Option value='2'>待发货</Option>
                        <Option value='3'>待收货</Option>
                        <Option value='4'>待评价</Option>
                        <Option value='5'>交易成功</Option>
                        <Option value='6'>订单取消</Option>
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
                        <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
                <Col md={8} sm={24}>
                  <FormItem label="商品名称">
                    {getFieldDecorator("goodsName")(<Input placeholder='商品名称'/>)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <span className="submitButtons operation">
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                        <Button>
                            导出订单
                        </Button>
                    </span>
                </Col>
            </Row>
          </Form>
          <div style={{ marginBottom: 15 }}>
            <Button>批量发货</Button>
          </div>
          <div style={{ marginBottom: 15 }}>
            <Alert message={`已选${this.state.selectedRowKeys.length}个订单`} type="info" showIcon />     
          </div>
          <div className="table">
            <Table
              columns={columns}
              rowKey="id"
              dataSource={this.state.list}
              pagination={this.state.pagination}
              loading={this.state.loading}
              rowSelection={rowSelection}
              onChange={this.handleTableChange.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const OrderConvertList = Form.create()(List);
export default OrderConvertList;
