import {Link} from 'react-router-dom';
import {Select, Button, Input, Form, Table, Breadcrumb, Row, Col, Popconfirm} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

import * as Actions from '../actions'
import Utils from '../../../common/utils/utils'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          id: 1,
          loginName: '124325',
          nickName: 'xxx',
          gender: 0,
          birthday: 124352335,
          recommender: 12432534,
          headerImg: '',
          status: 0,
        }
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
    // this.getMemberInfoList()
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        filters: values
      })
      this.getMemberInfoList({...values})
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getMemberInfoList({
      size: this.state.size ? this.state.size : 10,
      currentPage: pagination.current,
      ...this.state.filters
    });
  }

  getMemberInfoList(params) {
    params = {...this.state.config, ...params}
    this.setState({loading: true})
    Actions.getMemberInfoList(params).then(response => {
      const pagination = {...this.state.pagination};
      pagination.current = params.currentPage;
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

  // 删除
  onDelete = (id, index) => {
    Actions.deleteMemberInfo({
      id: id
    }).then(result => {
      if (result.code == 0) {
        Utils.dialog.success('删除成功')
        let list = this.state.list
        list.splice(index, 1)
        this.setState({list})
      } else {
        Utils.dialog.error(result.errorMsg)
      }
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
        title: "登录账号",
        dataIndex: "loginName",
        key: "loginName",
      },
      {
        title: "昵称",
        dataIndex: "nickName",
        key: "nickName",
      },
      {
        title: "性别",
        dataIndex: "gender",
        key: "gender",
        render: (gender) => {
          switch (gender) {
            case 0:
              return '男'
              break
            case 1:
              return '女'
              break
            case 2:
              return '未知'
              break
          }
        }
      },
      {
        title: "推荐人账号",
        dataIndex: "recommender",
        key: "recommender",
      },
      {
        title: "加入时间",
        dataIndex: "gmtCreate",
        key: "gmtCreate",
        render: (gmtCreate) => {
          return Utils.formatDate(gmtCreate, 'YYYY-MM-DD hh:ii')
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id ",
        render: (id, record, index) => {
          let {match} = this.props, url = `${match.url}/edit/${id}`
          return <div className='operation'>
            <Link to={url}><Button icon='edit'>编辑</Button></Link>
            <Popconfirm placement="left" title={'确定删除该会员？'} onConfirm={() => this.onDelete(id, index)}
                        okText="确定" cancelText="取消">
              <Button icon='delete'>删除</Button>
            </Popconfirm>
          </div>
        }
      }
    ];
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>会员列表</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div className="top flex flex-between">
           <Button type="primary"><Link to={`${this.props.match.url}/add`}>新增</Link></Button>
          </div>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
          >
            <Row gutter={40}>
              <Col {...colLayout} key='1'>
                <FormItem {...formItemLayout} label='登录账号'>
                  {getFieldDecorator('loginName')(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout} className='searchBtn'>
                <Button type="primary" htmlType="submit">查询</Button>
              </Col>
            </Row>
            {/*<Row >*/}
              {/*<Col span={24} style={{textAlign: 'right',}} className='searchBtn'>*/}
                {/*<Button type="primary" htmlType="submit">查询</Button>*/}
              {/*</Col>*/}
            {/*</Row>*/}
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

const MemberInfoList = Form.create()(List);
export default MemberInfoList;
