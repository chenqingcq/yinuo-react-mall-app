import {
    Route, Link, Redirect
} from 'react-router-dom';  
  
import OrderOnlineList from './online/list.component'
import OrderOnlineDetail from './online/detail.component'  

import OrderOfflineList from './offline/list.component'
import OrderOfflineDetail from './offline/detail.component'

import OrderAdList from './ad/list.component'
import OrderAdDetail from './ad/detail.component'

import OrderShopGradeList from './shopGrade/list.component'
import OrderShopGradeDetail from './shopGrade/detail.component'

import OrderVirtualList from './virtual/list.component'
import OrderVirtualDetail from './virtual/detail.component'

import OrderConvertList from './convert/list.component'
import OrderConvertDetail from './convert/detail.component'

import OrderDisputeList from './dispute/list.component'
import OrderDisputeDetail from './dispute/detail.component'

import RefundApplyList from './refundApply/list.component'
import RefundApplyDetail from './refundApply/detail.component'
  
class OrderComponent extends React.Component {
constructor(props) {
    super(props)
}

render() {
    let {match, location, operate} = this.props;
    return (
        <div>
            <Route exact path={`${match.url}`} render={() => {
            return <Redirect to={`${match.url}/index`}/>
            }}/>
            <Route exact path={`/order/online/index`} render={(props) => <OrderOnlineList {...props}/> }/>
            <Route exact path={`/order/online/index/view/:id`} render={(props) => <OrderOnlineDetail {...props}/> }/>

            <Route exact path={`/order/offline/index`} render={(props) => <OrderOfflineList {...props}/> }/>
            <Route exact path={`/order/offline/index/view/:id`} render={(props) => <OrderOfflineDetail {...props}/> }/>

            <Route exact path={`/order/ad/index`} render={(props) => <OrderAdList {...props}/> }/>
            <Route exact path={`/order/ad/index/view`} render={(props) => <OrderAdDetail {...props}/> }/>

            <Route exact path={`/order/shopGrade/index`} render={(props) => <OrderShopGradeList {...props}/> }/>
            <Route exact path={`/order/shopGrade/index/view`} render={(props) => <OrderShopGradeDetail {...props}/> }/>

            <Route exact path={`/order/virtual/index`} render={(props) => <OrderVirtualList {...props}/> }/>
            <Route exact path={`/order/virtual/index/view`} render={(props) => <OrderVirtualDetail {...props}/> }/>

            <Route exact path={`/order/convert/index`} render={(props) => <OrderConvertList {...props}/> }/>
            <Route exact path={`/order/convert/index/view`} render={(props) => <OrderConvertDetail {...props}/> }/>

            <Route exact path={`/order/dispute/index`} render={(props) => <OrderDisputeList {...props}/> }/>
            <Route exact path={`/order/dispute/index/view`} render={(props) => <OrderDisputeDetail {...props}/> }/>

            <Route exact path={`/order/refund-apply/index`} render={(props) => <RefundApplyList {...props}/> }/>
            <Route exact path={`/order/refund-apply/index/view/:id`} render={(props) => <RefundApplyDetail {...props}/> }/>
        </div>
        )
    }
}

export default OrderComponent;
  