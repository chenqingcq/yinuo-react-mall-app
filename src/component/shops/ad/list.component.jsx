import {Link} from 'react-router-dom';
import {Select, Button, Input, Form, Table, Card, Breadcrumb, Modal,Row,rowKey, Col, Icon, Badge, Popconfirm} from 'antd';
const confirm = Modal.confirm;

import * as Actions from '../actions'
import Utils from '../../../common/utils/utils'
import style from '../address/style.less'

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
    }
  }

  componentDidMount() {
    this.getList()
  }

  // 获取广告位列表
  getList = (params) => {
    params = {...this.state.config, ...params}
    this.setState({loading: true})
    Actions.getShopAdApplyList(params).then(response => {
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
  // 表格分页操作
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.getList({
      pageSize: this.state.pageSize ? this.state.pageSize : 10,
      pageNum: pagination.current,
      ...this.state.filters
    });
  }
  // 删除
  onDelete = (id, index) => {
    let _this = this;
    Actions.deleteShopAdApply({
      id: id
    }).then(result => {
      if (result.code == 0) {
        Utils.dialog.success('删除成功')
        let list = this.state.list
        list.splice(index, 1)
        _this.setState({
          list:list
        })
      } else {
        Utils.dialog.error(result.errorMsg)
      }
    })
  }
  //撤回
  withDraw = (id, index) => {
    let _this = this;
    Actions.shopAdWithdraw({
      id: id
    }).then(result => {
      if (result.code == 0) {
        Utils.dialog.success('撤回成功')
        let list = this.state.list
        list[index].shopAdStatusLogVo.currentStatus = 4
        _this.setState({
          list:list
        })
      } else {
        Utils.dialog.error(result.errorMsg)
      }
    })
  }

  render() {
    const columns = [
      {
        title: "广告主题",
        dataIndex: "shopAdApplyVo.subject",
        key: "shopAdApplyVo.subject"
      },
      {
        title: "申请天数",
        dataIndex: "shopAdApplyVo.day",
        key: "shopAdApplyVo.day"
      },
      {
        title: "广告位预设图片",
        dataIndex: "pic",
        key: "pic",
        render : (pic,res,index) => {
            return <img style={{width:"100px",height:"60px"}} src={`${res.shopAdApplyVo.pic}`}/>
        }
      },
      {
        title: "跳转类型",
        dataIndex: "jump",
        key: "jump",
        render : (jump, res, index) => {
          if(res.jump){
            return <span>商品</span>
          }else if(!res.jump){
            return <span>店铺</span>
          }
        }
      },
      {
        title: "跳转对象",
        dataIndex: "shopAdApplyVo.objId",
        key: "shopAdApplyVo.objId",
      },
      {
        title: "状态",
        dataIndex: "shopAdStatusLogVo.currentStatus",
        key: "shopAdStatusLogVo.currentStatus",
        render : (shopAdStatusLogVo, res, index) => {
          let statusText, text;
          switch (res.shopAdStatusLogVo.currentStatus) {
            case 0:
              statusText = "success";
              text = "提交申请";
              break;
            case 1:
              statusText = "success";
              text = "审核成功";
              break;
            case 2:
              statusText = "default";
              text = "审核失败";
              break;
            case 3:
              statusText = "success";
              text = "缴费成功";
              break;
            case 4:
              statusText = "default";
              text = "主动撤回";
              break;
          }
          return <Badge status={statusText} text={text} />;
        }
      },
      {
        title: "申请时间",
        dataIndex: "gmtCreate",
        key: "gmtCreate",
        render : (gmtCreate,res) => {
          return Utils.formatDate(res.shopAdApplyVo.gmtCreate, "YYYY-MM-DD hh:ii");
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: (id,res,index) => {
          let {match} = this.props, 
          editUrl = `${match.url}/edit/${res.shopAdApplyVo.id}`
          if(res.shopAdStatusLogVo.currentStatus == 0 || res.shopAdStatusLogVo.currentStatus ==1){
            return (
              <div className="operation">
                <Link to={editUrl}>
                  <Button icon='edit'>编辑</Button>
                </Link>
                <Popconfirm placement="left" title={'确定删除广告位申请记录？'} onConfirm={() => this.onDelete(res.shopAdApplyVo.id, index)}
                          okText="确定" cancelText="取消">
                  <Button icon='delete'>删除</Button>
                </Popconfirm>
                <Popconfirm placement="left" title={'确定撤回该广告位申请？'} onConfirm={() => this.withDraw(res.shopAdApplyVo.id, index)}
                          okText="确定" cancelText="取消">
                  <Button icon="withdraw" display='none'>撤回</Button>
                </Popconfirm>
              </div>
            );
          }else{
            return (
              <div className="operation">
                <Link to={editUrl}>
                  <Button icon='edit'>编辑</Button>
                </Link>
                <Popconfirm placement="left" title={'确定删除广告位申请记录？'} onConfirm={() => this.onDelete(res.shopAdApplyVo.id, index)}
                          okText="确定" cancelText="取消">
                  <Button icon='delete'>删除</Button>
                </Popconfirm>
              </div>
            );
          }
        }
      }
    ];
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>广告位申请列表</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div className="top flex flex-between">
          <Button type="primary"><Link to={`${this.props.match.url}/add`}>新增广告位申请</Link></Button>
          </div>
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
    )
  }
}

const ShopAdList = Form.create()(List);
export default ShopAdList;
