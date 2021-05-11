import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, makeStyles, colors } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import PropTypes from 'prop-types'

const useStyles = makeStyles(() => ({
  root: {}
}))

const defaultCount = {
  new_user: [],
  new_answer: [],
  labels: []
}

const defaultChart = {
  daily: defaultCount,
  monthly: defaultCount
}

const styleOptions = {
  barThickness: 15,
  maxBarThickness: 15,
  barPercentage: 0.5,
  categoryPercentage: 0.5
}

const Statistics = props => {
  const classes = useStyles()
  const theme = useTheme()
  const [daily, setDaily] = useState(true)

  const chart = !!props.statistics ? props.statistics.chart : defaultChart

  const data = () => {
    return {
      datasets: [
        {
          ...styleOptions,
          backgroundColor: colors.indigo[500],
          data: daily ? chart.daily.new_answer : chart.monthly.new_answer,
          label: 'New Answer'
        },
        {
          ...styleOptions,
          backgroundColor: colors.green[100],
          data: daily ? chart.daily.new_user : chart.monthly.new_user,
          label: 'New user'
        }
      ],
      labels: daily ? chart.daily.labels : chart.monthly.labels
    }
  }

  const toggleDailyOrMonthly = () => {
    setDaily(!daily)
  }

  const chartOptions = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <Button endIcon={<ArrowDropDownIcon />} size="small" variant="text" onClick={toggleDailyOrMonthly}>
            Switch to {daily ? 'Last 7 months' : 'Last 7 days'}
          </Button>
        }
        title="Latest Statistics"
      />
      <Divider />
      <CardContent>
        <Box height={400} position="relative">
          <Bar data={data()} options={chartOptions} />
        </Box>
      </CardContent>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          onClick={() => {
            props.history.push('/admin/users')
          }}
        >
          Overview
        </Button>
      </Box>
    </Card>
  )
}

Statistics.propTypes = {
  className: PropTypes.string,
  statistics: PropTypes.object
}

export default Statistics
