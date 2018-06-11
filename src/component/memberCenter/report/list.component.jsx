import {Link} from 'react-router-dom';
import {Select, Button, Input, Form, Table, Breadcrumb, Row, Col, Tabs } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import * as Actions from '../actions'
import Utils from '../../../common/utils/utils'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportList: [
        {
          id: 1,
          loginName: '124325',
          nickName: 'xxx',
          level: 0,
          contactName: '1243645',
          contactIdentity: '会员',
          birthday: 124352335,
          recommender: 12432534,
          headerImg: '',
          status: 0,
          gmtModified: 123432546
        }
      ],
      reportedList: [
        {
          id: 1,
          loginName: '124325',
          nickName: 'xxx',
          level: 0,
          contactName: '1243645',
          contactIdentity: '会员',
          birthday: 124352335,
          recommender: 12432534,
          headerImg: '',
          status: 0,
          gmtModified: 123432546
        }
      ],
      reportPagination: {},
      reportedPagination: {},
      config: {
        currentPage: 1,
        size: 10
      },
      reportLoading: false,
      reportedLoading: false,
    }
  }

  componentDidMount() {
    // this.getMemberContactList()
  }

  handleReportSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        reportFilters: values
      })
      this.getReportList({...values})
    });
  }
  handleReportTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.reportPagination};
    pager.current = pagination.current;
    this.setState({
      reportPagination: pager,
    });
    this.getReportList({
      size: this.state.size ? this.state.size : 10,
      currentPage: pagination.current,
      ...this.state.reportFilters
    });
  }
  getReportList(params) {
    params = {...this.state.config, ...params}
    this.setState({loading: true})
    Actions.getMemberContactList(params).then(response => {
      const pagination = {...this.state.pagination};
      pagination.current = params.currentPage + 1;
      pagination.total = response.data.total;
      pagination.showTotal = (total) => {
        return `总共 ${total} 条`
      }
      this.setState({
        loading: false,
        list: response.data.records,
        pagination,
      });
    })
  }

  handleReportedSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        reportedFilters: values
      })
      this.getReportedList({...values})
    });
  }
  handleReportedTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.reportedPagination};
    pager.current = pagination.current;
    this.setState({
      reportedPagination: pager,
    });
    this.getReportedList({
      size: this.state.size ? this.state.size : 10,
      currentPage: pagination.current,
      ...this.state.reportedFilters
    });
  }
  getReportedList(params) {
    params = {...this.state.config, ...params}
    this.setState({loading: true})
    Actions.getMemberContactList(params).then(response => {
      const pagination = {...this.state.pagination};
      pagination.current = params.currentPage;
      pagination.total = response.totalCount;
      pagination.showTotal = (total) => {
        return `总共 ${total} 条`
      }
      this.setState({
        loading: false,
        list: response.rows,
        pagination,
      });
    })
  }

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
        title: "举报账号",
        dataIndex: "loginName",
        key: "loginName",
      },
      {
        title: "被举报账号",
        dataIndex: "nickName",
        key: "nickName",
      },
      {
        title: "举报主题",
        dataIndex: "contactName",
        key: "contactName",
      },
      {
        title: "举报主题内容",
        dataIndex: "level",
        key: "level",
      },
      {
        title: "举报状态",
        dataIndex: "contactIdentity",
        key: "contactIdentity",
      },
      {
        title: "处理结果",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          return '未处理'
        }
      },
      {
        title: "更新时间",
        dataIndex: "gmtModified",
        key: "gmtModified",
        render: (gmtModified) => {
          return Utils.formatDate(gmtModified, 'YYYY-MM-DD hh:ii')
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id ",
        render: (id, record, index) => {
          let {match} = this.props, url = `${match.url}/edit/${id}`
          return <div className='operation'>
            <Link to={url}><Button icon='eye'>查看详情</Button></Link>
          </div>
        }
      }
    ];
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>举报记录</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          {/*<div className="top flex flex-between">*/}
          {/*<Button type="primary"><Link to={`${this.props.match.url}/add`}>新增</Link></Button>*/}
          {/*</div>*/}

          <Tabs defaultActiveKey="1" >
            <TabPane tab="举报" key="1">
              <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
              >
                <Row gutter={40}>
                  <Col {...colLayout} key='1'>
                    <FormItem {...formItemLayout} label='会员账号'>
                      {getFieldDecorator('contactName')(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout} key='2'>
                    <FormItem {...formItemLayout} label='举报状态'>
                      {getFieldDecorator('level')(
                        <Select>
                          <Option value={' '}>全部</Option>
                          <Option value={1}>待处理</Option>
                          <Option value={2}>主动撤回</Option>
                          <Option value={3}>已处理</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout} key='3'>
                    <FormItem {...formItemLayout} label='举报主题'>
                      {getFieldDecorator('contactIdentity')(
                        <Select>
                          <Option value=''>全部</Option>
                          <Option value='member'>商品问题</Option>
                          <Option value='personal'>订单问题</Option>
                          <Option value='company'>商家问题</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={24} style={{textAlign: 'right',}} className='searchBtn'>
                    <Button type="primary" htmlType="submit">查询</Button>
                  </Col>
                </Row>
              </Form>
              <div className="table">
                <Table columns={columns}
                       rowKey='id'
                       dataSource={this.state.reportList}
                       pagination={this.state.reportPagination}
                       loading={this.state.reporLoading}
                       onChange={this.handleReportTableChange.bind(this)}
                />
              </div>
            </TabPane>
            <TabPane tab="被举报" key="2">
              <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
              >
                <Row gutter={40}>
                  <Col {...colLayout} key='1'>
                    <FormItem {...formItemLayout} label='会员账号'>
                      {getFieldDecorator('contactName1')(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout} key='2'>
                    <FormItem {...formItemLayout} label='举报状态'>
                      {getFieldDecorator('level1')(
                        <Select>
                          <Option value={' '}>全部</Option>
                          <Option value={1}>待处理</Option>
                          <Option value={2}>主动撤回</Option>
                          <Option value={3}>已处理</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout} key='3'>
                    <FormItem {...formItemLayout} label='举报主题'>
                      {getFieldDecorator('contactIdentity1')(
                        <Select>
                          <Option value=''>全部</Option>
                          <Option value='member'>商品问题</Option>
                          <Option value='personal'>订单问题</Option>
                          <Option value='company'>商家问题</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={24} style={{textAlign: 'right',}} className='searchBtn'>
                    <Button type="primary" htmlType="submit">查询</Button>
                  </Col>
                </Row>
              </Form>
              <div className="table">
                <Table columns={columns}
                       rowKey='id'
                       dataSource={this.state.reportedList}
                       pagination={this.state.reportedPagination}
                       loading={this.state.reportedLoading}
                       onChange={this.handleReportedTableChange.bind(this)}
                />
              </div>
            </TabPane>
          </Tabs>

        </div>
      </div>
    )
  }
}

const ReportList = Form.create()(List);
export default ReportList;
