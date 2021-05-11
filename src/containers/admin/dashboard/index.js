import React, { useEffect, useState } from 'react'
import { Container, Grid, makeStyles } from '@material-ui/core'
import Page from 'components/Page'
import Statistics from './Statistics'
import TasksProgress from './TasksProgress'
import TotalUsers from './TotalUsers'
import TotalAnswers from './TotalAnswers'
import TrafficByDevice from './TrafficByDevice'
import api from 'api'
import { toast } from 'react-toastify'
import { Spin } from 'antd'
import { antIcon } from 'utils/spinIcon'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const Dashboard = props => {
  const classes = useStyles()
  const [statistics, setStatistics] = useState(null)
  const [spin, setSpin] = useState(true)

  const getStat = () => {
    api.queryStatistics().then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        setSpin(false)
        setStatistics(res.data)
      }
    })
  }

  useEffect(() => {
    getStat()
  }, [])

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Spin indicator={antIcon} spinning={spin}>
          <Grid container spacing={3}>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TotalUsers statistics={statistics} />
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TasksProgress statistics={statistics} />
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TotalAnswers statistics={statistics} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <Statistics {...props} statistics={statistics} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <TrafficByDevice statistics={statistics} />
            </Grid>
          </Grid>
        </Spin>
      </Container>
    </Page>
  )
}

export default Dashboard
