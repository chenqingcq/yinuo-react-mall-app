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
  Icon
} from "antd";
const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import style from "../style.less";

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

  onOffShelfGoods = (id, index) => {
    Actions.offShelfGoods({
      id: id
    }).then(result => {
      if (result.code == 0) {
        Utils.dialog.success('下架成功')
        let list = this.state.list
        list.splice(index, 1)
        this.setState({list})
      } else {
        Utils.dialog.error(result.errorMsg)
      }
    })
  }

  onModify = (id) => {
    this.setState({
      modifyBoxVisible:true,
      modifyBoxVisibleKey:this.state.modifyBoxVisibleKey + 1,
      selectedId:id
    })
    this.getGoodsDetail(id)
  }

  // 提交保存商品
  onOkModify = e => {
    e.preventDefault();
    let { selectedSpeList, selectedSpeNamePrice } = this.state,
      shopGoodsSpecList = [];
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let goodsParam = {};
        for (let [key, value] of Object.entries(values)) {
          if (key.indexOf("_") > -1) {
            let data = key.split("_"),
              index = data[1],
              prop = data[0];
            shopGoodsEntityList[index].specList =
              shopGoodsEntityList[index].specList;
            if(prop === 'price' || prop === 'marketPrice'){
              shopGoodsEntityList[index][prop] = value * 100;
            }else{
              shopGoodsEntityList[index][prop] = value;
            } 
          }
        }
        selectedSpeNamePrice.forEach((el,index) => {
          shopGoodsEntityList[index].id = el.id
        })
        goodsParam.spuId = this.state.selectedId;
        goodsParam.skuJson = JSON.stringify(shopGoodsEntityList);
        Actions.updateSaleInfo(goodsParam).then(response => {
          if (response.code == 0) {
            Utils.dialog.success('修改成功');
            this.setState({
              modifyBoxVisible:false,
              modifyBoxVisibleKey:this.state.modifyBoxVisibleKey + 1
            })
          }
        });
      }
    });
  };

  onCancelModify = () => {
    this.setState({
      modifyBoxVisible:false,
      modifyBoxVisibleKey:this.state.modifyBoxVisibleKey + 1
    })
  }

  // 获取商品详情
  getGoodsDetail = (id) => {
    let _this = this;
    Actions.getGoodsDetail({
      id: id
    }).then(response => {
      if (response.code === 0) {
        let specList = response.data.skuList[0].specList;
        let selectedSpeList = new Map();
        let specMap = response.data.allSpecList;
        specMap.map((record, index) => {
          let specId = '';
          for(let i = 0; i < specList.length; i++){
            if(record.name === specList[i].specName){
              specId = specList[i].specId
            }
          }
          selectedSpeList.set(`${record.name}`, {
            inputVisible: false, // 是否显示添加输入框的标志
            speValues: new Set(record.value),
            index: 0,
            specId:specId
          })
        });
        _this.setState({
          detail: response.data,
          selectedSpeList,
          selectedSpeNamePrice: response.data.skuList,
        });
      }
    });
  }

  // 商品主图上传
  beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过2MB!");
    }
    return isLt2M;
  }

  normFile = e => {
    let fileList = e.fileList
      .filter(file => {
        if (file.response) {
          if (file.response.code === 0) {
            file.url = file.response.data;
            return true;
          }
        }
        return true;
      })
      .slice(-1);
    return fileList[0].url;
  };

  // 渲染规格值表格
  renderTable = () => {
    
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 16 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;
    const props = {
      className: "avatar-uploader-small",
      action: Actions.uploadFile,
      showUploadList: false,
      withCredentials: true,
      beforeUpload: this.beforeUpload.bind(this),
      name: "upfile",
      accept: "image/*",
      data: {
        withStatus: true
      },
      headers: {
        "X-Requested-With": null
      },
      onProgress: null,
      disabled: true
    };

    shopGoodsEntityList = [];
    
    let rows = 1,
      $rows = [],
      rowSpan = [],
      row_index = 1,
      selectedSpeList = [...this.state.selectedSpeList],
      selectedSpeNamePriceLength = this.state.selectedSpeNamePrice.length;
    let _index = [],
      show_flag = false; //显示表格
    //如果有规格且该规格的规格值长度不为0,就显示表格
    for (let i = 0; i < selectedSpeList.length; i++) {
      if (selectedSpeList[i][1].speValues.size != 0) {
        show_flag = true;
      }
    }
    if (!show_flag) {
      return;
    }
    //记录第一行每个单元格的rowspan
    for (let i = 0; i < selectedSpeList.length; i++) {
      var _rows = 1,
        size = selectedSpeList[i][1].speValues.size;
      _index.push(0);
      if (size != 0) {
        rows *= size;
      }
      for (let j = i + 1; j < selectedSpeList.length; j++) {
        if (selectedSpeList[j][1].speValues.size != 0) {
          _rows *= selectedSpeList[j][1].speValues.size;
        }
      }
      rowSpan.push(_rows);
    }
    for (let i = 0; i < rows; i++) {
      $rows.push(i);
    }
    return (
      <FormItem>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-bordered ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table>
                  <thead className="ant-table-thead">
                    <tr>
                      { detail.allSpecList[0].id !== 0 && [...selectedSpeList].map(value => {
                            let speName = value[0],
                              speValues = value[1].speValues;
                            if (speValues.size != 0) {
                              return (
                                <th key={speName}>
                                  <span>{speName}</span>
                                </th>
                              );
                            }
                          })}
                      {
                         detail.allSpecList[0].id !== 0 && <th>
                            <span>商品图片</span>
                          </th>
                      }
                      {
                         detail.allSpecList[0].id !== 0 && <th>
                            <span>商品名称</span>
                          </th>
                      }
                      <th>
                        <span>销售价格</span>
                      </th>
                      <th>
                        <span>市场价格</span>
                      </th>
                      <th>
                        <span>库存</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {$rows.map((v, r_index) => {
                      // let name = shopGoodsEntityList.length ? shopGoodsEntityList[r_index].name : '',
                      //  price = shopGoodsEntityList.length ? shopGoodsEntityList[r_index].price : 0,
                      shopGoodsEntityList.push({ specList: [] });
                      return (
                        <tr className="ant-table-row" key={v}>
                          { detail.allSpecList[0].id !== 0 && selectedSpeList.map((value, c_index) => {
                            // console.log(value)
                            let speName = value[0],
                              speValues = value[1].speValues,
                              specId = value[1].specId;
                            // 如果该规格没有规格值就不用返回td
                            if (speValues.size == 0) {
                              return;
                            }
                            let index = 0;
                            // 需要渲染当前单元格
                            if (
                              r_index % rowSpan[c_index] == 0 ||
                              rowSpan[c_index] == 1
                            ) {
                              //当需要渲染的单元格的rowspan等于1的时候
                              if (rowSpan[c_index] == 1) {
                                //取该规格的非最后一个规格值
                                if ((r_index + 1) % speValues.size != 0) {
                                  index =
                                    Math.floor((r_index + 1) % speValues.size) -
                                    1;
                                }
                                //取该规格的最后一个规格值
                                else {
                                  index = speValues.size - 1;
                                }
                              }
                              //如果需要渲染的单元格的rowspan不等于1
                              else {
                                //取该规格的最后一个规格值
                                if (
                                  Math.floor(
                                    (r_index + 1) / rowSpan[c_index]
                                  ) >= speValues.size
                                ) {
                                  index =
                                    Math.floor(
                                      (r_index + 1) / rowSpan[c_index]
                                    ) % speValues.size;
                                }
                                //取该规格的非最后一个规格值
                                else {
                                  index = Math.floor(
                                    (r_index + 1) / rowSpan[c_index]
                                  );
                                }
                              }
                              this.state.selectedSpeList.get(
                                speName
                              ).index = index;
                              value[1].index = index;
                              shopGoodsEntityList[r_index].specList.push({
                                specId: specId,
                                specValue: [...speValues][
                                  this.state.selectedSpeList.get(speName).index
                                ]
                              });
                              return (
                                <td rowSpan={rowSpan[c_index]} key={speName}>
                                  {[...speValues][index]}
                                </td>
                              );
                            }
                            shopGoodsEntityList[r_index].specList.push({
                              specId: specId,
                              specValue: [...speValues][
                                this.state.selectedSpeList.get(speName).index
                              ]
                            });
                          })}
                          {
                            detail.allSpecList[0].id !== 0 && <td>
                                <FormItem>
                                  {getFieldDecorator(`coverPic_${r_index}`, {
                                    rules: [
                                      {
                                        required: false,
                                        message: "请上传一张商品主图"
                                      }
                                    ],
                                    getValueFromEvent: this.normFile.bind(this),
                                    initialValue: selectedSpeNamePriceLength &&
                                    selectedSpeNamePriceLength > r_index
                                      ? this.state.selectedSpeNamePrice[r_index]
                                          .coverPic
                                      : ""
                                  })(
                                    <Upload
                                      {...props}
                                      onChange={({ file, fileList }) => {
                                        if (
                                          file.response &&
                                          file.response.code === 0
                                        ) {
                                          let skuCoverPic = this.state.skuCoverPic;
                                          skuCoverPic[`coverPic_${r_index}`] =
                                            file.response.data;
                                          this.setState({ skuCoverPic });
                                        } else if (
                                          file.response &&
                                          file.response.code !== 0
                                        ) {
                                          Utils.dialog.error(file.response.msg);
                                        }
                                      }}
                                    >
                                      {this.state.selectedSpeNamePrice[r_index]
                                          ? (
                                        <img
                                          src={this.state.selectedSpeNamePrice[r_index]
                                            .coverPic}
                                          alt=""
                                          className="avatar-small"
                                        />
                                      ) : (
                                        <Icon
                                          type="plus"
                                          className="avatar-uploader-trigger-small"
                                        />
                                      )}
                                    </Upload>
                                  )}
                                </FormItem>
                              </td>
                          }
                          {
                            detail.allSpecList[0].id !== 0 && <td>
                                <FormItem>
                                  {getFieldDecorator(`name_${r_index}`, {
                                    rules: [
                                      {
                                        required: false,
                                        message: "请填写商品名称!"
                                      }
                                    ],
                                    initialValue:
                                      selectedSpeNamePriceLength &&
                                      selectedSpeNamePriceLength > r_index
                                        ? this.state.selectedSpeNamePrice[r_index]
                                            .name
                                        : ""
                                  })(
                                    <Input
                                      size="large"
                                      disabled={!this.state.formValible}
                                    />
                                  )}
                                </FormItem>
                              </td>
                          }
                          <td>
                            <FormItem>
                              {getFieldDecorator(`price_${r_index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写商品价格!"
                                  }
                                ],
                                initialValue:
                                  selectedSpeNamePriceLength &&
                                  selectedSpeNamePriceLength > r_index
                                    ? (this.state.selectedSpeNamePrice[r_index]
                                      .price * 0.01).toFixed(2)
                                    : ""
                              })(
                                <InputNumber
                                  size="large"
                                  min={0}
                                />
                              )}
                            </FormItem>
                          </td>
                          <td>
                            <FormItem>
                              {getFieldDecorator(`marketPrice_${r_index}`, {
                                rules: [
                                  {
                                    required: false,
                                    message: "请填写市场价格!"
                                  }
                                ],
                                initialValue:
                                  selectedSpeNamePriceLength &&
                                  selectedSpeNamePriceLength > r_index
                                    ? (this.state.selectedSpeNamePrice[r_index]
                                      .marketPrice * 0.01).toFixed(2)
                                    : ""
                              })(
                                <InputNumber
                                  min={0}
                                  size="large"
                                />
                              )}
                            </FormItem>
                          </td>
                          <td>
                            <FormItem>
                              {getFieldDecorator(`totalStock_${r_index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写库存!"
                                  }
                                ],
                                initialValue:
                                  selectedSpeNamePriceLength &&
                                  selectedSpeNamePriceLength > r_index
                                    ? this.state.selectedSpeNamePrice[r_index]
                                        .skuStockVo.totalStock
                                    : ""
                              })(
                                <InputNumber
                                  size="large"
                                  min={0}
                                />
                              )}
                            </FormItem>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </FormItem>
    );
  };

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
                  ¥{records.price && records.price.length > 1 ? records.price.join('-') : records.price}<a href="javascript:;" style={{marginLeft:5}} onClick={() => this.onModify(records.id)}>修改价格</a>
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
          return <span>{stock}<a href="javascript:;" style={{marginLeft:5}} onClick={() => this.onModify(res.id)}>修改库存</a></span>;
        }
      },
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
              <Popconfirm placement="left" title={'确定下架商品？'} onConfirm={() => this.onOffShelfGoods(id, index)}
                        okText="确定" cancelText="取消">
                <Button>下架</Button>
              </Popconfirm>
              <Popconfirm placement="left" title={'确定删除商品？'} onConfirm={() => this.onDelete(id, index)}
                        okText="确定" cancelText="取消">
                <Button>删除</Button>
              </Popconfirm>
            </div>
          );
        }
      },
      // {
      //   title: "店长推荐",
      //   dataIndex: "check",
      //   key: "check",
      //   render: check => {
      //     return (
      //       <Checkbox></Checkbox>
      //     );
      //   }
      // }
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
            <span>出售中</span>
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
              {/* <Col md={8} sm={24}>
                <FormItem label="商品筛选">
                  {getFieldDecorator("orderStatus")(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="1">店长推荐</Option>
                    </Select>
                  )}
                </FormItem>
              </Col> */}
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
              <Button>下架</Button>
              <Button>删除</Button>
            </div>
          </div>
        </div>
        <Modal title="修改"
              key={this.state.modifyBoxVisibleKey}
              visible={this.state.modifyBoxVisible}
              wrapClassName="vertical-center-modal"
              okText="修改"
              cancelText="取消"
              onOk={this.onOkModify.bind(this)}
              onCancel={this.onCancelModify.bind(this)}
              className={`${style.modifyModal}`}
          >
            {selectedSpeList.size != 0 && this.renderTable()}
          </Modal>
      </div>
    );
  }
}

const GoodsOnOfferList = Form.create()(List);
export default GoodsOnOfferList;
