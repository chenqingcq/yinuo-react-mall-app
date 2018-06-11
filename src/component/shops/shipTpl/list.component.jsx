import { Link } from "react-router-dom";
import {
  Select,
  Button,
  Input,
  Form,
  Card,
  Breadcrumb,
  Modal,
  Col,
  Icon,
  Tag,
  Popconfirm
} from "antd";
const confirm = Modal.confirm;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import styles from "./style.less";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      config: {
        pageNum: 1,
        pageSize: 10
      },
      list:[],
      loading: false
    };
  }

  componentDidMount() {
    this.getList()
  }

  // 获取列表
  getList = (params) => {
    params = {...this.state.config, ...params}
    let _this = this;
    Actions.getShopShipTplList(params).then(response => {
      if (response.code == 0) {
        this.setState({
          list:response.data.rows
        }) 
      }
    });
  }

  // 删除运费运费模板
  onDelete = (id, index) => {
    let _this = this;
    Actions.deleteShopShipTpl({
      id: id
    }).then(result => {
      if (result.code == 0) {
        Utils.dialog.success('删除成功')
        let list = _this.state.list.filter(item => item.shopShipTplVo.id !== id);
        _this.setState({
          list:list
        })
      } else {
        Utils.dialog.error(result.errorMsg)
      }
    })
  }

  // 设置默认模板
  setDefault = (id,index) => {
    let _this = this;
    Actions.setDefaultShopShipTpl({
      id: id
    }).then(result => {
      if (result.code == 0) {
        Utils.dialog.success('设置成功')
        _this.getList()
      } else {
        Utils.dialog.error(result.errorMsg)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { list } = this.state;
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>运费模板列表</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div className="top flex flex-between">
            <Link to={`/shops/shipTpl/index/add`}>
              <Button type="primary">
                新增运费模板
              </Button>
            </Link>
          </div>
          <div className={`${styles.shipTplList}`}>
            {
              list.length !== 0 && list.map((item,res,index) => {
                let modal = item.shopShipTplVo.model === 1 ? "个" : item.shopShipTplVo.model === 2 ? "kg" : item.shopShipTplVo.model === 3 ? "m³" : "";
                return <div className={`${styles.shipTplItem}`} key={item.shopShipTplVo.id}>
                        <dl className={`${styles.shipTplItemDl}`}>
                          <dt className={`${styles.shipTplItemDt} flex flex-between flex-middle`}>
                            <div>
                              <span className={`${styles.name}`}>{item.shopShipTplVo.name}{item.shopShipEfpTplDetailVos.length !== 0 && '(已指定包邮条件)'}</span>
                              {
                                item.shopShipTplVo.isDefault === 0 ? <Tag color="#f50">默认</Tag> : <span className={`${styles.setDefault}`} onClick={() => this.setDefault(item.shopShipTplVo.id,index)}>设置默认</span>
                              }
                            </div>
                            <div className='flex'>
                                <span className={`${styles.date}`}>更新时间:{Utils.formatDate(new Date(item.shopShipTplVo.gmtCreate),"yyyy-mm-dd hh:ii")}</span>
                                <Link to={`/shops/shipTpl/index/edit/${item.shopShipTplVo.id}`}>
                                  编辑
                                </Link>
                                <Popconfirm placement="left" title={'确定删除运费模板？'} onConfirm={() => this.onDelete(item.shopShipTplVo.id,index)}
                                          okText="确定" cancelText="取消">
                                  <a href="javascript:;">删除</a>
                              </Popconfirm>
                            </div>
                          </dt>
                          <dd className={`${styles.shipTplItemDd}`}>
                            <ul>
                              <li className={`flex`}>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运送方式</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运送到</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>首件({modal})</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运费(元)</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>续件({modal})</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运费(元)</div>
                              </li>
                              {
                                item.shopShipTplVo.isFree === 0 && <li className={`flex ${styles.shipTplItemDdContent}`}>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>快递</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>默认运费</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>1</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>0.00</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>1</div>
                                    <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>0.00</div>
                                </li>         
                              }
                              {
                                item.shopShipTplVo.isFree === 1 && item.shopShipTplDetailVos.map((el,index) => {
                                  let areasText = '';
                                  if(index === 0){
                                    areasText = '默认邮费'
                                  }else{
                                    let areas = el.areaNames.split(',')
                                    areas.map((record,index) => {
                                      if(areas.length === (index + 1)){
                                        areasText = areasText + record
                                      }else{
                                        areasText = areasText + `${record},`
                                      }
                                    })
                                  }
                                  return <li className={`flex ${styles.shipTplItemDdContent}`}>
                                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>快递</div>
                                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>
                                              {areasText}
                                            </div>
                                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>{el.firstVolume}</div>
                                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>{Utils.moneyMinuteToYuan(el.firstFee)}</div>
                                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>{el.renewalsVolume}</div>
                                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>{Utils.moneyMinuteToYuan(el.renewalsPrice)}</div>
                                         </li>  
                                })       
                              } 
                            </ul>
                          </dd>
                        </dl>
                    </div>
              })
            }
            {/* <div className={`${styles.shipTplItem}`}>
                <dl className={`${styles.shipTplItemDl}`}>
                  <dt className={`${styles.shipTplItemDt} flex flex-between flex-middle`}>
                    <div>
                      <span className={`${styles.name}`}>江浙沪</span>
                      <Tag color="#108ee9">设置默认</Tag>
                    </div>
                    <div className='flex'>
                        <span className={`${styles.date}`}>更新时间:2018-03-28 16:00</span>
                        <a href="javascript:;">编辑</a>
                        <a href="javascript:;">删除</a>
                    </div>
                  </dt>
                  <dd className={`${styles.shipTplItemDd}`}>
                    <ul>
                       <li className={`flex`}>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运送方式</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运送到</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>首件(个)</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运费(元)</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>续件(个)</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>运费(元)</div>
                       </li>
                       <li className={`flex ${styles.shipTplItemDdContent}`}>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>快递</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>默认运费</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>1</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>12.00</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>1</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>2.00</div>
                       </li>
                       <li className={`flex ${styles.shipTplItemDdContent}`}>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>快递</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>重庆,四川,贵州,云南,西藏</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>1</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>15.00</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>1</div>
                            <div className={`${styles.ddItem} flex-item flex flex-middle flex-center`}>6.00</div>
                       </li>             
                    </ul>
                  </dd>
                </dl>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

const ShopShipTplList = Form.create()(List);
export default ShopShipTplList;
