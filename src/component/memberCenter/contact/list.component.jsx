import {Link} from 'react-router-dom';
import {Select, Button, Input, Form, Table, Breadcrumb, Row, Col, Popconfirm, Alert} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

import * as Actions from '../actions'
import Utils from '../../../common/utils/utils'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        
      ],
      pagination: {},
      config: {
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      contactsCount:"" // 会员人脉数量
    }
  }

  componentDidMount() {
    this.getMemberContactList()
    this.getMemberContactsCount()
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values,'-------values------')
      this.setState({
        filters: values
      })
      this.getMemberContactList({...values})
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getMemberContactList({
      pageSize: this.state.pageSize ? this.state.pageSize : 10,
      pageNum: pagination.current,
      ...this.state.filters
    });
  }

  getMemberContactsCount(){ // 获取人脉总数
    Actions.getMemberContactsCount({}).then(response => {
      if(response.code === 0){
        this.setState({
          contactsCount:response.data
        });
      }
    })
  }

  getMemberContactList(params) {
    params = {...this.state.config, ...params};
    console.log(params,'----------------')
    this.setState({loading: true})
    Actions.getMemberContactList(params).then(response => {
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

  // 删除
  onDelete = (id, index) => {
    Actions.deleteMemberContact({
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
    const {contactsCount} = this.state;
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
        title: "人脉昵称",
        dataIndex: "MemberContactsVo.contactsNickName",
        key: "MemberContactsVo.contactsNickName",
      },
      {
        title: "人脉账号",
        dataIndex: "MemberContactsVo.contactsPhone",
        key: "MemberContactsVo.contactsPhone",
      },
      {
        title: "人脉级别",
        dataIndex: "MemberContactsVo.level",
        key: "MemberContactsVo.level",
        render: (MemberContactsVo,record) => {
          if(record){
            return <span>{record.MemberContactsVo.level === 1 ? "一度" : "二度"}</span>
          }
        }
      },
      {
        title: "人脉身份",
        dataIndex: "MemberInfoVo.identity",
        key: "MemberInfoVo.identity",
        render: (MemberInfoVo,record) => {
          if(record){
            let text = '';
            switch(record.MemberInfoVo.identity){
              case "MEMBER" :
                text = '会员';
                break;
              case "PERSONAL_SHOP" :
                text = '个人商家';
                break;
              case "ENTERPRISE_SHOP" :
                text = '企业商家';
                break;    
            }
            return <span>{text}</span>
          }
        }
      },
      {
        title: "更新时间",
        dataIndex: "MemberContactsVo.gmtModified",
        key: "MemberContactsVo.gmtModified",
        render: (gmtModified,record) => {
          return Utils.formatDate(record.MemberContactsVo.gmtModified, 'YYYY-MM-DD hh:ii')
        }
      },
    ];
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>人脉关系</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          {/*<div className="top flex flex-between">*/}
           {/*<Button type="primary"><Link to={`${this.props.match.url}/add`}>新增</Link></Button>*/}
          {/*</div>*/}
          <Form
            className="ant-advanced-search-form tableListForm"
            onSubmit={this.handleSearch}
          >
            <Row gutter={24}>
              <Col md={8} sm={24} key='1'>
                <FormItem label='人脉账号'>
                  {getFieldDecorator('phone')(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24} key='2'>
                <FormItem md={8} sm={24} label='人脉级别'>
                  {getFieldDecorator('level')(
                    <Select>
                      <Option value={' '}>全部</Option>
                      <Option value={1}>一度</Option>
                      <Option value={2}>二度</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24} key='3'>
                <FormItem label='人脉身份'>
                  {getFieldDecorator('identity')(
                    <Select>
                      <Option value=''>全部</Option>
                      <Option value='MEMBER'>会员</Option>
                      <Option value='PERSONAL_SHOP'>个人商家</Option>
                      <Option value='ENTERPRISE_SHOP'>企业商家</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24} sm={24} style={{textAlign: 'right',}} className='searchBtn'>
                <Button type="primary" htmlType="submit">查询</Button>
              </Col>
            </Row>
          </Form>
          <div style={{ marginTop: 15 }}>
            <Alert
              message={`一度人脉总数:${contactsCount.firstCount}   二度人脉总数:${contactsCount.secondCount}`}
              type="info"
              showIcon
            />
          </div>
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

const MemberContactList = Form.create()(List);
export default MemberContactList;
