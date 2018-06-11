import {Button, Input, Form, Table, Breadcrumb, Row, Col} from 'antd';
const FormItem = Form.Item;

import * as Actions from '../actions'
import Utils from '../../../common/utils/utils'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          member_id: 1,
          order_id:13430392248,
          desc_credit:123465
        },

      ],
      pagination: {},
      config: {
        currentPage: 1,
        size: 10
      },
      loading: false,
    }
  }

  componentDidMount() {
    // this.getMemberLoginLogList()
  }

  // 获取评分日志的列表
  getShopEvaluateLogList(params) {
    params = {...this.state.config, ...params}
    this.setState({loading: true})
    Actions.getShopEvaluateLogList(params).then(response => {
      const pagination = {...this.state.pagination};
      pagination.current = params.currentPage;
      pagination.total = response.data.total;
      pagination.showTotal = (total) => {
        return `总共 ${total} 条`
      };
      this.setState({
        loading: false,
        list: response.data.records,
        pagination,
      });
    })
  }

  // 表格分页的操作
  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    // this.getMemberInfoList({
    //   size: this.state.size ? this.state.size : 10,
    //   currentPage: pagination.current,
    //   ...this.state.filters
    // });
  };

  // 搜索条件 点击搜索按钮
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        filters: values
      });
      this.getShopEvaluateLogList({...values})
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
    };
    const colLayout = {
      xs: {span: 24},
      sm: {span: 8},
    };
    const columns = [
      {
        title: "会员帐号",
        dataIndex: "member_id",
        key: "member_id",
      },
      {
        title: "订单号",
        dataIndex: "order_id",
        key: "order_id",
      },{
        title: "描述相符分值",
        dataIndex: "desc_credit",
        key: "desc_credit",
      },{
        title: "服务态度分值",
        dataIndex: "service_credit",
        key: "service_credit",
      },{
        title: "发货速度分值",
        dataIndex: "delivery_credit",
        key: "delivery_credit",
      },{
        title: "时间",
        dataIndex: "gmt_create",
        key: "gmt_create",
      },

    ];
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>店铺评分</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
          >
            <Row gutter={40}>
              <Col {...colLayout} key='1'>
                <FormItem {...formItemLayout} label='会员账号'>
                  {getFieldDecorator('loginName')(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout} className='searchBtn'>
                <Button type="primary" htmlType="submit">查询</Button>
              </Col>
            </Row>
          </Form>
          <div className="table">
            <Table columns={columns}
                   rowKey='id'
                   dataSource={this.state.list}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleTableChange.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }
}

const ShopEvaluateLog = Form.create()(List);
export default ShopEvaluateLog;
