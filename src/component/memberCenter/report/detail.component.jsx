import {Link} from 'react-router-dom';
import {Form, Input, Breadcrumb, Alert, Cascader} from 'antd';

const FormItem = Form.Item;

import * as Actions from '../actions'
import Utils from '../../../common/utils/utils'

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_not_add: false, // 添加模式、编辑模式的判断
      formValible: true, // 审核结果决定编辑模式下表单是否可编辑
      detail: {
        status: false
      },
      isLoading: false,
      options: []
    }
  }

  componentDidMount() {

    let _this = this, {match} = this.props, id = match.params.id
      // Actions.getMemberGrade({
      //   id: id
      // }).then(response => {
      //   _this.setState({
      //     detail: response.data,
      //   })
      //
      // })
  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault()
    let {match, history} = this.props, _this = this, id = match.params.id
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        debugger
        if (id !== undefined) {
          values.id = id
        }
        _this.setState({
          isLoading: true
        })
        if (id == undefined) {
          // Actions.createMemberGrade(values).then(response => {
          //   _this.setState({
          //     isLoading: false
          //   })
          //   if (response.code == 0) {
          //     Utils.dialog.success('保存成功', () => {
          //       history.push(`/members/deliverAddress/index`)
          //     })
          //   }
          // })
        } else if (id !== undefined) {
          // Actions.updateMemberGrade(values).then(response => {
          //   _this.setState({
          //     isLoading: false
          //   })
          //   if (response.code == 0) {
          //     Utils.dialog.success('编辑成功')
          //   }
          //   let detail = _this.state.detail
          //   // _this.setState({detail: Object.assign({}, detail, response.data)})
          // })
        }

      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {detail, is_not_add} = this.state
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={`/members/report/index`}>
              <span>举报记录</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            举报单详情
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <Form
            // onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="举报状态"
              hasFeedback
            >
              <Alert message="已处理" type="info"/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="平台处理结果"
              hasFeedback
            >
              <Alert message="无效举报" type="info"/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="平台处理反馈"
              hasFeedback
            >
              <div>{detail.auditRemark}</div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="举报账号"
              hasFeedback
            >
              <div>{detail.auditRemark}</div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="被举报账号"
              hasFeedback
            >
              <div>{detail.auditRemark}</div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="举报对象类型"
              hasFeedback
            >
              <div>{detail.auditRemark}</div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="举报主题"
              hasFeedback
            >
              <div>{detail.auditRemark}</div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="举报主题内容"
              hasFeedback
            >
              <div>{detail.auditRemark}</div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="举报问题描述"
              hasFeedback
            >
              <div>{detail.auditRemark}</div>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
const ReportDetailForm = Form.create()(Detail)
export default ReportDetailForm