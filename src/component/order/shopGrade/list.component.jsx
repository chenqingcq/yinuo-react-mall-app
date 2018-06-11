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

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          id: 1,
          orderNo: 84736237,
          shopName:'超级店铺',
          shopPrice:'888.88',
          shopValidity:1523655191538,
          goodsAmount:'880.00',
          goodsNuomiNum:'30.00',
          buyerPhone:18895456123,
          status:0,
          gmtCreate:1522655191538,
          pay:'诺宝'
        },
        {
          id: 2,
          orderNo: 84736237,
          shopName:'二级店铺',
          shopPrice:'666.66',
          shopValidity:1523655191538,
          goodsAmount:'660.00',
          goodsNuomiNum:'10.00',
          buyerPhone:18895456123,
          status:1,
          gmtCreate:1522655191538,
          pay:'诺宝'
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
        title: "店铺名称",
        dataIndex: "shopName",
        key: "shopName"
      },
      {
        title: "店铺价格",
        dataIndex: "shopPrice",
        key: "shopPrice",
        render : shopPrice => {
            return <span className='bule'>{`¥${shopPrice}`}</span>
        }
      },
      {
        title: "店铺期限",
        dataIndex: "shopValidity",
        key: "shopValidity",
        render : shopValidity => {
            return Utils.formatDate(shopValidity, "YYYY-MM-DD hh:ii");
        }
      },
      {
        title: "实付金额",
        dataIndex: "goodsAmount",
        key: "goodsAmount",
        render : goodsAmount => {
            return <span className='bule'>{`¥${goodsAmount}`}</span>
        }
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
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: id => {
          let {match} = this.props, url = `${match.url}/view`
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
    
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>店铺等级订单</span>
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
                  {getFieldDecorator("orderStatus")(
                    <Select>
                        <Option value=''>全部</Option>
                        <Option value='1'>待付款</Option>
                        <Option value='2'>已取消</Option>
                        <Option value='3'>已完成</Option>
                        <Option value='4'>已关闭</Option>
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
            <Row>
                <Col md={24} sm={24} style={{textAlign:"right"}}>
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

const OrderShopGradeList = Form.create()(List);
export default OrderShopGradeList;
