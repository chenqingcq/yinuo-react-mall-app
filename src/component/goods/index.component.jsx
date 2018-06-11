import {
Route, Link, Redirect
} from 'react-router-dom';

import GoodsOnOfferList from './onOffer/list.component'
import GoodsDraftList from './draft/list.component'
import GoodsAuditList from './audit/list.component'

import ShopGoodsClassList from './category/list.component'
import ShopsGoodsClassDetail from './category/detail.component'

class GoodsComponent extends React.Component {
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
            <Route exact path={`/goods/onOffer/index`} render={(props) => <GoodsOnOfferList {...props}/> }/>
            <Route exact path={`/goods/draft/index`} render={(props) => <GoodsDraftList {...props}/> }/>
            <Route exact path={`/goods/audit/index`} render={(props) => <GoodsAuditList {...props}/> }/>
            <Route exact path={`/goods/class/index`} render={(props) => <ShopGoodsClassList {...props}/> }/>
            <Route exact path={`/goods/class/index/add`} render={(props) => <ShopsGoodsClassDetail {...props}/> }/>
            <Route exact path={`/goods/class/index/add/:parentId`} render={(props) => <ShopsGoodsClassDetail {...props}/> }/>
            <Route exact path={`/goods/class/index/edit/:id`} render={(props) => <ShopsGoodsClassDetail {...props}/> }/>
        </div>
        )
    }
}

export default GoodsComponent;
  