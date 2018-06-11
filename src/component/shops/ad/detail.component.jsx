import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Breadcrumb,
  Button,
  Modal,
  Cascader,
  Tooltip,
  Icon,
  InputNumber,
  Radio,
  Select,
  Upload,
  DatePicker,
  Table, 
  Pagination,
  Badge,
} from "antd";

import moment from 'moment';
const dateFormat = 'YYYY/MM/DD';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import styles from "../index.less";

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_not_add: false, // 添加模式、编辑模式的判断
      formValible: true, // 审核结果决定编辑模式下表单是否可编辑
      detail: {
        shopAdStatusLogVo:{},
        shopAdApplyVo:{
          jump:0,
        },
      },
      isLoading: false,
      options: [],
      submitting: false,
      shouAdTimeVisible: false,
      shouAdTimeVisibleKey: 0,
      adListData:{
        rows:[]
      },
      adList:{
        limit: 6,
        total: 0,
      },
      adSelectedRowKeys: [],
      adSelectedRows:[
        name
      ],
      effectiveTime:[],
      shopId:'',
      jump:'',//0 店铺 1 商品
    }
  }

  componentDidMount() {
    let _this = this, {match} = this.props, id = match.params.id
    this.getAdTimeList()
    this.getShopDetail()
    if (id !== undefined) {
      this.setState({
        is_not_add: true
      })
      this.getDetail(id)
    }
  }
    // 获取广告位占用时间
    getAdTimeList = () => {
      let _this = this;
      Actions.shopAdAdPositions({pageNum:1,pageSize:this.state.adList.limit}).then(response => {
        if (response.code === 0) {
          this.setState({
            adListData: response.data,
          });
        }
      });
    };
    // 广告位分页改变
    adListTableChange = (page, pageSize) => {
      Actions.shopAdAdPositions({
        pageSize: this.state.adList.limit,
        pageNum: page,
      }).then(response => {
        if (response.code === 0) {
          this.setState({
            adListData: response.data,
          });
        }
      });
    }
  // 获取广告位申请信息
  getDetail = (id) => {
    let _this = this;
    Actions.getShopAdApplyDetail({id:id}).then(response => {
      if (response.code === 0) {
        let formValible
        switch (response.data.shopAdStatusLogVo.currentStatus) {
          case 0:
            formValible = false//提交申请
            break;
          case 1:
            formValible = false//审核成功
            break;
          case 2:
            formValible = true//审核失败
            break;
          case 3:
            formValible = false//缴费完成
            break;
          case 4:
            formValible = true//主动撤回
            break;
        }
        response.data.shopAdApplyVo.beginTime = moment(Utils.formatDate(response.data.shopAdApplyVo.beginTime, 'yyyy-mm-dd'), 'YYYY-MM-DD')
        response.data.shopAdApplyVo.endTime = moment(Utils.formatDate(response.data.shopAdApplyVo.endTime, 'yyyy-mm-dd'), 'YYYY-MM-DD')
        this.state.adListData.rows.map(item=>{
          if(item.id == response.data.shopAdApplyVo.adId){
            this.state.adSelectedRows[0] = item
          }
        }) 
        this.setState({
          adSelectedRows: this.state.adSelectedRows,
          detail: response.data,
          formValible: formValible,
          jump: response.data.shopAdApplyVo.jump,
        });
      }
    });
  };
  // 获取当前店铺id
  getShopDetail = () => {
    let _this = this;
    Actions.getShopInfo({}).then(response => {
      if (response.code === 0) {
        _this.setState({
          shopId: response.data.shopInfoExtendVo.shopId,
        });
      }
    });
  };
  // 跳转对象改变
  changeJump = (e) =>{
    let _this = this;
    _this.setState({
      jump: e.target.value,
    });
  }
  // 新增广告位
  creatSubmit = e => {
    e.preventDefault();
    let {match, history} = this.props, _this = this, id = match.params.id
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.beginTime = values.beginTime.valueOf();
        values.endTime = values.endTime.valueOf();
        values.adId =  this.state.adSelectedRows[0].id
        if (id !== undefined) {
          values.id = id
        }
        _this.setState({
          submitting: true
        });
        if(_this.state.is_not_add){
          Actions.updateShopAdApply(values).then(response => {
            if (response.code == 0) {
              Utils.dialog.success("编辑成功");
              _this.setState({
                submitting: false
              });
            }
            // history.push(`/shops/ad/index`);
          });
        }else if(!_this.state.is_not_add){
          Actions.createShopAdApply(values).then(response => {
            if (response.code == 0) {
              Utils.dialog.success("已提交申请");
              _this.setState({
                submitting: false
              });
            }
            history.push(`/shops/ad/index`);
          });
        }
      }
    });
  };
  // 点击查看广告占用时间
  showAdTime = () => {
    this.setState({
      shouAdTimeVisible: true,
      shouAdTimeVisibleKey: this.state.shouAdTimeVisibleKey + 1,
    })
  }
  // 广告位点击确定
  handleOk = () => {
    let _this = this
    _this.state.adListData.rows.map(item => {
      if (item.id == _this.state.adSelectedRowKeys ) {
        _this.state.detail.shopAdApplyVo.adId = item.id
        _this.setState({
          effectiveTime: item.effectiveTime,
          shouAdTimeVisible: false,
          shouAdTimeVisibleKey:this.state.shouAdTimeVisibleKey + 1,
          detail: _this.state.detail
        })
      }
    })
    
  }
  // 取消
  handleCancel = () => {
    this.setState({
      shouAdTimeVisible: false,
      shouAdTimeVisibleKey:this.state.shouAdTimeVisibleKey + 1
    })
  }
  // 广告位单选按钮选中改变
  onSelectChange = (adSelectedRowKeys, adSelectedRows) => {
    this.setState({adSelectedRowKeys, adSelectedRows})
  }
  // 起始时间改变
  handleStartTimeChange = (value) => {
    this.state.detail.shopAdApplyVo.beginTime = moment(Utils.formatDate(value, 'yyyy-mm-dd'), 'YYYY-MM-DD')
    this.setState({
      detail:this.state.detail
    })
    console.warn("beginTime"+this.state.detail.shopAdApplyVo.beginTime);
  }
  // 上传图片之前
  beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Utils.dialog.error("图片大小不能超过2MB!");
    }
    return isLt2M;
  }

  // 图片改变
  shandleChange = (prop, { file, fileList }) => {
    if (file.response && file.response.code === 0) {
      let detail = this.state.detail;
      debugger
      detail.shopAdApplyVo.pic = file.response.data;
      this.setState({ detail });
    } else if (file.response && file.response.code !== 0) {
      Utils.dialog.error(file.response.errorMsg);
    }
  };

  // 上传图片时，转换返回的数据
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

  render() {
    const { getFieldDecorator, getFieldValue,dateFormat } = this.props.form;
    const { submitting} = this.state;
    const {detail, is_not_add, adSelectedRowKeys,adListData,adList,effectiveTime} = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };
    const props = {
      className: "avatar-uploader",
      action: Actions.uploadFile,
      showUploadList: false,
      withCredentials: true,
      beforeUpload: this.beforeUpload.bind(this),
      onChange: this.shandleChange.bind("pic",this),
      name: "upfile",
      accept: "image/*",
      data: {
        withStatus: true
      },
      headers: {
        "X-Requested-With": null
      },
      onProgress: null
    };
    const rowSelection = {
      type: 'radio',
      adSelectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    };
    const adColumns = [
      {
        title: "名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "归属",
        dataIndex: "belong",
        key: "belong",
        render : (belong, res) => {
          if(res.belong == 0){
            return <span>首页</span>
          }else{
          }
        }
      }, {
        title: "描述",
        dataIndex: "remark",
        key: "remark",
      },
      {
        title: "价格/天",
        dataIndex: "price",
        key: "price"
      },
      {
        title: "排序",
        dataIndex: "sort",
        key: "sort"
      },
      {
        title: "宽度",
        dataIndex: "width",
        key: "width"
      },
      {
        title: "高度",
        dataIndex: "height",
        key: "height"
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render : (status, res) => {
          let statusText, text;
          switch (res.status) {
            case 0:
              statusText = "success";
              text = "有效";
              break;
            case 1:
              statusText = "default";
              text = "无效";
              break;
          }
          return <Badge status={statusText} text={text} />;
        }
      },
      
    ]
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={`/shops/ad/index`}>
              <span>广告位申请</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {is_not_add ? '广告位编辑' : '新增广告位申请'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Form onSubmit={this.creatSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="广告主题">
                {getFieldDecorator("subject", {
                rules: [
                    {
                    required: true,
                    message: "请输入广告主题"
                    }
                ],
                initialValue:detail.shopAdApplyVo.subject
                })(<Input placeholder="请输入广告主题" disabled={!this.state.formValible} />)}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="起止时间"
                colon={false}
                hasFeedback
            >
                {getFieldDecorator('beginTime',{
                    rules: [
                        {
                        required: true,
                        message: "请选择开始时间"
                        }
                    ],
                    initialValue: detail.shopAdApplyVo.beginTime
                })(
                    <DatePicker showTime format="YYYY-MM-DD"   onChange={this.handleStartTimeChange} disabled={!this.state.formValible} />
                )} - {getFieldDecorator('endTime',{
                    rules: [
                      {
                      required: true,
                      message: "请选择结束时间"
                      }
                    ],
                    initialValue: detail.shopAdApplyVo.endTime
                }
                )(
                // 结束时间要大于起始时间
                <DatePicker showTime format="YYYY-MM-DD" disabled={!this.state.formValible} disabledDate={function (current) {
                    return current && current.valueOf() < detail.shopAdApplyVo.beginTime.valueOf();
                }}  />
                )}
            </FormItem>
            <FormItem {...formItemLayout} label='广告位'>
              {getFieldDecorator("adId", {
                rules: [
                  {
                    required: true,
                    message: "请选择广告位"
                  }
                ],
                initialValue: detail.shopAdApplyVo.adId
              })(
                <Button type="default" size="default" onClick={this.showAdTime.bind()} disabled={!this.state.formValible}>选择</Button>
              )}
              {
                <span style={{color: '#108ee9',marginLeft:'10px'}}>已选择: {this.state.adSelectedRows[0].name}</span>
              }
            </FormItem>
            {this.state.adSelectedRowKeys != '' && <FormItem {...formItemLayout} label='当前广告位已占用时间' >
              {effectiveTime.map((item) => {
                let beginTime =  moment(Utils.formatDate(item.beginTime, 'yyyy-mm-dd'), 'YYYY-MM-DD')._i
                let endTime =  moment(Utils.formatDate(item.endTime, 'yyyy-mm-dd'), 'YYYY-MM-DD')._i
                return (
                <div>{beginTime} ~ {endTime}</div>
                );
              })}
            </FormItem>}
            <FormItem {...formItemLayout} label="广告图片跳转的对象">
              <div>
              {getFieldDecorator("jump", {
                rules: [
                {
                    required: true,
                    message: "请选择跳转的对象"
                }
                ],
                initialValue: detail.shopAdApplyVo.jump
              })(
              <Radio.Group disabled={!this.state.formValible} onChange={this.changeJump.bind()}>
                <Radio value={0}>店铺</Radio>
                <Radio value={1}>商品</Radio>
              </Radio.Group>
              )}
              </div>
            </FormItem>
            { this.state.jump == 1 && <FormItem {...formItemLayout} label="跳转的商品">
              {getFieldDecorator("objId", {
                rules: [
                  {
                    required: true,
                    message: "请选择商品"
                  }
                ],
                initialValue: detail.shopAdApplyVo.adId
              })(
                <Button type="default" size="default" onClick={this.showAdTime.bind()} disabled={!this.state.formValible}>选择</Button>
              )}
              {
                <span style={{color: '#108ee9',marginLeft:'10px'}}>已选择: {detail.shopAdApplyVo.adId}</span>
              }
            </FormItem>}
            <Form
                onSubmit={this.handleSubmitHeadPortrait}
                hideRequiredMark
                style={{ marginTop: 8 }}
              >
                <FormItem {...formItemLayout} label="广告位预设图片" hasFeedback>
                  {getFieldDecorator("pic", {
                    rules: [
                      {
                        required: true,
                        message: '请上传广告位预设图片',
                      }
                    ],
                    // getValueFromEvent: this.normFile.bind(this),
                    initialValue: detail.shopAdApplyVo.pic
                  })(
                    <Upload {...props}  disabled={!this.state.formValible}>
                      {detail.shopAdApplyVo.pic ? (
                        <img
                          src={detail.shopAdApplyVo.pic}
                          alt=""
                          className="avatar "
                        />
                      ) : (
                        <Icon type="plus" className="avatar-uploader-trigger" />
                      )}
                    </Upload>
                  )}
                </FormItem>
            </Form>
            <FormItem {...formItemLayout} label="申请备注">
                {getFieldDecorator("remark", {
                rules: [
                    {
                    required: false,
                    message: "请输入申请备注"
                    }
                ],
                initialValue: detail.shopAdApplyVo.remark
                })(
                <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="请输入申请备注"
                    rows={4}
                    disabled={!this.state.formValible}
                />
                )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}  disabled={!this.state.formValible}>
                {submitting ? "正在提交..." : "提交"}
                </Button>
            </FormItem>
            </Form>
        </div>
        {/* <Modal 
          title="选择广告位" 
          visible={this.state.shouAdTimeVisible}
          key={this.state.shouAdTimeVisibleKey}
          onCancel={this.handleCancel.bind()} 
          onOk={this.handleCancel.bind()}
          width={1000}
        >
        
        </Modal> */}
        <Modal title="选择广告位" visible={this.state.shouAdTimeVisible}  key={this.state.shouAdTimeVisibleKey}
             onOk={this.handleOk.bind()} onCancel={this.handleCancel.bind()}
             width={1000}
      >
        <Table rowSelection={rowSelection}
               columns={adColumns}
               dataSource={adListData.rows}
               rowKey='id'
               pagination={false}
        />
        <Pagination
          total={this.state.adListData.totalCount}
          pageSize={this.state.adList.limit}
          defaultCurrent={1}
          onChange={this.adListTableChange}
          style={{
            textAlign: 'right',
            marginTop: '16px'
          }}
        />
      </Modal>
      </div>
    );
  }
}
const ShopsAdDetail = Form.create()(Detail);
export default ShopsAdDetail;
