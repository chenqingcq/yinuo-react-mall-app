import { Link } from "react-router-dom";
import { Form, Breadcrumb, Upload, Icon, Modal, Alert, Button, Popconfirm, InputNumber } from "antd";

const FormItem = Form.Item;
const confirm = Modal.confirm;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";

import styles from "../index.less";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList: [],
      formValible: true,
      list: [],
      detail: {},
      config: {
        pageNum: 1,
        pageSize: 10
      },
      currentIndex: -1, // 当前鼠标移动到轮播图的索引值
      sortBoxVisible: false, // 更改排序 弹出框
      sortBoxVisibleKey: 0, // 更改排序 弹出框 key
      selectedInfo:{  // 选中信息
        id:'',
        sort:''
      }
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = params => {
    let _this = this;
    params = { ...this.state.config, ...params };
    Actions.getShopPhotoList(params).then(response => {
      this.setState({
        list: response.data.rows
      });
    });
  };

  // 取消预览图片
  handleCancel = () => this.setState({ previewVisible: false })

  // 打开预览图片
  handlePreview = pic => {
    this.setState({
      previewImage: pic,
      previewVisible: true
    });
  };

  // 上传图片之前
  beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Utils.dialog.error("图片大小不能超过2MB!");
    }
    return isLt2M;
  }

  // 图片改变
  shandleChange = ({ file, fileList }) => {
    if (file.response && file.response.code === 0) {
      let params = {
        pic: file.response.data
      };
      this.createShopPhoto(params);
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

  // 上传轮播图
  createShopPhoto = params => {
    Actions.createShopPhoto(params).then(response => {
      if (response.code === 0) {
        Utils.dialog.success("添加成功");
        let list = this.state.list;
        list.push(response.data);
        this.setState({
          list
        });
      }
    });
  };

  // 删除轮播图
  deleteShopPhoto = id => {
    let _this = this;
    confirm({
      title: '您确定要删除该轮播图吗?',
      content: '',
      onOk() {
        Actions.deleteShopPhoto({id:id}).then(response => {
          if (response.code === 0) {
            Utils.dialog.success('删除成功')
            let list = _this.state.list.filter(item => item.id !== id);
            _this.setState({
              list:list
            })
          }
        });
      },
      onCancel() {

      },
    });
  };

  // 鼠标进入单个轮播图
  handleMouseEnter = (item, index) => {
    this.setState({
      currentIndex: index
    });
  };

  // 鼠标离开单个轮播图
  handleMouseLeave = (item, index) => {
    this.setState({
      currentIndex: -1
    });
  };


  // 点击轮播图更改排序按钮
  handleEditSort = (id, record) => {
    let selectedInfo = this.state.selectedInfo;
    selectedInfo.id = id;
    selectedInfo.sort = record.sort;
    this.setState({
      sortBoxVisibleKey:this.state.sortBoxVisibleKey + 1,
      sortBoxVisible : true,
      selectedInfo:selectedInfo
    })
  }

  // 更改排序
  handleEditSortSubmit = () => {
    let _this = this,
      selectedInfo = this.state.selectedInfo;
    this.props.form.validateFields((err, values) => {
      if (!err || (err && !err.sort)) {
        Actions.updateShopPhotoSort({
          id:selectedInfo.id,
          sort:values.sort,
        }).then(result => {
          if (result.code == 0) {
            _this.setState({sortBoxVisible: false,sortBoxVisibleKey:this.state.sortBoxVisibleKey + 1,})
            Utils.dialog.success('更改成功')
            let list =_this.state.list.map(record => {
              if(record.id == selectedInfo.id) {
                record.sort =  values.sort
              }
              return record
            })
            _this.setState({list})
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      previewVisible,
      previewImage,
      fileList,
      detail,
      currentIndex,
      selectedInfo
    } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const props = {
      className: "",
      action: Actions.uploadFile,
      showUploadList: false,
      withCredentials: true,
      beforeUpload: this.beforeUpload.bind(this),
      onChange: this.shandleChange.bind(this),
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

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>店铺相片设置</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div className={`${styles.title}`}>线下店铺相片</div>
          <div style={{ marginTop: 15 }}>
            <Alert
              message={`已上传${this.state.list.length}张,最多上传5张`}
              type="info"
              showIcon
            />
          </div>
          <div style={{ marginTop: 15 }}>
            <Upload {...props}>
              <Button disabled={this.state.list.length >= 5}>添加店铺相片</Button>
            </Upload>
          </div>
          <div className={`${styles.bannerList} flex`}>
            {this.state.list.length === 0 ? (
              <span>暂无相片</span>
            ) : (
              this.state.list.map((item, index, res) => {
                return (
                  <div
                    key = {item.id}
                    className={`${styles.pic}`}
                    onMouseEnter={this.handleMouseEnter.bind(this, item, index)}
                    onMouseLeave={this.handleMouseLeave.bind(this, item, index)}
                  >
                    <img src={item.pic} />
                    {currentIndex === index && (
                      <div
                        className={`${
                          styles.icon
                        } flex flex-middle flex-center`}
                      >
                        <Icon
                          type="edit"
                          style={{ color: "#fff", margin: "0 5px" }}
                          onClick={this.handleEditSort.bind(this,item.id,item)}
                        />
                        <Icon
                          type="eye"
                          style={{ color: "#fff", margin: "0 5px" }}
                          onClick={this.handlePreview.bind(this,item.pic)}
                        />
                        <Icon
                          type="delete"
                          style={{ color: "#fff", margin: "0 5px" }}
                          onClick={this.deleteShopPhoto.bind(this,item.id)}
                        />
                      </div>
                    )}
                    {currentIndex === index && (
                      <div
                        className={`${
                          styles.mask
                        } flex flex-middle flex-center`}
                      />
                    )}
                  </div>
                );
              })
            )}
            {/* <Form>
              <FormItem hasFeedback>
                {getFieldDecorator("summaryImgs", {
                  rules: [
                    {
                      required: true,
                      message: "请上传轮播详情图"
                    }
                  ],
                  initialValue: detail.summaryImgs
                })(
                  <div className="clearfix">
                    <Upload {...multiProps}>
                      {fileList.length >= 5 ? null : uploadButton}
                    </Upload>
                  </div>
                )}
              </FormItem>
              <FormItem style={{ marginTop: 10 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </FormItem>
            </Form> */}
          </div>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
          <Modal title="更改排序"
                 key = {this.state.sortBoxVisibleKey}
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
const ShopBannerDetailForm = Form.create()(Detail);
export default ShopBannerDetailForm;
