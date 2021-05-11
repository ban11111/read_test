import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography, makeStyles, colors } from '@material-ui/core'
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}))

const TasksProgress = ({ className, statistics, ...rest }) => {
  const classes = useStyles()

  const progress = () => {
    return !!statistics ? (Number(statistics.total_progress) * 100).toFixed(2) : 0
  }
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              ACTIVE PAPER's PROGRESS
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {progress()}%
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={3}>
          <LinearProgress value={Number(progress())} variant="determinate" />
        </Box>
      </CardContent>
    </Card>
  )
}

TasksProgress.propTypes = {
  className: PropTypes.string,
  statistics: PropTypes.object
}

export default TasksProgress
