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
        status:5,
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      selectedRowKeys: []
    };
  }

  componentDidMount() {
    this.getList()
  }

  // 获取列表数据
  getList(params) {
    params = { ...this.state.config, ...params };
    this.setState({ loading: true });
    Actions.getGoodsList(params).then(response => {
      const pagination = {...this.state.pagination};
      pagination.current = params.pageNum;
      pagination.total = response.data.totalCount;
      pagination.showTotal = (total) => {
        return `总共 ${total} 条`
      }
      let list = response.data.rows.map(el => {
        if(el.price.length !== 0){
          el.price.map((item,index) => {
            el.price[index] = Utils.moneyMinuteToYuan(item)
          })
          return el
        }
      })
      this.setState({
        loading: false,
        list,
        pagination,
      });
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
    Actions.deleteGoods({
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

  onShelfGoods = (id, index) => {
    Actions.onShelfGoods({
      id: id
    }).then(result => {
      if (result.code == 0) {
        Utils.dialog.success('上架成功')
        let list = this.state.list
        list.splice(index, 1)
        this.setState({list})
      } else {
        Utils.dialog.error(result.errorMsg)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: "商品",
        dataIndex: "name",
        key: "name",
        render: (name, records) => {
          return (
            <div className={`${style.goodsItem} flex`}>
              <div className={`${style.url}`}>
                <img
                  src={records.coverPic}
                />
              </div>
              <div className={`${style.goodsinfo} flex-item`}>
                <p className={`${style.name}`}>{name}</p>
                <p className={`${style.spec}`} style={{ color: "#d30000" }}>
                  ¥{records.price && records.price.length > 1 ? records.price.join('-') : records.price}
                </p>
              </div>
            </div>
          );
        }
      },
      // {
      //   title: "库存",
      //   dataIndex: "stock",
      //   key: "stock",
      //   render: stock => {
      //     return <span>{stock}</span>;
      //   }
      // },
      // {
      //   title: "商品让利比",
      //   dataIndex: "benefitPercent",
      //   key: "benefitPercent",
      //   render: benefitPercent => {
      //     return <span>{`${benefitPercent * 100}%`}</span>;
      //   }
      // },
      {
        title: "商品类型",
        dataIndex: "goodsType",
        key: "goodsType",
        render: goodsType => {
          let text;
          switch (goodsType) {
            case 1:
              text = "实体商品";
              break;
            case 2:
              text = "虚拟商品";
              break;
            case 3:
              text = "诺豆服务";
              break;   
          }
          return text;
        }
      },
      {
        title: "商品状态",
        dataIndex: "status",
        key: "status",
        render: status => {
          let statusText, text;
          switch (status) {
            case 0:
              statusText = "success";
              text = "有效";
              break;
            case 1:
              statusText = "default";
              text = "无效";
              break;
            case 2:
              statusText = "processing";
              text = "待审核";
              break;
            case 3:
              statusText = "warning";
              text = "审核不通过";
              break;
            case 4:
              statusText = "error";
              text = "违规禁售";
              break;
            case 5:
              statusText = "default";
              text = "下架";
              break;
            case 6:
              statusText = "success";
              text = "上架";
              break;      
          }
          return <Badge status={statusText} text={text} />;
        }
      },
      {
        title: "时间",
        dataIndex: "gmtCreate",
        key: "gmtCreate",
        render: gmtCreate => {
          return Utils.formatDate(gmtCreate, "YYYY-MM-DD hh:ii");
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: (id,res,index) => {
          return (
            <div className="operation">
              <Link to={`/goods/detail/view/${id}`}>
                <Button>查看详情</Button>
              </Link>
              <Link to={`/goods/detail/edit/${id}`}>
                <Button>编辑</Button>
              </Link>
              <Popconfirm placement="left" title={'确定上架商品？'} onConfirm={() => this.onShelfGoods(id, index)}
                        okText="确定" cancelText="取消">
                <Button>上架</Button>
              </Popconfirm>
              <Popconfirm placement="left" title={'确定删除商品？'} onConfirm={() => this.onDelete(id, index)}
                        okText="确定" cancelText="取消">
                <Button>删除</Button>
              </Popconfirm>
            </div>
          );
        }
      }
    ];

    // 全选 或 全不选
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys
        });
      }
    };

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>仓库中</span>
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
                <FormItem label="商品名称">
                  {getFieldDecorator("name")(
                    <Input placeholder="请输入商品名称" />
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
          </Form>
          <div className="top flex flex-between">
            <Link to={`/goods/detail/index`}>
              <Button type="primary">添加商品</Button>
            </Link>
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
            <div className={`${style.bottomBtn} operation`}>
              <Button>上架</Button>
              <Button>删除</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const GoodsDraftList = Form.create()(List);
export default GoodsDraftList;
