import React, { lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import InfoPage from 'containers/info'
import DemoPage from 'containers/demo'
import FinishPage from 'containers/finish'
import DashboardLayout from 'components/layouts/DashboardLayout'
import Dashboard from 'containers/admin/dashboard'
import Users from 'containers/admin/users'
import Settings from 'containers/admin/settings'
import Papers from 'containers/admin/papers'
import Detail from 'containers/admin/users/detail'
import InstructionPage from 'containers/instruction'

// const LoginContainer = lazy(() => import('containers/login'))
const AdminLogin = lazy(() => import('containers/admin/login'))

export class Routes extends React.Component<any> {
  render() {
    return (
      <>
        <Switch>
          <Redirect exact={true} from="/" to="/info" />
          <Route path="/info">
            <InfoPage {...this.props} />
          </Route>
          <Route path="/instruction">
            <InstructionPage {...this.props} />
          </Route>
          <Route path="/demo" component={DemoPage} />
          <Route path="/finish" component={FinishPage} />
          <Redirect exact={true} from="/admin" to="/admin/login" />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard">
            <DashboardLayout components={Dashboard} {...this.props} />
          </Route>
          <Route path="/admin/users" exact>
            <DashboardLayout components={Users} {...this.props} />
          </Route>
          <Route path="/admin/users/:uid">
            <DashboardLayout components={Detail} />
          </Route>
          <Route path="/admin/papers">
            <DashboardLayout components={Papers} {...this.props} />
          </Route>
          <Route path="/admin/settings">
            <DashboardLayout components={Settings} {...this.props} />
          </Route>
        </Switch>
      </>
    )
  }
}

export default Routes
