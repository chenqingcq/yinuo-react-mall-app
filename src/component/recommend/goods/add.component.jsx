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
  Checkbox,
  Popconfirm,
  Modal,
  InputNumber,
  Upload,
  Icon,
  Alert
} from "antd";
const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import style from "../style.less"

var shopGoodsEntityList = [];
class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {},
      config: {
        status:6,
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      selectedRowKeys: [],
      isDispleyList:[],

      selectedSpeList: new Map(), // 选中规格值
      selectedSpeNamePrice: [],
      skuCoverPic: {}, // 商品规格中的图片

      modifyBoxVisible:false,
      modifyBoxVisibleKey:0,
      selectedId:'',

      detail:{
        
      }
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
      pagination.total = response.data.total;
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

  createGoodsRecommend = () => {
    let _this = this;  
    Actions.createGoodsRecommend({
        spuIds: _this.state.isDispleyList,
      }).then(response => {
        if (response.code == 0) {
          Utils.dialog.success("推荐成功", () => {
            this.props.history.push(`/recommend/goods/index`);
          });
          _this.setState({
            selectedRowKeys:[]
          })
        }
      });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { selectedSpeList } = this.state;

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
      {
        title: "库存",
        dataIndex: "stock",
        key: "stock",
        render: (stock,res) => {
          return <span>{stock}</span>;
        }
      },
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
    ];

    // 全选 或 全不选
    const rowSelection = {
        selectedRowKeys:this.state.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            let list = selectedRowKeys.join(',');
            this.setState({
                isDispleyList:list,
                selectedRowKeys,
            })
        },
    };

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>新增商品推荐</span>
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
          </Form> */}
          <div className="top flex flex-between">
            <Button disabled={this.state.selectedRowKeys.length === 0} onClick={this.createGoodsRecommend.bind(this)}>批量推荐</Button>
          </div>
          <div style={{ margin: '15px 0' }}>
            <Alert
              message={`已选${this.state.selectedRowKeys.length}个商品`}
              type="info"
              showIcon
            />
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
          </div>
        </div>
      </div>
    );
  }
}

const GoodsRecommendAddList = Form.create()(List);
export default GoodsRecommendAddList;
