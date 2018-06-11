import { Route, Link, Redirect } from "react-router-dom";

import GoodsRecommendList from './goods/list.component'
import GoodsRecommendAddList from './goods/add.component'

class RecommendComponent extends React.Component {
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
          path={`/recommend/goods/index`}
          render={props => <GoodsRecommendList {...props} />}
        />
        <Route
          exact
          path={`/recommend/goods/index/add`}
          render={props => <GoodsRecommendAddList {...props} />}
        />
      </div>
    );
  }
}

export default RecommendComponent;
