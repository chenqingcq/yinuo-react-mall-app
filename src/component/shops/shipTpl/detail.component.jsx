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
  Modal,
  Row,
  Col,
  Tree
} from "antd";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;


import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";

import styles from "./style.less";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      is_not_add: false,
      detail:{
        shopShipEfpTplDetailVos:[],
        shopShipTplDetailVos:[],
        shopShipTplVo:{
          isFree:0,
          model:1,
          isDefault:1
        }
      },
      isDefault:1,
      // 运费模板列表
      templateList:[
        {
          firstFee:'', // 首费
          firstVolume:'', // 首量
          renewalsPrice:'', // 续费
          renewalsVolume:'', // 续量
          areas:[], // 区域
          areaNames:[]
        }
      ],
      // 指定包邮条件模板
      assignFreeList:[],
      assignFree:false, // 指定包邮条件
      areaCodeVisible:false, // 编辑区域对话框
      areaCodeVisibleKey:0, // 编辑区域对话框key
      areaData:[], //区域信息
      checkedKeys:[],
      checkedNodes:[],
      selectedAreaData:[],
      editAreaCodeType:'', // 编辑区域类型 包括模板区域编辑与指定包邮区域编辑
      editAreaCodeInd:'', // 编辑区域索引值
      areaList:[], // 区域列表
    };
  }

  componentDidMount() {
    let _this = this, {match} = this.props, id = match.params.id;
    if (id !== undefined) {
      this.setState({
        is_not_add: true
      })
      // 获取运费模板详情
      _this.getDetail(id)
    }
    this.getProvinceList()
  }

  // 获取详情
  getDetail = (id) => {
    let _this = this;
    Actions.getShopShipTplDetail({
      id: id
    }).then(response => {
      let templateList = [], assignFreeList = [], assignFree = false,
        shopShipTplDetailVos = response.data.shopShipTplDetailVos,
        shopShipEfpTplDetailVos = response.data.shopShipEfpTplDetailVos;
      if(shopShipTplDetailVos.length !== 0){
        shopShipTplDetailVos.forEach(element => {
          templateList.push({
            firstFee:element.firstFee,
            firstVolume:element.firstVolume,
            renewalsPrice:element.renewalsPrice,
            renewalsVolume:element.renewalsVolume,
            areas:JSON.parse(element.areas),
            areaNames:element.areaNames.split(',')
          })
        });
      }
      if(shopShipEfpTplDetailVos.length !== 0){
        shopShipEfpTplDetailVos.forEach(element => {
          assignFreeList.push({
            volume:element.volume,
            price:element.price,
            areas:JSON.parse(element.areas),
            areaNames:element.areaNames.split(',')
          })
        });
        assignFree = true;
      }
      _this.setState({
        detail: response.data,
        templateList,
        assignFreeList,
        assignFree,
        isDefault: 0
      })
    })
  }

  // 选择是否包邮
  onChengeIsFree = (event) => {
    let { detail } = this.state;
    detail.shopShipTplVo.isFree = event.target.value;
    this.setState({
      detail
    })
  }

  // 选择计费方式
  onChangeModel = (event) => {
    let { detail } = this.state;
    detail.shopShipTplVo.model = event.target.value;
    this.setState({
      detail
    })
  }

  // 选择是否启用包邮
  onChangeIsDefault = (event) => {
    let { detail } = this.state;
    detail.shopShipTplVo.isDefault = event.target.checked ? 0 : 1;
    this.setState({
      detail
    })
  }

  // 选择是否启用指定包邮条件
  onChangeAssignFree = (event) => {
    let { assignFree } = this.state;
    assignFree = event.target.checked;
    this.setState({
      assignFree
    })
  }

  // 添加运费模板
  addTemplate = () => {
    let _this = this;
    let { templateList } = _this.state;
    templateList.push({
      firstFee:'', // 首费
      firstVolume:'', // 首量
      renewalsPrice:'', // 续费
      renewalsVolume:'', // 续量
      areas:[], // 区域
      areaNames:[]
    })
    _this.setState({
      templateList
    })
  }

  // 删除运费模板的行
  deleteTemplateRow = (index) => {
    let templateList = this.state.templateList.filter((item,ind) => ind !== index);
    this.setState({
      templateList
    })
  }

  // 添加指定包邮条件
  addAssignFree = () => {
    let _this = this;
    let { assignFreeList } = _this.state;
    assignFreeList.push({
      volume:"",
      price:"",
      areas:[],
      areaNames:[]
    })
    _this.setState({
      assignFreeList
    })
  }

  // 删除指定包邮条件的行
  deleteAddAssignFreeRow = (index) => {
    let assignFreeList = this.state.assignFreeList.filter((item,ind) => ind !== index);
    this.setState({
      assignFreeList
    })
  }

  // 表单提交
  handleSubmit = e => {
    e.preventDefault();
    let _this = this,{match} = this.props, id = match.params.id;
    let { detail, templateList, assignFree, assignFreeList } = _this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        _this.setState({
          submitting: true
        });
        let param = {}, detailJson = [], efpDetailJson = [], isSelectedArea = false;
        // 判断是否为自定义运费
        if(detail.shopShipTplVo.isFree === 1){
          for (let [key, value] of Object.entries(values)) {
            if (key.indexOf("_") > -1) {
              let data = key.split("_"),
                index = data[1],
                prop = data[0];  
              detailJson[index] = detailJson[index] || {};
              if(prop === 'firstFee' || prop === 'renewalsPrice'){
                detailJson[index][prop] = value * 100;
              }else{
                detailJson[index][prop] = value;
              }
            }
          }
          detailJson.map((el,index) => {
            if(templateList[index].areas.length === 0  && index !== 0){
              isSelectedArea = true
            }
            el.areas = templateList[index].areas
          })
          param.detailJson = JSON.stringify(detailJson)
        }
        // 判断是否启用指定包邮条件
        if(assignFree){
          for (let [key, value] of Object.entries(values)) {
            if (key.indexOf("_efp") > -1) {
              let data = key.split("_"),
                index = data[1],
                prop = data[0];  
              efpDetailJson[index] = efpDetailJson[index] || {};
              if(prop === 'price'){
                efpDetailJson[index][prop] = value * 100;
              }else{
                efpDetailJson[index][prop] = value;
              }
            }
          }
          efpDetailJson.map((el,index) => {
            if(assignFreeList[index].areas.length === 0){
              isSelectedArea = true
            }
            el.areas = assignFreeList[index].areas
          })
          param.efpDetailJson = JSON.stringify(efpDetailJson)
        }
        param.name = values.name;
        if(values.remark != undefined){
          param.remark = values.remark;
        }
        param.isFree = values.isFree;
        param.model = values.model;
        param.isDefault = values.isDefault;
        if(isSelectedArea){
          Utils.dialog.error("还有区域未指定")
          return
        }
        if(id === undefined){
          Actions.createShopShipTpl(param).then(response => {
            if (response.code == 0) {
              Utils.dialog.success("提交成功",() => {
                this.props.history.push('/shops/shipTpl/index')
              });
            }else{
              _this.setState({
                submitting: false
              });
            }
          });
        }else{
          param.id = id
          Actions.updateShopShipTpl(param).then(response => {
            if (response.code == 0) {
              Utils.dialog.success("提交成功",() => {
                this.props.history.push('/shops/shipTpl/index')
              });
            }else{
              _this.setState({
                submitting: false
              });
            }
          });
        }
      }
    });
  };

  // 数据转换
  transformTreeData = (flatArrs, parentItem) => {
    var children = flatArrs.filter((item, index) => {
      return item.parentId == parentItem.id;
    }).map(record => {
      record.key = record.areaCode
      record.label = record.name
      record.value = record.id
      record.isLeaf = record.level >= 2 ? true : false
      return record
    });
    if(children.length !== 0){
      parentItem.children = children;
    }
    for (var i in children) {
      this.transformTreeData(flatArrs, children[i]);
    }
    return parentItem.children
  }

  // 获取所有省份
  getProvinceList = () => {
    Actions.getListProvincesAndCities().then(response => {
      if (response.code == 0) {
        let data = [];
        response.data.forEach((el) => {
          if(el.parentId === 1000002){
            el.parentId = 1000001
          }
          if(el.parentId === 1007363){
            el.parentId = 1007362
          }
          if(el.parentId === 1161793){
            el.parentId = 1161792
          }
          if(el.parentId === 1533329){
            el.parentId = 1533328
          }
          if(el.parentId === 1540700){
            el.parentId = 1533328
          }
          data.push(el)
        })
        this.setState({
          areaData:this.transformTreeData(data,{id:1000000}),
          areaList:response.data
        })
      }
    })
  }

  // 获取选中区域的名称
  getSelectedAreaName = () => {
    let { checkedKeys, areaList } = this.state, areaNames = [];
    checkedKeys.forEach((item) => {
      for(let i = 0; i < areaList.length; i++){
        if(Number(item) === areaList[i].areaCode){
          areaNames.push(areaList[i].name)
          break
        }
      }
    })
    return areaNames;
  }

  // getNewTreeData
  getNewTreeData = (treeData, curKey, child, level) => {
    const loop = (data) => {
      if (level < 1 || curKey.length - 3 > level * 2) return;
      data.forEach((item) => {
        if(item.children){
          item.children.forEach((el) => {
            if (Number(curKey) === el.id) {
              if (item.children) {
                loop(item.children);
              } else {
                el.children = child;
              }
            }
          })  
        }else{
          if (Number(curKey) === item.id) {
            if (item.children) {
              loop(item.children);
            } else {
              item.children = child;
            }
          }
        }          
      });
    };
    loop(treeData);
    this.setState({ areaData:treeData });
  }

  // 获取省份下数据
  onLoadAreaData = (treeNode) => {
    Actions.getListParentId({
      parentId: Math.floor(treeNode.props.id)
    }).then(response => {
      if (response.code == 0) {
        const areaData = [...this.state.areaData];
        let data = response.data.map((record) => {
          record.label = record.name
          record.value = record.id
          record.key = record.areaCode
          record.isLeaf = record.level >= 3 ? true : false
          return record
        })
        this.getNewTreeData(areaData, treeNode.props.id, data, 2);
      }
    })
  }

  onAddSelectedAreaData = () => {
    let { checkedKeys, checkedNodes } = this.state;
    let areaNames = this.getSelectedAreaName();
    this.setState({
      selectedAreaData:areaNames
    })
  }

  onCheck = (checkedKeys,event) => {
    console.log(event)
    this.setState({
      checkedKeys,
      checkedNodes:event.checkedNodes
    });
  }

  onSelect = (selectedKeys, info) => {
    console.log('selectedKeys', selectedKeys);
  }

  onEditAreaCode = (type,index) => {
    let { templateList, assignFreeList } = this.state;
    let checkedKeys = [];
    let areaNames = [];
    if(type === 'template'){
      checkedKeys = templateList[index].areas
      areaNames = templateList[index].areaNames
    }else if(type === 'assignFree'){
      checkedKeys = assignFreeList[index].areas
      areaNames = assignFreeList[index].areaNames
    }
    this.setState({
      editAreaCodeType:type,
      editAreaCodeInd:index,
      checkedKeys,
      selectedAreaData:areaNames,
      areaCodeVisible:true,
      areaCodeVisibleKey:this.state.areaCodeVisibleKey + 1,
    })
  }

  handleOkAreaCode = () =>{
    let {editAreaCodeType,editAreaCodeInd,templateList,assignFreeList,checkedKeys,selectedAreaData} = this.state;
    let areaNames = selectedAreaData;
    if(editAreaCodeType === 'template'){
      templateList[editAreaCodeInd].areas = checkedKeys;
      templateList[editAreaCodeInd].areaNames = areaNames;
      this.setState({
        templateList
      })
    }else if(editAreaCodeType === 'assignFree'){
      assignFreeList[editAreaCodeInd].areas = checkedKeys;
      assignFreeList[editAreaCodeInd].areaNames = areaNames;
      this.setState({
        assignFreeList
      })
    }
    this.setState({
      checkedKeys:[],
      selectedAreaData:[],
      areaCodeVisible:false,
      areaCodeVisibleKey:this.state.areaCodeVisibleKey + 1,
    })
  }

  handleCancelAreaCode = () => {
    this.setState({
      checkedKeys:[],
      selectedAreaData:[],
      areaCodeVisible:false,
      areaCodeVisibleKey:this.state.areaCodeVisibleKey + 1,
    })
  }

  render() {
    
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const { submitting } = this.props;

    const { detail, templateList, assignFreeList, assignFree, areaData, selectedAreaData } = this.state;

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

    const freightTemplate = () => {
      return <div className={`${styles.shipTplTemplate}`}>
          <div className={`${styles.shipTplItem}`}>
              <dl className={`${styles.shipTplItemDl}`}>
                <dt className={`${styles.shipTplItemDt} flex flex-between flex-middle`}>
                  <ul>
                    <li className={`flex`}>
                      <div className={`${styles.ddItem}`} style={{width:"30%"}}>可配送区域</div>
                      <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>首件({detail.shopShipTplVo.model  === 1 ? "个" : detail.shopShipTplVo.model === 2 ? "kg" : detail.shopShipTplVo.model === 3 ? "m³" : ""})</div>
                      <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运费(元)</div>
                      <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>续件({detail.shopShipTplVo.model  === 1 ? "个" : detail.shopShipTplVo.model === 2 ? "kg" : detail.shopShipTplVo.model === 3 ? "m³" : ""})</div>
                      <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运费(元)</div>
                      <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>操作</div>
                    </li>
                  </ul>
                </dt>
                <dd className={`${styles.shipTplItemDd}`}>
                  <ul>
                    {
                      templateList.map((el,index,res) => {
                        let areasText = '';
                        el.areaNames.map((record,index) => {
                          if(el.areaNames.length === (index + 1)){
                            areasText = areasText + record
                          }else{
                            areasText = areasText + `${record},`
                          }
                        })
                        if(index === 0){
                          return <li className={`flex ${styles.shipTplItemDdContent}`} key={index}>
                          <div className={`${styles.ddItem}`} style={{width:"30%"}}>默认运费</div>
                          <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                            <FormItem>
                              {getFieldDecorator(`firstVolume_${index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写首量!"
                                  }
                                ],
                                initialValue:el.firstVolume
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem>
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                            <FormItem>
                              {getFieldDecorator(`firstFee_${index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写首费!"
                                  }
                                ],
                                initialValue:(el.firstFee * 0.01).toFixed(2)
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem>  
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                            <FormItem>
                              {getFieldDecorator(`renewalsVolume_${index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写续量!"
                                  }
                                ],
                                initialValue:el.renewalsVolume
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem>  
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                            <FormItem>
                              {getFieldDecorator(`renewalsPrice_${index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写续费!"
                                  }
                                ],
                                initialValue:(el.renewalsPrice * 0.01).toFixed(2)
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem>
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                            {/* <a href="javascript:;" className={`${styles.delete}`}>删除</a> */}
                          </div>
                        </li>
                        }else{
                          return <li className={`flex ${styles.shipTplItemDdContent}`} key={index}>
                          <div className={`${styles.ddItem} flex`} style={{width:"30%"}}>
                            { el.areaNames.length === 0 &&  <span style={{color:"#777777"}} className={`flex-item ${styles.areasText}`}>
                                还没指定区域
                              </span>
                            }
                            { el.areaNames.length !== 0 &&  <span className={`flex-item ${styles.areasText}`}>
                                {areasText}
                              </span>
                            }  
                            <a href="javascript:;" className={`${styles.edit}`} onClick={this.onEditAreaCode.bind(this,'template',index)}>编辑</a>
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                            <FormItem>
                              {getFieldDecorator(`firstVolume_${index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写首量!"
                                  }
                                ],
                                initialValue:el.firstVolume
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem>
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                            <FormItem>
                              {getFieldDecorator(`firstFee_${index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写首费!"
                                  }
                                ],
                                initialValue:(el.firstFee * 0.01).toFixed(2)
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem> 
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                            <FormItem>
                              {getFieldDecorator(`renewalsVolume_${index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写续量!"
                                  }
                                ],
                                initialValue:el.renewalsVolume
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem>  
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                            <FormItem>
                              {getFieldDecorator(`renewalsPrice_${index}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写续费!"
                                  }
                                ],
                                initialValue:(el.renewalsPrice * 0.01).toFixed(2)
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem>
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-center`}>
                            <a href="javascript:;" className={`${styles.delete}`} onClick={() => this.deleteTemplateRow(index)}>删除</a>
                          </div>
                        </li>   
                        }
                      })
                    }
                    <li className={`flex ${styles.shipTplItemDdContent}`}>
                      <div className={`${styles.ddItem} ${styles.nothingBorder}`} style={{borderRight:0}}>
                        <a href='javascript:;' onClick={this.addTemplate.bind(this)}>为指定地区城市设置运费</a>
                      </div>
                    </li>             
                  </ul>
                </dd>
              </dl>
          </div>
        </div>
    }

    const assignFreeTemplate = () => {
      return <div className={`${styles.shipTplTemplate}`}>
          <div className={`${styles.shipTplItem}`}>
              <dl className={`${styles.shipTplItemDl}`}>
                <dt className={`${styles.shipTplItemDt} flex flex-between flex-middle`}>
                  <ul>
                    <li className={`flex`}>
                      <div className={`${styles.ddItem}`} style={{width:"30%"}}>指定区域</div>
                      <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>包邮条件</div>
                      <div className={`${styles.ddItem} flex flex-middle flex-center`} style={{width:"10%"}}>操作</div>
                    </li>
                  </ul>
                </dt>
                <dd className={`${styles.shipTplItemDd}`}>
                  <ul>
                    {
                      assignFreeList.map((el,index,res) => {
                        return <li className={`flex ${styles.shipTplItemDdContent}`} key={index}>
                          <div className={`${styles.ddItem} flex`} style={{width:"30%"}}>
                            {
                              el.areaNames.length === 0 && <span className={`flex-item`} style={{color:"#777777"}}>
                                还没指定区域
                              </span>
                            }
                            {
                              el.areaNames.length !== 0 && <span className={`flex-item`}>
                                {
                                  el.areaNames.map((record,index) => {
                                    if(el.areaNames.length === (index + 1)){
                                      return <span>{record}</span>
                                    }else{
                                      return <span>{`${record},`}</span>
                                    }
                                  })
                                }
                              </span>
                            }  
                            <a href="javascript:;" className={`${styles.edit}`} onClick={this.onEditAreaCode.bind(this,'assignFree',index)}>编辑</a>
                          </div>
                          <div className={`${styles.ddItem} flex-item flex flex-center`}>
                            <span style={{marginRight:5}}>满</span>
                            <FormItem>
                              {getFieldDecorator(`volume_${index}_efp`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写数量!"
                                  }
                                ],
                                initialValue:el.volume
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem>
                            <span style={{marginRight:10}}>{detail.shopShipTplVo.model  === 1 ? "个" : detail.shopShipTplVo.model === 2 ? "kg" : detail.shopShipTplVo.model === 3 ? "m³" : ""}，满</span>
                            <FormItem>
                              {getFieldDecorator(`price_${index}_efp`, {
                                rules: [
                                  {
                                    required: true,
                                    message: "请填写价格!"
                                  }
                                ],
                                initialValue:(el.price * 0.01).toFixed(2)
                              })(
                                <InputNumber min={0} max={9999.99} style={{width:65}} />
                              )}
                            </FormItem>
                            <span>元包邮</span>
                          </div>
                          <div className={`${styles.ddItem} flex flex-center`} style={{width:"10%"}}>
                            <a href="javascript:;" className={`${styles.delete}`} onClick={() => this.deleteAddAssignFreeRow(index)}>删除</a>
                          </div>
                        </li>   
                      })
                    }
                    <li className={`flex ${styles.shipTplItemDdContent}`}>
                      <div className={`${styles.ddItem} ${styles.nothingBorder}`} style={{borderRight:0}}>
                        <a href='javascript:;' onClick={this.addAssignFree.bind(this)}>添加</a>
                      </div>
                    </li>             
                  </ul>
                </dd>
              </dl>
          </div>
        </div>
    }

    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.key} title={item.name} id={item.value} isLeaf={item.isLeaf}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.name} id={item.value} isLeaf={item.isLeaf} />;
    });

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={`/shops/shipTpl/index`}>运费模板列表</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>新增运费模板</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="运费模板名称">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "请输入名称"
                  }
                ],
                initialValue: detail.shopShipTplVo.name
              })(<Input placeholder="模板名称最少必须由1个字组成,最多不能超过20个字" style={{width:350}}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="运费模板描述">
              {getFieldDecorator("remark", {
                rules: [
                  {
                    required: false
                  }
                ],
                initialValue: detail.shopShipTplVo.remark
              })(<Input placeholder="选填(20个字内)" style={{width:350}}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="是否包邮">
              <div>
                {getFieldDecorator("isFree", {
                  initialValue: detail.shopShipTplVo.isFree
                })(
                  <RadioGroup onChange={this.onChengeIsFree.bind(this)}>
                    <Radio value={0} disabled={this.state.is_not_add}>包邮</Radio>
                    <Radio value={1} disabled={this.state.is_not_add}>自定义运费</Radio>
                  </RadioGroup>
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="计价方式">
              <div>
                {getFieldDecorator("model", {
                  initialValue: detail.shopShipTplVo.model
                })(
                  <RadioGroup onChange={this.onChangeModel.bind(this)}>
                    <Radio value={1} disabled={this.state.is_not_add}>按计价</Radio>
                    <Radio value={2} disabled={this.state.is_not_add}>按重量</Radio>
                    <Radio value={3} disabled={this.state.is_not_add}>按体积</Radio>
                  </RadioGroup>
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="运送方式">
              <div>
                {getFieldDecorator("detail", {
                  
                })(
                    <div>
                        <span style={{color:"#888888"}}>除指定地区外，其余地区的运费采用“默认运费”</span>
                        <div>
                          <Checkbox defaultChecked disabled={this.state.is_not_add}>快递</Checkbox>
                        </div>
                        {
                          detail.shopShipTplVo.isFree !== 0 && freightTemplate()
                        }
                    </div>
                )}
              </div>
            </FormItem>
            {
              detail.shopShipTplVo.isFree !== 0 && <FormItem {...formItemLayout} label="指定包邮条件">
                <div>
                  {getFieldDecorator("assignFree", {
                    
                  })(
                      <div>
                          <div>
                            <Checkbox disabled={this.state.is_not_add} onChange={this.onChangeAssignFree.bind(this)}>启用</Checkbox>
                          </div>
                          {
                            assignFree && assignFreeTemplate()
                          }
                      </div>
                  )}
                </div>
              </FormItem>
            }
            <FormItem {...formItemLayout} label="设置默认模板">
                {/* {getFieldDecorator("isDefault", {
                  initialValue: true
                })(
                  <Checkbox onChange={this.onChangeIsDefault.bind(this)}>启用</Checkbox>
                )} */}
                {getFieldDecorator("isDefault", {
                initialValue:detail.shopShipTplVo.isDefault
              })(
                <RadioGroup>
                  <Radio value={0}>是</Radio>
                  <Radio value={1}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </div>
        <Modal title="选择可配送区域" visible={this.state.areaCodeVisible} key={this.state.areaCodeVisibleKey}
          onOk={this.handleOkAreaCode} onCancel={this.handleCancelAreaCode} okText={`确定`} cancelText={`取消`}
          className={`${styles.areaCodeModal}`}
        >
          <div className={`flex flex-center`}>
             <div className={`${styles.left} ${styles.item}`}>
                <div className={`${styles.title}`}>可选省、市、区</div>
                <div className={`${styles.areaCodeList}`}>
                  <Tree
                    checkable
                    // onExpand={this.onExpand} 
                    // expandedKeys={this.state.expandedKeys}
                    // autoExpandParent={this.state.autoExpandParent}
                    // checkStrictly={true}
                    defaultCheckedKeys={this.state.checkedKeys}
                    onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    // loadData={this.onLoadAreaData}
                  >
                    {loop(areaData)}
                  </Tree>
                </div>
             </div>
             <div className={`${styles.center} ${styles.item} flex flex-middle flex-center`}>
                <Button onClick={this.onAddSelectedAreaData.bind(this)}>添加</Button>
             </div>
             <div className={`${styles.right} ${styles.item}`}>
                <div className={`${styles.title}`}>已选省、市、区</div>
                <div className={`${styles.areaCodeList}`} style={{padding: '10px 20px'}}>
                  {
                    selectedAreaData.map((el,index) => {
                      if((index + 1) === selectedAreaData.length){
                        return <span>{el}</span>
                      }else{
                        return <span>{el}，</span>
                      }
                    })
                  }
                </div>
             </div>   
          </div>
        </Modal>
      </div>
    );
  }
}
const ShopShipTplDetail = Form.create()(Detail);
export default ShopShipTplDetail;
