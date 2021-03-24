import React, { lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import DemoPage from 'containers/demo'
import InfoPage from 'containers/info'
import DashboardLayout from 'components/layouts/DashboardLayout'
import Dashboard from 'containers/admin/dashboard'
import Users from 'containers/admin/users'

const LoginContainer = lazy(() => import('containers/login'))

export class Routes extends React.Component<any> {
  render() {
    return (
      <>
        <Switch>
          <Redirect exact={true} from="/" to="/info" />
          <Route path="/info">
            <InfoPage props={this.props} />
          </Route>
          <Route path="/demo" component={DemoPage} />
          <Redirect exact={true} from="/admin" to="/admin/login" />
          <Route path="/admin/login" component={LoginContainer} />
          <Route path="/admin/dashboard">
            <DashboardLayout components={Dashboard} />
          </Route>
          <Route path="/admin/customers">
            <DashboardLayout components={Users} />
          </Route>
        </Switch>
      </>
    )
  }
}

export default Routes
