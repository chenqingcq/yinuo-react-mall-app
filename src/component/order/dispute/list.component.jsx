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
        // {
        //   id: 1,
        //   orderNo: 9854756,
        //   shopId:7898,
        //   memberId:98654,
        //   memberPhone:13589655589,
        //   firstSubmitTime:1502655191538,
        //   type:0,
        //   content:"发错货",
        //   addTime:1512655191538,
        //   addContent:"退款金额不正确",
        //   status:0,
        //   handleType:1,
        //   gmtCreate:1522655191538,
        // },
        // {
        //     id: 2,
        //     orderNo: 9854756,
        //     shopId:7898,
        //     memberId:98654,
        //     memberPhone:13589655589,
        //     firstSubmitTime:1502655191538,
        //     type:0,
        //     content:"发错货",
        //     addTime:1512655191538,
        //     addContent:"退款金额不正确",
        //     status:1,
        //     handleType:1,
        //     gmtCreate:1522655191538,
        // },
        // {
        //     id: 3,
        //     orderNo: 9854756,
        //     shopId:7898,
        //     memberId:98654,
        //     memberPhone:13589655589,
        //     firstSubmitTime:1502655191538,
        //     type:0,
        //     content:"发错货",
        //     addTime:1512655191538,
        //     addContent:"退款金额不正确",
        //     status:2,
        //     handleType:1,
        //     gmtCreate:1522655191538,
        // },
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
        title: "商家ID",
        dataIndex: "shopId",
        key: "shopId"
      },
      {
        title: "会员ID",
        dataIndex: "memberId",
        key: "memberId"
      },
      {
        title: "会员电话",
        dataIndex: "memberPhone",
        key: "memberPhone"
      },
      {
        title: "首次提交时间",
        dataIndex: "firstSubmitTime",
        key: "firstSubmitTime",
        render : firstSubmitTime => {
            return Utils.formatDate(firstSubmitTime, "YYYY-MM-DD hh:ii");
          }
      },
      {
        title: "纠纷类型",
        dataIndex: "type",
        key: "type",
        render : type => {
          return <span>商品</span>
        }
      },
      {
        title: "纠纷内容",
        dataIndex: "content",
        key: "content"
      },
      {
        title: "追加纠纷内容",
        dataIndex: "addContent",
        key: "addContent"
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
              text = "已处理";
              break;
            case 1:
              statusText = "default";
              text = "未处理";
              break;
            case 2:
              statusText = "warning";
              text = "自动撤销";
              break;
          }
          return <Badge status={statusText} text={text} />;
        }
      },
      {
        title: "处理结果",
        dataIndex: "handleType",
        key: "handleType",
        render : handleType => {
            let text;
            switch (handleType) {
              case 1:
                text = "无效举报";
                break;
              case 2:
                text = "恶意举报";
                break;
              case 3:
                text = "有效举报";
                break;
            }
            return <span>{text}</span>;
          }
      },
      {
        title: "创建时间",
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
            <span>线下订单</span>
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
                <FormItem label="纠纷状态">
                  {getFieldDecorator("orderStatus")(
                    <Select>
                        <Option value=''>全部</Option>
                        <Option value='1'>待处理</Option>
                        <Option value='2'>主动撤回</Option>
                        <Option value='3'>已处理</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="纠纷类型">
                  {getFieldDecorator("type")(
                    <Select>
                        <Option value=''>全部</Option>
                        <Option value='1'>卖家发错货</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
                <Col md={24} sm={24} style={{textAlign:"right"}}>
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

const OrderDisputeList = Form.create()(List);
export default OrderDisputeList;
