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
  Popconfirm
} from "antd";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import style from "../style.less";

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
    };
  }

  componentDidMount() {
    this.getList()
  }

  // 获取列表数据
  getList(){
    this.setState({ loading: true });
    Actions.getShopGoodsClass().then(response => {
      if(response.code === 0){
        let list = Utils.transformCascaderData(response.data,{id:0})  
        this.setState({
            loading: false,
            list,
        });
      }  
    })
  }

  // 顶部搜索条件 点击查询按钮 -->  调用getList
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
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
    Actions.deleteShopGoodsClass({
      id: id
    }).then(result => {
      if (result.code == 0) {
        this.getList()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: "排序",
        dataIndex: "sort",
        key: "sort",
      },  
      {
        title: "分类名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "上级分类",
        dataIndex: "parentId",
        key: "parentId",
        render: (parentId,res) => {
            return parentId === 0 ? '顶级' : ''
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: (id,res,index) => {
          return (
            <div className="operation">
              <Link to={`/goods/class/index/edit/${id}`}>
                <Button>编辑</Button>
              </Link>
              <Popconfirm placement="left" title={'确定删除该商品分类？'} onConfirm={() => this.onDelete(id, index)}
                        okText="确定" cancelText="取消">
                <Button>删除</Button>
              </Popconfirm>
              {
                  res.parentId === 0 && <Link to={`/goods/class/index/add/${id}`}><Button>添加下级</Button></Link>
              }
            </div>
          );
        }
      }
    ];

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>商品分类</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content tableList">
          {/* <Form
            className="ant-advanced-search-form tableListForm"
            layout="inline"
            onSubmit={this.handleSearch}
          >
            <Row gutter={24}>
              <Col md={8} sm={24}>
                <FormItem label="人脉账号">
                  {getFieldDecorator("name")(
                    <Input placeholder="请输入人脉账号" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <span className="submitButtons operation">
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </span>
              </Col>
            </Row>
          </Form> */}
          <div className="top flex flex-between">
            <Link to={`/goods/class/index/add`}>
              <Button type="primary">新增分类</Button>
            </Link>
          </div>
          <div className="table">
            <Table
              columns={columns}
              rowKey="id"
              dataSource={this.state.list}
              pagination={false}
              loading={this.state.loading}
              onChange={this.handleTableChange.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const ShopGoodsClassList = Form.create()(List);
export default ShopGoodsClassList;
