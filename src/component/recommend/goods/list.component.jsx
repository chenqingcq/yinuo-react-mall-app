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
  Popconfirm,
  Modal,
  TreeSelect,
  InputNumber
} from "antd";
const Option = Select.Option;
const FormItem = Form.Item;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";

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
      sortBoxVisible: false, // 更改排序 弹出框
      sortBoxVisibleKey: 0, // 更改排序 弹出框 key
      selectedInfo: {  // 选中信息
        id: '',
        sort: ''
      },
    };
  }

  componentDidMount(){
    this.getList()
  }

  // 获取列表数据
  getList(params) {
    params = {...this.state.config, ...params}
    this.setState({loading: true})
    Actions.getGoodsRecommendList(params).then(response => {
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

  // 删除
  onDelete = (id, index) => {
    Actions.spuIds({
      spuIds: id
    }).then(result => {
      if (result.code == 0) {
        Utils.dialog.success("删除成功");
        let list = this.state.list;
        list.splice(index, 1);
        this.setState({ list });
      } else {
        Utils.dialog.error(result.errorMsg);
      }
    });
  };

  // 点击表格列表中的更改排序按钮
  handleEditSort = (id, record) => {
    let selectedInfo = this.state.selectedInfo;
    selectedInfo.id = id;
    selectedInfo.sort = record.sort;
    this.setState({
      sortBoxVisibleKey:this.state.sortBoxVisibleKey + 1,
      sortBoxVisible : true,
      selectedInfo
    })
  }

  // 更改排序
  handleEditSortSubmit = () => {
    let _this = this,
      selectedInfo = this.state.selectedInfo;
    this.props.form.validateFields((err, values) => {
      if (!err || (err && !err.sort)) {
        Actions.sortGoodsRecommend({
          id:selectedInfo.id,
          sort:values.sort,
        }).then(result => {
          if (result.code == 0) {
            _this.setState({sortBoxVisible: false,sortBoxVisibleKey:this.state.sortBoxVisibleKey + 1})
            Utils.dialog.success('更改成功')
            let list =_this.state.list.map(record => {
              if(record.id == selectedInfo.id) {
                record.sort =  values.sort
              }
              return record
            })
            _this.setState({
              list
            })
          }
        })
      }
    });
  }

  // 取消更改排序
  handleCancelEditSort = () => {
    this.setState({
      sortBoxVisible: false,
      sortBoxVisibleKey:this.state.sortBoxVisibleKey + 1,
    })
  }

  addRecommend = () => {
    
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { detail, treeSelectValue, selectedInfo } = this.state;
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
        title: "序号",
        dataIndex: "sort",
        key: "sort"
      },
      {
        title: "商品名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "创建时间",
        dataIndex: "gmtCreate",
        key: "gmtCreate",
        render: gmtCreate => {
          return Utils.formatDate(gmtCreate, "YYYY-MM-DD hh:ii");
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id ",
        render: (id, record, index) => {
          let { match } = this.props,
            url = `${match.url}/edit/${id}`;
          return (
            <div className="operation">
              <Link to={url}>
                <Button icon="edit">编辑</Button>
              </Link>
              <Popconfirm
                placement="left"
                title={"确定删除该商品推荐？"}
                onConfirm={() => this.onDelete(id, index)}
                okText="确定"
                cancelText="取消"
              >
                <Button icon="delete">删除</Button>
              </Popconfirm>
              <Button icon='edit' onClick={this.handleEditSort.bind(this, id, record)}>更改序号</Button>
            </div>
          );
        }
      }
    ];
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>商品推荐列表</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div className="top flex flex-between">
            <Link to={`/recommend/goods/index/add`}>
              <Button type="primary">
                新增
              </Button>
            </Link>
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
          <Modal title="更改排序"
                 key={this.state.sortBoxVisibleKey}
                 visible={this.state.sortBoxVisible}
                 wrapClassName="vertical-center-modal"
                 okText="修改"
                 cancelText="取消"
                 onOk={this.handleEditSortSubmit.bind(this)}
                 onCancel={this.handleCancelEditSort.bind(this)}
          >
            <Form layout="vertical">
              <FormItem label='序列号'>
                {getFieldDecorator('sort', {
                  rules: [
                    {
                      type: 'number', message: '必须为数字',
                    }
                  ],
                  initialValue: selectedInfo.sort
                })(
                  <InputNumber size="large" min={1}/>
                )}
              </FormItem>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

const GoodsRecommendList = Form.create()(List);
export default GoodsRecommendList;
