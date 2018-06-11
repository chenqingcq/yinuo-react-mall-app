/**
 * Created by Administrator on 2017/9/11.
 */

import '../common/utils/lib'
import 'react-quill/dist/quill.snow.css';
import {Route, HashRouter, NavLink, Redirect, Switch} from 'react-router-dom';
import {Menu, Icon, Layout} from 'antd';
const SubMenu = Menu.SubMenu;
const {Header, Content, Sider} = Layout;
import '../css/common.less'

import AppService from '../common/utils/app.service'

import _Header from '../component/header.component'
import ScrollToTop from '../component/scrollToTop.component'
import NotFound from '../component/error/not_found.component'
import NoAuthority from '../component/error/no_ authority.component'
import MemberCenterComponent from '../component/memberCenter/index.component'
import ShopsComponent from '../component/shops/index.component'
import OrderComponent from '../component/order/index.component'
import GoodsComponent from '../component/goods/index.component'
import GoodsDetail from '../component/goods/detail/detail.component'
import GoodsDetailView from '../component/goods/detail/detailView.component'

import RecommendComponent from '../component/recommend/index.component'

const navs = [
  {
    key: 'members',
    name: '会员中心',
    icon: 'huiyuan1',
    children: [
      {
        key: 'members_info',
        name: '会员信息',
        path: '/members/info',
        component: (props) => {
          return <MemberCenterComponent {...props}/>
        }
      },
      {
        key: 'members_contact',
        name: '人脉关系',
        path: '/members/contact',
        component: (props) => {
          return <MemberCenterComponent {...props}/>
        }
      },
      {
        key: 'members_deliverAddress',
        name: '收货地址',
        path: '/members/deliverAddress',
        component: (props) => {
          return <MemberCenterComponent {...props}/>
        }
      },
      // {
      //   key: 'members_report',
      //   name: '举报记录',
      //   path: '/members/report',
      //   component: (props) => {
      //     return <MemberCenterComponent {...props}/>
      //   }
      // }
    ]
  },
  {
    key: 'shops',
    name: '店铺中心',
    icon: 'dianpu',
    children: [
      {
        key: 'shops_info',
        name: '店铺信息',
        path: '/shops/info',
        component: (props) => {
          return <ShopsComponent {...props}/>
        }
      },
      {
        key: 'shops_address',
        name: '发货地址',
        path: '/shops/address',
        component: (props) => {
          return <ShopsComponent {...props}/>
        }
      },
      {
        key: 'shops_banner',
        name: '店铺相片',
        path: '/shops/banner',
        component: (props) => {
          return <ShopsComponent {...props}/>
        }
      },
      {
        key: 'shops_seo',
        name: 'SEO关键词',
        path: '/shops/seo',
        component: (props) => {
          return <ShopsComponent {...props}/>
        }
      },
      // {
      //   key: 'shops_advertisement',
      //   name: '广告申请',
      //   path: '/shops/ad',
      //   component: (props) => {
      //     return <ShopsComponent {...props}/>
      //   }
      // },
      {
        key: 'shops_shipTpl',
        name: '运费模板',
        path: '/shops/shipTpl',
        component: (props) => {
          return <ShopsComponent {...props}/>
        }
      },
      // {
      //   key: 'shops_score',
      //   name: '店铺评分',
      //   path: '/shops/score',
      //   component: (props) => {
      //     return <ShopsComponent {...props}/>
      //   }
      // }
    ]
  },
  {
    key: 'goods',
    name: '商品管理',
    icon: 'shangpinguanli',
    children: [
      {
        key: 'goods_onOffer',
        name: '出售中',
        path: '/goods/onOffer',
        component: (props) => {
          return <GoodsComponent {...props}/>
        }
      },
      {
        key: 'goods_draft',
        name: '仓库中',
        path: '/goods/draft',
        component: (props) => {
          return <GoodsComponent {...props}/>
        }
      },
      {
        key: 'goods_audit',
        name: '审核中',
        path: '/goods/audit',
        component: (props) => {
          return <GoodsComponent {...props}/>
        }
      },
      {
        key: 'goods_class',
        name: '商品分类',
        path: '/goods/class',
        component: (props) => {
          return <GoodsComponent {...props}/>
        }
      },
    ]
  },
  {
    key: 'order',
    name: '订单中心',
    icon: 'order_icon',
    children: [
      {
        key: 'order_online',
        name: '线上订单',
        path: '/order/online',
        component: (props) => {
          return <OrderComponent {...props}/>
        }
      },
      {
        key: 'order_offline',
        name: '线下订单',
        path: '/order/offline',
        component: (props) => {
          return <OrderComponent {...props}/>
        }
      },
      // {
      //   key: 'order_convert',
      //   name: '兑换订单',
      //   path: '/order/convert',
      //   component: (props) => {
      //     return <OrderComponent {...props}/>
      //   }
      // },
      // {
      //   key: 'order_ad',
      //   name: '广告位单',
      //   path: '/order/ad',
      //   component: (props) => {
      //     return <OrderComponent {...props}/>
      //   }
      // },
      // {
      //   key: 'order_shopGrade',
      //   name: '店铺等级订单',
      //   path: '/order/shopGrade',
      //   component: (props) => {
      //     return <OrderComponent {...props}/>
      //   }
      // },
      {
        key: 'order_virtual',
        name: '虚拟服务订单',
        path: '/order/virtual',
        component: (props) => {
          return <OrderComponent {...props}/>
        }
      },
      {
        key: 'order_dispute',
        name: '退款退货订单',
        path: '/order/dispute',
        component: (props) => {
          return <OrderComponent {...props}/>
        }
      },
      {
        key: 'order_refund-apply',
        name: '退款/退货退款申请',
        path: '/order/refund-apply',
        component: (props) => {
          return <OrderComponent {...props}/>
        }
      },
    ]
  },
  {
    key: 'recommend',
    name: '推荐管理',
    icon: 'tuijian',
    children: [
      {
        key: 'recommend_goods',
        name: '商品推荐',
        path: '/recommend/goods',
        component: (props) => {
          return <RecommendComponent {...props}/>
        }
      },
    ]
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      defaultSelectedKeys: 'members_info',
      defaultOpenKeys: 'members',
      loginName: '',
      permission: [],
      firstNavKey:"parent_operate_set" // 一级导航默认可以
    }
  }

  componentWillMount() {
    let _this = this;
    AppService.postRequest('base/login/verify_login').then(response => {
      if (response.data) {
        _this.setState({
          loginName: response.data.phone,
          permission: response.data.permissionCodes
        })
      }
      // console.log(response)
    })
    if (window.location.hash == '#/' || window.location.hash == '') {
      return
    }
    let path = window.location.hash.substring(1).split('/'),
      defaultSelectedKeys = path[1] + '_' + path[2], 
      parentKey = "";
    navs.map((item,index) => {
      for(let i = 0; i < item.children.length; i++){
        if(defaultSelectedKeys === item.children[i].key){
          parentKey = item.parentkey;
          break;
        }
      }
    })
    this.setState({
      defaultSelectedKeys: defaultSelectedKeys,
      defaultOpenKeys: path[1],
      firstNavKey:parentKey
    })
  }

  getMenuItem = () => {
    let _this = this;
    return navs.map(record => {
      // if (record.children.length == 0 && this.state.permission.indexOf(record.key) > -1) {
      if (record.children.length == 0) {
        return ( <Menu.Item key={record.key}>
          <NavLink to={item.path}> <Icon type={record.icon}/><span
            className="nav-text">{record.name}</span></NavLink>
        </Menu.Item>)
      } else if (record.children.length != 0) {
        function hasPermission(item) {
          return _this.state.permission.indexOf(item.key) > -1
        }
        // if (record.children.some(hasPermission)) {
          return (
            <SubMenu key={record.key} title={<span><Icon type={record.icon}/>{record.name}</span>}>
              {
                record.children.map(item => {
                  // if (_this.state.permission.indexOf(item.key) > -1) {
                    return (
                      <Menu.Item key={item.key}>
                        <NavLink to={item.path}> <span
                          className="nav-text">{item.name}</span></NavLink>
                      </Menu.Item>
                    )
                  // }
                })
              }
            </SubMenu>
          )
        // }
      }
    })
  };

  getLinkUrl = (data) => {
    return `/${data.split('_').join('/')}`
  };

  authority = (permission, component, props) => {
    // if (this.state.permission.indexOf(permission) > -1) {
    //   return component(props)
    // } else {
    //   return <NoAuthority/>
    // }
    if (true) {
      return component(props)
    } else {
      return <NoAuthority/>
    }
  };

  toggle = () => {
    let collapsed = !this.state.collapsed;
    if(collapsed){
      document.getElementById("header").style.marginLeft="64px";
      document.getElementById("antContent").style.margin="0 16px 0 80px";
    }else{
      document.getElementById("header").style.marginLeft="200px";
      document.getElementById("antContent").style.margin="0 16px 0 216px";
    }
    this.setState({
      collapsed,
    });
  };

  handleOpenChange = (openKeys) => {
    this.setState({
      defaultOpenKeys:openKeys[openKeys.length - 1]
    });
  };

  render() {
    let _this = this;
    return (
      <HashRouter>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo">一诺商城</div>
            <Menu theme="dark" mode="inline" openKeys={[this.state.defaultOpenKeys]} defaultSelectedKeys={[this.state.defaultSelectedKeys]}
                  defaultOpenKeys={[this.state.defaultOpenKeys]} onOpenChange={this.handleOpenChange}>
              {this.getMenuItem()}
            </Menu>
          </Sider>
          <Layout>
            <Header style={{background: '#fff', paddingLeft: 0}} className='flex flex-between' id='header'>
              <div className='flex'>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </div>
              <_Header loginName={this.state.loginName}></_Header>
            </Header>
            <Content style={{position: 'relative'}} id='antContent'>
              <ScrollToTop>
                <Switch>
                  <Route exact={true} path='/' render={() => {
                    let url = '';
                    if (navs[0].children.length) {
                      url = navs[0].children[0].path
                    } else {
                      url = navs[0].path
                    }
                    return <Redirect to={url}/>
                  }}/>
                  {
                    navs.map((record, index) => {//路由切换
                      if (record.children.length == 0) {
                        return <Route key={index} path={record.path} render={(props) => {
                          return _this.authority(record.key, record.component, props)
                        }
                        }/>
                      } else {
                        return record.children.map(item => {
                          return <Route key={item.path} path={item.path} render={(props) => {
                            return _this.authority(item.key, item.component, props)
                          }
                          }/>
                        })
                      }
                    })
                  }
                  <Route path='/goods/detail/index' render={(props) => {
                    return <GoodsDetail {...props}/>
                  }}/>
                  <Route path='/goods/detail/edit/:id' render={(props) => {
                    return <GoodsDetail {...props}/>
                  }}/>
                  <Route path='/goods/detail/view/:id' render={(props) => {
                    return <GoodsDetailView {...props}/>
                  }}/>
                  <Route path='/myCenter/updatePwd' render={(props) => {
                    return <Mycenter {...props}/>
                  }}/>
                  <Route render={(props) => <NotFound/>}/>
                </Switch>
              </ScrollToTop>
            </Content>
          </Layout>
        </Layout>
      </HashRouter>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('container'))
