import React, {lazy} from 'react'
import {Route, Switch} from 'react-router-dom'
// todo
import demo from 'containers/demo/demo'

const LoginContainer = lazy(() => import('containers/login'))

export class Routes extends React.Component<any> {
    render() {
        return (
            <>
                <Switch>
                    {/*<Redirect exact={true} from="/" to="/login" />*/}
                    <Route path="/" component={demo}/>
                    <Route path="/login" component={LoginContainer}/>
                </Switch>
            </>
        )
    }
}

export default Routes
