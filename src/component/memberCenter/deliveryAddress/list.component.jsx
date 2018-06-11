import {Link} from 'react-router-dom';
import {Select, Button, Input, Form, Card, Breadcrumb, Modal, Col, Icon} from 'antd';
const confirm = Modal.confirm;

import * as Actions from '../actions'
import Utils from '../../../common/utils/utils'
import style from './style.less'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {},
      config: {
        pageNum: 1,
        pageSize: 20
      },
      loading: false,
    }
  }

  componentDidMount() {
    this.getList()
  }

  getList = (params) => {
    params = {...this.state.config, ...params}
    Actions.getMemberAddressList(params).then(response => {
      this.setState({
        list: response.data.rows,
      });
    })
  }

  // 删除
  onDelete = (id, index) => {
    let _this = this;
    confirm({
      title: '您确定要删除该收货地址吗?',
      content: '',
      onOk() {
        Actions.deleteMemberAddress({
          id: id
        }).then(result => {
          if (result.code == 0) {
            Utils.dialog.success('删除成功')
            let list = _this.state.list.filter(item => item.id !== id);
            _this.setState({
              list:list
            })
          } else {
            Utils.dialog.error(result.errorMsg)
          }
        })
      },
      onCancel() {

      },
    });
  }

  // 设置为默认
  onSetDefault = (id,index) => {
    let _this = this;
    Actions.updateMemberAddress({
      id: id,
      isDefault: 0
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
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
    };
    const colLayout = {
      xs: {span: 24},
      sm: {span: 8},
    };
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            {/*<Icon type="user"/>*/}
            <span>收货地址列表</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div className="top flex flex-between">
          <Button type="primary"><Link to={`${this.props.match.url}/add`}>新增地址</Link></Button>
          </div>
          <div className="table">
            {this.state.list.length === 0 ? <div style={{textAlign:"center"}}>暂无收货地址</div> : this.state.list.map((record, index) => {
              return  <Card key={record.id} className={`${style.list}`}>
                <p className={`${style.header}`}>
                  <span className={`${style.title}`}>{record.alias !== '' ? record.alias : record.name}</span>
                  {record.isDefault === 0 && <span className={`${style.default}`}>默认地址</span>}
                  <span className={`${style.delete}`}><Icon type="close" onClick={this.onDelete.bind(this, record.id, index)}/></span>
                </p>
                <p className={`${style.body}`}>
                  <span className={`${style.label}`}>收货人：</span>
                  <span className={`${style.detail}`}>{record.name}</span>
                </p>
                <p className={`${style.body}`}>
                  <span className={`${style.label}`}>所在地区：</span>
                  <span className={`${style.detail}`}>{record.mergeName}</span>
                </p>
                <p className={`${style.body}`}>
                  <span className={`${style.label}`}>详细地址：</span>
                  <span className={`${style.detail}`}>{record.detailAddr}</span>
                </p>
                <p className={`${style.body}`}>
                  <span className={`${style.label}`}>手机号码：</span>
                  <span className={`${style.detail}`}>{record.phone}</span>
                </p>
                <p className={`${style.body}`}>
                  <span className={`${style.label}`}>固定电话：</span>
                  <span className={`${style.detail}`}>{record.tel}</span>
                </p>
                {/* <p className={`${style.body}`}>
                  <span className={`${style.label}`}>电子邮箱：</span>
                  <span className={`${style.detail}`}>{record.email}</span>
                </p> */}
                <p className={`${style.operate}`}>
                  {record.isDefault === 1 &&  <span className={`${style.isDefault}`} onClick={this.onSetDefault.bind(this, record.id, index)}>设为默认</span>}
                  <Link to={`${this.props.match.url}/edit/${record.id}`}><span className={`${style.edit}`}>编辑</span></Link>
                </p>
              </Card>
            })}
          </div>
        </div>
      </div>
    )
  }
}

const DeliveryAddressList = Form.create()(List);
export default DeliveryAddressList;
