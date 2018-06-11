import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Breadcrumb,
  Button,
  Cascader,
  Tooltip,
  Icon,
  InputNumber,
  Radio,
  Select,
  Checkbox,
  Upload,
  Modal,
  Tag
} from "antd";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";

import style from "../style.less";

import axios from "axios";
import ReactQuill, { Quill, Mixin, Toolbar } from "react-quill";
var Delta = require("quill-delta/lib/delta");
import "react-quill/dist/quill.snow.css";

var shopGoodsEntityList = [];

const modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      // [{ 'direction': 'rtl' }],                         // text direction
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"]
    ],
    handlers: {
      image: function() {
        let fileInput = this.container.querySelector(
          "input.ql-image[type=file]"
        );
        if (fileInput == null) {
          fileInput = document.createElement("input");
          fileInput.setAttribute("type", "file");
          fileInput.setAttribute(
            "accept",
            "image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
          );
          fileInput.classList.add("ql-image");
          fileInput.addEventListener("change", () => {
            if (fileInput.files != null && fileInput.files[0] != null) {
              var formData = new FormData();
              formData.append("upfile", fileInput.files[0]);
              formData.append("withStatus", true);
              axios
                .post(Actions.uploadFile, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  },
                  responseType: "json"
                })
                .then(res => {
                  if (res.data.code == 0) {
                    let range = this.quill.getSelection(true);
                    this.quill.updateContents(
                      new Delta()
                        .retain(range.index)
                        .delete(range.length)
                        .insert({ image: res.data.data }),
                      Quill.sources.USER
                    );
                  } else {
                    console.error(res.errorMsg);
                  }
                })
                .catch(e => {
                  console.error(e);
                });
            }
          });
          this.container.appendChild(fileInput);
        }
        fileInput.click();
      }
    }
  }
};

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_not_add:false,
      previewVisible: false,
      previewImage: "",
      fileList: [],
      formValible: true,
      list: [],
      detail: {
        attrList: [], // 商品属性
        spuExtend:{},
        skuList:[
          {
            skuStockVo:{}
          }
        ]
      }, // 商品详情
      submitting: false, // 保存按钮
      introduction: "", // 商品详情
      goodsSpecs: {}, // 商品规格自定义表单验证
      price: {}, // 商品价格自定义表单验证
      selectedSpeList: new Map(), // 选中规格值
      specificationList: [],
      selectedSpeNamePrice: [],
      goodsType:1, // 商品类型 1：实物商品；2：虚拟商品；3：生成诺豆的商品
      goodsClassses: [], // 平台商品分类
      shopClassList:[], // 店铺商品分类
      selectedGoodsClassesId: "", // 选择商品分类的三级id
      selectedShopGoodsClassesId:"", // 选择店铺商品分类的二级id
      selectedGoodsClassesInputVal: "", // 选择商品分类的输入框的值
      brandList: [], // 品牌列表
      goodSpecList: [], // 商品规格列表
      goodAttrList: [], // 商品属性列表
      skuCoverPic: {}, // 商品规格中的图片
      shopShipTplList: [], // 店铺运费模板
      shopDeliveryAddressList:[], // 店铺发货地址
      carouselPics:[], // 商品轮播图
      deliveryTimeList:[], // 发货时间
      // TODO 商品规格改版
      specBox:[],
    };
  }

  componentDidMount() {
    let _this = this,
      { match } = this.props,
      id = match.params.id;  
    if (id !== undefined) {
      this.setState({
        is_not_add: true
      })
      this.getGoodsDetail(id);
      this.getShopClassList();
      this.getShopShipTplList();
      this.getShopDeliveryAddress();
      this.getListDeliveryTime();
    }
  }

  // 获取商品详情
  getGoodsDetail = (id) => {
    let _this = this;
    Actions.getGoodsDetail({
      id: id
    }).then(response => {
      if (response.code === 0) {
        let selectedSpeList = new Map();
        let specMap = response.data.allSpecList;
        if(specMap[0].id !== 0){
          specMap.map((record, index) => {
            selectedSpeList.set(`${record.name}`, {
              inputVisible: false, // 是否显示添加输入框的标志
              speValues: new Set(record.value),
              index: 0
            })
          });
        }
        let fileList = [], carouselPics;
        if(Utils.isArray(response.data.carouselPics)){
          carouselPics = response.data.carouselPics
        }else{
          carouselPics = JSON.parse(response.data.carouselPics);
        }
        carouselPics.forEach(function (val, index) {
          fileList.push({
            uid: index,
            name: '',
            status: 'done',
            url: val
          })
        });
        if(response.data.price.length !== 0){
          response.data.price.map((el,index) => {
            response.data.price[index] = Utils.moneyMinuteToYuan(el)
          })
        }
        if(response.data.marketPrice.length !== 0){
          response.data.marketPrice.map((el,index) => {
            response.data.marketPrice[index] = Utils.moneyMinuteToYuan(el)
          })
        }
        _this.setState({
          detail: response.data,
          selectedSpeList,
          selectedSpeNamePrice: response.data.skuList,
          fileList,
          goodsType:response.data.goodsType,
          selectedGoodsClassesId:response.data.classId,
          selectedShopGoodsClassesId:response.data.shopClassId !== null ? response.data.shopClassId : ''
        });
        this.getBrandList(response.data.classId);
        this.getGoodSpecList(response.data.classId);
        this.getGoodAttrList(response.data.classId);
      }
    });
  }

  // 选择商品类型
  onGoodsType = (val) => {
    this.setState({
      goodsType:val
    })
  }

  // 获取平台商品分类
  getGoodsClasses = () => {
    let _this = this;
    Actions.getGoodsClasses().then(response => {
      if (response.code === 0) {
        this.setState({
          goodsClassses: Utils.transformCascaderData(response.data, { id: 0 })
        });
      }
    });
  };

  // 获取店铺商品分类shopClassList
  getShopClassList = () => {
    let _this = this;
    Actions.getListShopGoodsClass().then(response => {
      if (response.code === 0) {
        this.setState({
          shopClassList: Utils.transformCascaderData(response.data, { id: 0 })
        });
      }
    });
  };

  // 选择商品分类
  onChangeGoodsClasses = (value, selectedOptions) => {
    let id = value[value.length - 1];
    this.setState({
      selectedGoodsClassesId: id,
      selectedGoodsClassesInputVal: selectedOptions.map(o => o.label).join("/")
    });
    this.setState({
      brandList: [],
      goodSpecList: [],
      goodAttrList: [],
    });
    this.getBrandList(id);
    this.getGoodSpecList(id);
    this.getGoodAttrList(id);
  };

  // 选择店铺商品分类
  onChangeShopGoodsClass = (value, selectedOptions) => {
    let id = value[value.length - 1];
    this.setState({
      selectedShopGoodsClassesId: id,
    });
  };

  // 获取品牌列表
  getBrandList = id => {
    let _this = this;
    Actions.getBrandList({
      goodsClassId: id
    }).then(response => {
      if (response.code === 0) {
        _this.setState({
          brandList: response.data
        });
      }
    });
  };

  // 获取商品规格
  getGoodSpecList = id => {
    let _this = this;
    Actions.getGoodSpec({
      goodsClassId: id
    }).then(response => {
      if (response.code === 0) {
        let specificationList = [];
        response.data.map(item => {
          if(item.setGoodsSpecItemVo !== null){
            specificationList.push(item.setGoodsSpecItemVo);
          }
        });
        _this.setState({
          specificationList
        });
      }
    });
  };

  // 获取商品属性
  getGoodAttrList = id => {
    let _this = this;
    Actions.getGoodAttr({
      goodsClassId: id
    }).then(response => {
      if (response.code === 0) {
        _this.setState({
          goodAttrList: response.data
        });
      }
    });
  };

  // 获取运费模板列表
  getShopShipTplList = () => {
    let _this = this;
    Actions.getShopShipTplList({
      pageNum:1,
      pageSize:10000
    }).then(response => {
      if (response.code === 0) {
        _this.setState({
          shopShipTplList: response.data.rows
        });
      }
    });
  }

  // 获取店铺发货地址列表 
  getShopDeliveryAddress = () => {
    let _this = this;
    Actions.getShopDeliveryAddress({
      pageNum:1,
      pageSize:10000
    }).then(response => {
      if (response.code === 0) {
        _this.setState({
          shopDeliveryAddressList: response.data.rows
        });
      }
    });
  }

  // 获取发货时间
  getListDeliveryTime = () => {
    let _this = this;
    Actions.getListDeliveryTime().then(response => {
      if (response.code === 0) {
        _this.setState({
          deliveryTimeList: response.data
        });
      }
    });
  }

  // 预览图片取消
  handleCancel = v => {
    this.setState({ previewVisible: false });
  };

  // 预览图片
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  // 商品主图上传
  beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过2MB!");
    }
    return isLt2M;
  }

  shandleChange = ({ file, fileList }) => {
    if (file.response && file.response.code === 0) {
      let detail = this.state.detail;
      detail.coverPic = file.response.data;
      this.setState({ detail });
    } else if (file.response && file.response.code !== 0) {
      Utils.dialog.error(file.response.msg);
    }
  };

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

  // 轮播图上传
  handleChange = ({ fileList }) => {
    let files = [];
    fileList = fileList.filter(file => {
      if (file.response) {
        if (file.response.code === 0) {
          files.push(file.response.data);
          file.url = file.response.data;
          return true;
        }
      } else if (file.url) {
        files.push(file.url);
      }
      return true;
    });
    this.setState({ fileList });
    this.props.form.setFieldsValue({
      carouselPics: files.length == 0 ? "" : JSON.stringify(files)
    });
  };

  // 富文本 规格详情
  handleEditorChange = value => {
    let { detail } = this.state;
    detail.spuExtend.introduction = value
    this.setState({
      detail
    });
  };

  // 选择商品规格
  handleSpeSelect = (value,option) => {
    let selectedSpeList = this.state.selectedSpeList;
    if (selectedSpeList.has(value)) {
      return;
    } else {
      selectedSpeList.set(`${value}`, {
        inputVisible: false, // 是否显示添加输入框的标志
        speValues: new Set(),
        index: 0,
        specId:option.props.specId
      });
      this.setState({ selectedSpeList });
    }
    this.checkShopGoodsEntityList();
  };

  // 点击添加规格值
  showInput = speName => {
    let selectedSpeList = this.state.selectedSpeList;
    selectedSpeList.get(speName).inputVisible = true;
    this.setState({ selectedSpeList, inputValue: "" });
  };

  // 规格值输入框实时监听
  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  // 删除规格行
  handleDeleteSpe = speName => {
    let selectedSpeList = this.state.selectedSpeList;
    selectedSpeList.delete(speName);
    this.setState({ selectedSpeList, selectedSpeNamePrice: [] });
    this.checkShopGoodsEntityList();
  };

  // 删除某个规格的规格值
  handleRemoveSpeValue = (speName, speValue) => {
    let selectedSpeList = this.state.selectedSpeList;
    let speValues = selectedSpeList.get(speName).speValues;
    speValues.delete(speValue);
    this.setState({ selectedSpeList, selectedSpeNamePrice: [] });
    this.checkShopGoodsEntityList();
  };

  // 规格值输入框获取焦点
  handleInputConfirm = speName => {
    const state = this.state;
    const inputValue = state.inputValue;
    let selectedSpeList = state.selectedSpeList,
      speValues = selectedSpeList.get(speName).speValues;
    selectedSpeList.get(speName).inputVisible = false;
    if (inputValue && !speValues.has(inputValue)) {
      speValues.add(inputValue);
    }
    this.setState({
      selectedSpeList,
      inputValue: "",
      selectedSpeNamePrice: []
    });
    this.checkShopGoodsEntityList();
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
    const { skuCoverPic } = this.state;
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
      disabled: !this.state.formValible
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
      <FormItem {...formItemLayout} label="规格明细">
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-bordered ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table>
                  <thead className="ant-table-thead">
                    <tr>
                      {[...selectedSpeList].map(value => {
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
                      <th>
                        <span>商品图片</span>
                      </th>
                      <th>
                        <span>商品名称</span>
                      </th>
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
                          {selectedSpeList.map((value, c_index) => {
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
                          <td>
                            <FormItem>
                              {getFieldDecorator(`coverPic_${r_index}`, {
                                rules: [
                                  {
                                    required: false,
                                    message: "请填写商品图片!"
                                  }
                                ],
                                initialValue:
                                  selectedSpeNamePriceLength &&
                                  selectedSpeNamePriceLength > r_index
                                    ? this.state.selectedSpeNamePrice[r_index]
                                        .coverPic
                                    : ""
                              })(
                                <img src={selectedSpeNamePriceLength &&
                                  selectedSpeNamePriceLength > r_index
                                    ? this.state.selectedSpeNamePrice[r_index]
                                        .coverPic
                                    : ""} alt="" style={{width:80,height:80}} />
                              )}
                            </FormItem>
                          </td>
                          <td>
                            <FormItem>
                              {getFieldDecorator(`name_${r_index}`, {
                                rules: [
                                  {
                                    required: true,
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
                                  disabled={true}
                                />
                              )}
                            </FormItem>
                          </td>
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
                                    ? Utils.moneyMinuteToYuan(this.state.selectedSpeNamePrice[r_index]
                                        .price)
                                    : ""
                              })(
                                <InputNumber
                                  size="large"
                                  min={0}
                                  disabled={true}
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
                                    ? Utils.moneyMinuteToYuan(this.state.selectedSpeNamePrice[r_index]
                                        .marketPrice)
                                    : ""
                              })(
                                <InputNumber
                                  min={0}
                                  size="large"
                                  disabled={true}
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
                                  disabled={true}
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

  // 商品规格自定义表单验证
  checkShopGoodsEntityList = () => {
    let flag = false,
      { goodsSpecs, price, selectedSpeList } = this.state;
    if (selectedSpeList.size) {
      price = {
        validateStatus: "success",
        errorMsg: null
      };
    }
    for (let value of selectedSpeList.values()) {
      if (value.speValues.size == 0) {
        flag = true;
        break;
      }
    }
    if (flag) {
      goodsSpecs = {
        validateStatus: "error",
        errorMsg: "请先为对应的规格添加规格值"
      };
    } else {
      goodsSpecs = {
        validateStatus: "success",
        errorMsg: null
      };
    }
    this.setState({ goodsSpecs, price });
    return flag;
  };

  // 提交保存商品
  handleSubmit = e => {
    e.preventDefault();
    let _this = this,
      { match } = this.props,
      id = match.params.id; 
    let { selectedSpeList,goodsType } = this.state,
      shopGoodsSpecList = [];
    let introduction =
      this.refs.editor.state.value == "<p><br></p>"
        ? ""
        : this.refs.editor.state.value;
    this.props.form.setFieldsValue({ introduction });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (this.checkShopGoodsEntityList()) {
        return;
      }
      if (!err) {
        let goodsParam = {},
          attrJson = [];
        for (let [key, value] of Object.entries(values)) {
          if (key.indexOf("_") > -1) {
            let data = key.split("_"),
              index = data[1],
              prop = data[0];
            shopGoodsEntityList[index].specList =
              shopGoodsEntityList[index].specList;
            shopGoodsEntityList[index][prop] = value;
          }
          if (key.indexOf("attr-") > -1) {
            if(value !== undefined){
              let data = key.split("-"),
                id = data[1];
              attrJson.push({
                attrId: id,
                attrValue: value
              });
            }
          }
        }
        goodsParam.goodsType = this.state.goodsType;
        goodsParam.classId = this.state.selectedGoodsClassesId;
        if(this.state.selectedShopGoodsClassesId != ''){
          goodsParam.shopClassId = this.state.selectedShopGoodsClassesId;
        }
        goodsParam.brandId = values.brandId;
        goodsParam.name = values.name;
        // 商品物料单号
        if (values.materialCode !== undefined && values !== null) {
          goodsParam.materialCode = values.materialCode;
        }
        // 判断商品类型 为1和2 传让利比
        if(goodsType === 1 || goodsType === 2){
          goodsParam.profitRatio = values.profitRatio;
        }
        // 判断商品类型 为3 赠送比例
        if(goodsType === 3){
          goodsParam.nuodouDonateRatio = values.nuodouDonateRatio;
        }
        goodsParam.coverPic = values.coverPic;
        goodsParam.carouselPics = JSON.parse(values.carouselPics).join(",");
        goodsParam.attrJson = JSON.stringify(attrJson);
        // 判断是否有选择规格
        if(selectedSpeList.size != 0){
          goodsParam.skuJson = JSON.stringify(shopGoodsEntityList);
        }
        goodsParam.skuJson = JSON.stringify(shopGoodsEntityList);
        // 判断价格是否为空,来判断是否有选择规格
        if(values.price !== undefined){
          goodsParam.price = values.price;
        }
        // 判断市场价格是否为空,来判断是否有选择规格
        if(values.marketPrice !== undefined){
          goodsParam.marketPrice = values.marketPrice;
        }
        // 判断库存是否为空,来判断是否有选择规格
        if(values.stock !== undefined){
          goodsParam.stock = values.stock;
        }
        goodsParam.introduction = values.introduction;
        // 判断商品类型 为1 传运费模板和发货地址
        if(goodsType === 1){
          goodsParam.shopShipTplId = values.shopShipTplId;
          goodsParam.shopDeliveryAddressId = values.shopDeliveryAddressId;
        }
        // 判断商品类型 不为3 传发货时间
        if(goodsType !== 3){
          goodsParam.deliveryTime = values.deliveryTime;
        }
        goodsParam.onShelfType = values.onShelfType;
        this.setState({ submitting: true });
        if(id === undefined){
          Actions.goodsPublish(goodsParam).then(response => {
            if (response.code == 0) {
              Utils.dialog.success("添加成功", () => {
                this.props.history.push("/goods/onOffer/index");
              });
            } else {
              this.setState({ submitting: false });
            }
          });
        }else{
          goodsParam.id = id;
          Actions.updateGoodsDetail(goodsParam).then(response => {
            if (response.code == 0) {
              Utils.dialog.success("更新成功", () => {
                this.props.history.push("/goods/onOffer/index");
              });
            } else {
              this.setState({ submitting: false });
            }
          });
        }
      }
    });
  };

  // TODO 商品规格改版(还没完成)
  addSpec = () => {
    let specBox = this.state.specBox;
    specBox.push({
      specName:'',
      specList: new Map()
    })
    this.setState({
      specBox
    })
  }

  // 选择商品规格
  handleSpecItem = (index,value) => {
    let { specBox, specificationList } = this.state;
    let isValid = true;
    specBox.forEach(el => {
      if(el.specList.has(value)){
        isValid = false;
      }
    })
    if(!isValid){
      return;
    }
    let speValuesList;
    specificationList.forEach(el => {
      if(el.name === value){
        speValuesList = el.valueList
      }
    })
    specBox[index].specName = value;
    specBox[index].specList.set(`${value}`,{
      inputVisible: false, // 是否显示添加输入框的标志
      speValues: new Set(),
      speValuesList:speValuesList,
      index: 0
    })
    this.setState({
      specBox:specBox
    })
    // console.log(specBox)
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const { submitting } = this.props;

    const {
      detail,
      previewVisible,
      previewImage,
      introduction,
      goodsSpecs,
      selectedSpeList,
      specificationList,
      goodsClassses,
      shopClassList,
      selectedGoodsClassesInputVal,
      brandList,
      goodSpecList,
      goodAttrList,
      shopShipTplList,
      shopDeliveryAddressList,
      is_not_add
    } = this.state;

    const addShipTplUrl = `${location.href.split("#")[0]}#/shops/shipTpl/index/add`
    const addressUrl = `${location.href.split("#")[0]}#/shops/address/index/add`

    const width = 350;

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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 4 }
      }
    };

    const props = {
      className: "avatar-uploader",
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
      onProgress: null,
      disabled: true
    };

    const multiProps = {
      action: Actions.uploadFile,
      withCredentials: true,
      name: "upfile",
      accept: "image/*",
      data: {
        withStatus: true
      },
      headers: {
        "X-Requested-With": null
      },
      onProgress: null,
      beforeUpload: this.beforeUpload.bind(this),
      onChange: this.handleChange.bind(this),
      listType: "picture-card",
      fileList: this.state.fileList,
      onPreview: this.handlePreview,
      disabled: true
    };

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>添加商品</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <div className={`${style.goodsDetail}`}>
              <div className={`${style.block}`}>
                <div className={`${style.title}`}>商品类型</div>
                {
                  !is_not_add && <div className={`${style.goodsType} flex`}>
                      <div className={`${style.godsTypeItem} ${this.state.goodsType === 1 ? `${style.onGoodsType}` : ``}`} onClick={this.onGoodsType.bind(this,1)}>
                        <div classNmae={`${style.name}`}>实物商品</div>
                        <div>(物流发货)</div>
                      </div>
                      <div className={`${style.godsTypeItem} ${this.state.goodsType === 2 ? `${style.onGoodsType}` : ``}`} onClick={this.onGoodsType.bind(this,2)}>
                        <div classNmae={`${style.name}`}>虚拟商品</div>
                        <div>(无需物流)</div>
                      </div>
                      <div className={`${style.godsTypeItem} ${this.state.goodsType === 3 ? `${style.onGoodsType}` : ``}`} onClick={this.onGoodsType.bind(this,3)}>
                        <div classNmae={`${style.name}`}>虚拟商品到诺豆</div>
                        <div>(无需物流)</div>
                      </div> 
                  </div>
                }
                {
                  is_not_add && <div className={`${style.goodsType} flex`}>
                      {
                        this.state.goodsType === 1 && <div className={`${style.godsTypeItem} ${this.state.goodsType === 1 ? `${style.onGoodsType}` : ``}`} onClick={this.onGoodsType.bind(this,1)}>
                            <div classNmae={`${style.name}`}>实物商品</div>
                            <div>(物流发货)</div>
                          </div>
                      }
                      {
                        this.state.goodsType === 2 && <div className={`${style.godsTypeItem} ${this.state.goodsType === 2 ? `${style.onGoodsType}` : ``}`} onClick={this.onGoodsType.bind(this,2)}>
                            <div classNmae={`${style.name}`}>虚拟商品</div>
                            <div>(无需物流)</div>
                          </div>
                      }
                      {
                        this.state.goodsType === 3 && <div className={`${style.godsTypeItem} ${this.state.goodsType === 3 ? `${style.onGoodsType}` : ``}`} onClick={this.onGoodsType.bind(this,3)}>
                            <div classNmae={`${style.name}`}>虚拟商品到诺豆</div>
                            <div>(无需物流)</div>
                          </div>
                      }  
                  </div>
                }
              </div>  
              <div className={`${style.block}`}>
                <div className={`${style.title}`}>基本信息</div>
                {
                  is_not_add && <FormItem {...formItemLayout} label="平台商品分类">
                    {getFieldDecorator("class", {
                      rules: [
                        {
                          required: true,
                          message: "请选择分类"
                        }
                      ]
                    })(
                      <span>{detail.className}</span>
                    )}
                  </FormItem>
                }
                <FormItem {...formItemLayout} label="品牌">
                  {getFieldDecorator("brandId", {
                    rules: [
                      {
                        required: true,
                        message: "请选择品牌"
                      }
                    ],
                    initialValue:detail.brandId
                  })(
                    <Select style={{ width: width }} disabled={true}>
                      {brandList.map((item, response, index) => {
                        return (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
                {
                  is_not_add && <FormItem {...formItemLayout} label="店铺商品分类">
                      {getFieldDecorator("shopClassId", {
                        rules: [
                          {
                            required: false,
                            message: "请选择分类"
                          }
                        ],
                      })(
                        <span>{detail.shopClassName === null ? '暂无' : detail.shopClassName}</span>
                      )}
                    </FormItem>
                }
                <FormItem {...formItemLayout} label="商品名称">
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "请填写商品名称"
                      }
                    ],
                    initialValue:detail.name
                  })(
                    <Input
                      placeholder="30个字内,中英文组合"
                      style={{ width: width }}
                      disabled={true}
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="商品货号"
                  extra="如果您不输入商品货号,系统将自动生成一个唯一的货号"
                >
                  {getFieldDecorator("materialCode", {
                    rules: [
                      {
                        required: false,
                        message: "请填写商品货号"
                      }
                    ],
                    initialValue:detail.materialCode
                  })(<Input style={{ width: width }} disabled={true}/>)}
                </FormItem>
                {
                  (this.state.goodsType === 1 || this.state.goodsType === 2) && <FormItem {...formItemLayout} 
                      label="商品让利比"
                      extra="让利比为10%-90%"
                    >
                      {getFieldDecorator("profitRatio", {
                        rules: [
                          {
                            required: true,
                            message: "请输入让利比"
                          }
                        ],
                        initialValue:detail.profitRatio * 100
                      })(<InputNumber placeholder="请输入" disabled={true}/>)}
                      <span>%</span>
                    </FormItem>
                }
                {
                  (this.state.goodsType === 3) && <FormItem {...formItemLayout} 
                      label="赠送比例"
                    >
                      {getFieldDecorator("nuodouDonateRatio", {
                        rules: [
                          {
                            required: true,
                            message: "请输入赠送比例"
                          }
                        ],
                        initialValue:detail.nuodouDonateRatio
                      })(<InputNumber placeholder="请输入" min={0} max={100} disabled={true}/>)}
                      <span>%</span>
                    </FormItem>
                }
                <FormItem
                  {...formItemLayout}
                  label="商品主图"
                  extra="建议尺寸:370*370像素,最多上传1张,展示在商品列表中"
                >
                  {getFieldDecorator("coverPic", {
                    rules: [
                      {
                        required: true,
                        message: "请上传一张商品主图"
                      }
                    ],
                    getValueFromEvent: this.normFile.bind(this),
                    initialValue: detail.coverPic
                  })(
                    <Upload {...props}>
                      {detail.coverPic ? (
                        <img src={detail.coverPic} alt="" className="avatar" />
                      ) : (
                        <Icon type="plus" className="avatar-uploader-trigger" />
                      )}
                    </Upload>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="商品轮播图"
                  extra="建议尺寸:750*752像素,最多可上传5张图片,展示在商品详情页"
                >
                  {getFieldDecorator("carouselPics", {
                    rules: [
                      {
                        required: true,
                        message: "请上传商品轮播图"
                      }
                    ],
                    initialValue: detail.carouselPics
                  })(
                    <div className="clearfix">
                      <Upload {...multiProps} className='carouselPics'>
                        
                      </Upload>
                      <Modal
                        visible={previewVisible}
                        footer={null}
                        onCancel={this.handleCancel}
                      >
                        <img
                          alt="example"
                          style={{ width: "100%" }}
                          src={previewImage}
                        />
                      </Modal>
                    </div>
                  )}
                </FormItem>
              </div>
              <div className={`${style.block}`}>
                <div className={`${style.title}`}>商品属性</div>
                {detail.attrList.map((item, res, index) => {
                  return <FormItem {...formItemLayout} label={item.attrName} key={item.id}>
                    {getFieldDecorator("attr", {
                      rules: [
                        {
                          required: false,
                          message: "请选择"
                        }
                      ]
                    })(
                      <span>{item.attrValue}</span>
                    )}
                  </FormItem>;
                })}
              </div>
              <div className={`${style.block}`}>
                <div className={`${style.title}`}>规格库存</div>
                {selectedSpeList.size != 0 && this.renderTable()}
                {
                  selectedSpeList.size == 0 && (
                    <FormItem {...formItemLayout} label="销售价格">
                      {getFieldDecorator("price", {
                        rules: [
                          {
                            required: true,
                            message: "请输入销售价格"
                          }
                        ]
                      })(
                        <span>¥{
                          Utils.moneyMinuteToYuan(detail.skuList[0].price)
                        }</span>
                      )}
                    </FormItem>
                  )
                }
                {
                  selectedSpeList.size == 0 && (
                    <FormItem {...formItemLayout} label="市场价格">
                      {getFieldDecorator("marketPrice", {
                        rules: [
                          {
                            required: false,
                            message: "请输入市场价格"
                          }
                        ]
                      })(
                        <span>¥{
                          Utils.moneyMinuteToYuan(detail.skuList[0].marketPrice)
                        }</span>
                      )}
                    </FormItem>
                  )
                }
                {
                  selectedSpeList.size == 0 && (
                    <FormItem {...formItemLayout} label="库存">
                      {getFieldDecorator("stock", {
                        rules: [
                          {
                            required: true,
                            message: "请输入库存"
                          }
                        ]
                      })(
                        <span>{detail.skuList[0].skuStockVo.surplusStock}</span>
                      )}
                    </FormItem>
                  )
                }
              </div>
              <div className={`${style.block}`}>
                <div className={`${style.title}`}>商品详情</div>
                <FormItem {...formItemLayout} label="商品详情">
                  {getFieldDecorator("introduction", {
                    rules: [
                      {
                        required: true,
                        message: "请输入商品详情"
                      }
                    ],
                    initialValue:detail.spuExtend.introduction
                  })(
                    <div>
                      <ReactQuill
                        value={detail.spuExtend.introduction}
                        theme="snow"
                        onChange={this.handleEditorChange.bind(this)}
                        modules={modules}
                        ref="editor"
                        readOnly={true}
                      />
                    </div>
                  )}
                </FormItem>
              </div>
              <div className={`${style.block}`}>
                <div className={`${style.title}`}>其他信息</div>
                {
                  this.state.goodsType === 1 && <FormItem
                      {...formItemLayout}
                      label="快递运费"
                      extra="运费模板支持按区域设置运费,按件数,按体积计算运费等"
                    >
                      {getFieldDecorator("shopShipTplId", {
                        rules: [
                          {
                            required: true,
                            message: "请选择"
                          }
                        ],
                        initialValue:detail.shopShipTplId
                      })(
                          <Select style={{ width: 200 }} disabled={true}>
                            {
                              shopShipTplList.map((el,index) => {
                                return <Option value={el.shopShipTplVo.id} key={index}>{el.shopShipTplVo.name}</Option>
                              })
                            }
                          </Select>
                      )}
                    </FormItem>
                }
                {
                  this.state.goodsType === 1 && <FormItem {...formItemLayout} label="商品发货地址">
                      {getFieldDecorator("shopDeliveryAddressId", {
                        rules: [
                          {
                            required: true,
                            message: "请选择"
                          }
                        ],
                        initialValue:detail.shopDeliveryAddressId
                      })(
                        <Select style={{ width: 200 }} disabled={true}>
                          {
                            shopDeliveryAddressList.map((el,index) => {
                              return <Option value={el.id}>{el.alias !== '' ? el.alias : el.name}</Option>
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                }
                {
                  this.state.goodsType !== 3 && <FormItem
                      {...formItemLayout}
                      label="承诺发货时间"
                      extra="如实设定宝贝的发货时间，不仅可避免发货咨询和纠纷，还能促进成交！"
                    >
                      {getFieldDecorator("deliveryTime", {
                        rules: [
                          {
                            required: false,
                            message: "请选择"
                          }
                        ],
                        initialValue: detail.deliveryTime
                      })(
                        <Select style={{ width: 200 }} disabled={true}>
                          {
                            this.state.deliveryTimeList.map((el,index) => {
                              return <Option value={el}>{el}</Option>
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                }
                <FormItem {...formItemLayout} label="上架时间">
                  {getFieldDecorator("onShelfType", {
                    rules: [
                      {
                        required: false,
                        message: "请选择"
                      }
                    ],
                    initialValue:detail.onShelfType ? detail.onShelfType : 0
                  })(
                    <Radio.Group disabled={true}>
                      <Radio value={0}>审核后立即上架</Radio>
                      <Radio value={1}>审核后暂不售卖,放入仓库</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
const GoodsDetailView = Form.create()(Detail);
export default GoodsDetailView;
