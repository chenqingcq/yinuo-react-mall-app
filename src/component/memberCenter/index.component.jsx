import {
  Route, Link, Redirect
} from 'react-router-dom';

import MemberInfoList from './info/list.component'
import MemberInfoDetailForm from './info/detail.component'

import MemberContactList from './contact/list.component'

import DeliveryAddressList from './deliveryAddress/list.component'
import DeliveryAddressDetailForm from './deliveryAddress/detail.component'

import ReportList from './report/list.component'
import ReportDetailForm from './report/detail.component'

class MemberCenterComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {match, location, operate} = this.props;
    console.log(this.props,'---------------------')
    return (
      <div>
        <Route exact path={`${match.url}`} render={() => {
          return <Redirect to={`${match.url}/index`}/>
        }}/>
        {/* <Route exact path={`/members/info/index`} render={(props) => <MemberInfoList {...props}/> }/> */}
        <Route exact path={`/members/info/index`} render={(props) => <MemberInfoDetailForm {...props}/> }/>
        <Route exact path={`/members/info/index/add`} render={(props) => <MemberInfoDetailForm {...props}/> }/>
        <Route exact path={`/members/info/index/edit/:id`} render={(props) => <MemberInfoDetailForm {...props}/> }/>

        <Route exact path={`/members/deliverAddress/index`} render={(props) => <DeliveryAddressList {...props}/> }/>
        <Route exact path={`/members/deliverAddress/index/add`} render={(props) => <DeliveryAddressDetailForm {...props}/> }/>
        <Route exact path={`/members/deliverAddress/index/edit/:id`} render={(props) => <DeliveryAddressDetailForm {...props}/> }/>

        <Route exact path={`/members/report/index`} render={(props) => <ReportList {...props}/> }/>
        <Route exact path={`/members/report/index/edit/:id`} render={(props) => <ReportDetailForm {...props}/> }/>

        <Route exact path={`/members/contact/index`} render={(props) => <MemberContactList {...props}/> }/>

        {/*<Route exact path={`/members/contact/index/add`} render={(props) => <OperatorDetailForm {...props}/> }/>*/}
        {/*<Route exact path={`/members/contact/index/edit/:id`} render={(props) => <OperatorDetailForm {...props}/> }/>*/}
      </div>
    )
  }
}

export default MemberCenterComponent;
