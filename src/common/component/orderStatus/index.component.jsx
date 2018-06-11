import style from "./index.less";

class OrderStatusBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {}

  render() {  
    let { status } = this.props;
    let statusText, statusRemark;
    switch(status){
        case 0 :
          statusText = '订单状态:待支付'
          statusRemark = ''
          break;
        case 1 :
          statusText = '订单状态:已取消'
          statusRemark = ''
          break;
        case 2 :
          statusText = '订单状态:过期未支付'
          statusRemark = ''
          break;
        case 3 :
          statusText = '订单状态:已付款'
          statusRemark = ''
          break;
        case 4 :
          statusText = '订单状态:已发货'
          statusRemark = ''
          break;
        case 5 :
          statusText = '订单状态:已收货'
          statusRemark = ''
          break;
        case 6 :
          statusText = '订单状态:待退款'
          statusRemark = ''
          break;
        case 7 :
          statusText = '订单状态:已退款'
          statusRemark = ''
          break;
        default :
          statusText = ''
          statusRemark = ''
          break;      
    }
    return (
        <div>
            <div className={`${style.status}  flex`}>
                <div className={`${style.icon} flex`}>
                    <i className={`${style.anticon} anticon anticon-shuoming`} 
                    //      style={icon === 'anticon-shuoming' ? {color:'#108ee9'} : {color:'#36ab60'}}
                    ></i>
                </div>
                <div className={`${style.info}`}>
                    <h3 className={`${style.name}`}>{statusText}</h3>
                    <div className={`${style.remark}`}>{statusRemark}</div>
                </div>
            </div>
        </div>
    );
  }
}

export default OrderStatusBox;
