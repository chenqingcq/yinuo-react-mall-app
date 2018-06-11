import { Route, Link, Redirect } from "react-router-dom";

import ShopsInfoDetail from './info/detail.component'
import ShopAddressList from './address/list.component'
import ShopAddressDetailForm from './address/detail.component'
import ShopBannerDetailForm from './banner/detail.component'
import ShopAdList from './ad/list.component'
import ShopAdDetail from './ad/detail.component'
import ShopEvaluateLog from './score/detail.component'
import ShopShipTplList from './shipTpl/list.component'
import ShopShipTplDetail from './shipTpl/detail.component'
import ShopsSeoDetail from './seo/detail.component'

class ShopsComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { match, location, operate } = this.props;
    return (
      <div>
        <Route
          exact
          path={`${match.url}`}
          render={() => {
            return <Redirect to={`${match.url}/index`} />;
          }}
        />
        <Route
          exact
          path={`/shops/info/index`}
          render={props => <ShopsInfoDetail {...props} />}
        />
        <Route
          exact
          path={`/shops/address/index`}
          render={props => <ShopAddressList {...props} />}
        />
        <Route
          exact
          path={`/shops/address/index/add`}
          render={props => <ShopAddressDetailForm {...props} />}
        />
        <Route
          exact
          path={`/shops/address/index/edit/:id`}
          render={props => <ShopAddressDetailForm {...props} />}
        />
        <Route
          exact
          path={`/shops/banner/index`}
          render={props => <ShopBannerDetailForm {...props} />}
        />
        <Route
          exact
          path={`/shops/ad/index`}
          render={props => <ShopAdList {...props} />}
        />
        <Route
          exact
          path={`/shops/ad/index/add`}
          render={props => <ShopAdDetail {...props} />}
        />
        <Route
          exact
          path={`/shops/ad/index/edit/:id`}
          render={props => <ShopAdDetail {...props} />}
        />
        <Route
          exact
          path={`/shops/score/index`}
          render={(props) => <ShopEvaluateLog {...props}/> }
        />
        <Route
          exact
          path={`/shops/shipTpl/index`}
          render={props => <ShopShipTplList {...props} />}
        />
        <Route
          exact
          path={`/shops/shipTpl/index/add`}
          render={props => <ShopShipTplDetail {...props} />}
        />
        <Route
          exact
          path={`/shops/shipTpl/index/edit/:id`}
          render={props => <ShopShipTplDetail {...props} />}
        />
        <Route
          exact
          path={`/shops/seo/index`}
          render={props => <ShopsSeoDetail {...props} />}
        />
      </div>
    );
  }
}

export default ShopsComponent;
