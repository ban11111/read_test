import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { Doughnut } from 'react-chartjs-2'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  makeStyles,
  useTheme
} from '@material-ui/core'
import LaptopMacIcon from '@material-ui/icons/LaptopMac'
import PhoneIcon from '@material-ui/icons/Phone'
import TabletIcon from '@material-ui/icons/Tablet'
import QuestionIcon from '@material-ui/icons/Help'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}))

const defaultDevice = { desktop: 0, tablet: 0, mobile: 0, unknown: 0 }

const TrafficByDevice = ({ className, statistics, ...rest }) => {
  const classes = useStyles()
  const theme = useTheme()

  const device = !!statistics ? statistics.device : defaultDevice
  const sum = device.unknown + device.mobile + device.tablet + device.desktop || 1

  const data = () => {
    return {
      datasets: [
        {
          data: [device.desktop, device.tablet, device.mobile, device.unknown],
          backgroundColor: [colors.indigo[500], colors.red[600], colors.orange[600], colors.grey[400]],
          borderWidth: 4,
          borderColor: colors.common.white,
          hoverBorderColor: colors.common.white
        }
      ],
      labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown']
    }
  }
  const options = {
    animation: false,
    cutoutPercentage: 82,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
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

  const devices = [
    {
      title: 'Desktop',
      value: ((device.desktop / sum) * 100).toFixed(1),
      icon: LaptopMacIcon,
      color: colors.indigo[500]
    },
    {
      title: 'Tablet',
      value: ((device.tablet / sum) * 100).toFixed(1),
      icon: TabletIcon,
      color: colors.red[600]
    },
    {
      title: 'Mobile',
      value: ((device.mobile / sum) * 100).toFixed(1),
      icon: PhoneIcon,
      color: colors.orange[600]
    },
    {
      title: 'Unknown',
      value: ((device.unknown / sum) * 100).toFixed(1),
      icon: QuestionIcon,
      color: colors.grey[600]
    }
  ]

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Traffic by Device" />
      <Divider />
      <CardContent>
        <Box height={300} position="relative">
          <Doughnut data={data} options={options} />
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          {devices.map(({ color, icon: Icon, title, value }) => (
            <Box key={title} p={0.5} textAlign="center">
              <Icon color="action" />
              <Typography color="textPrimary" variant="body1">
                {title}
              </Typography>
              <Typography style={{ color, fontSize: '1.7rem' }} variant="h5">
                {value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

TrafficByDevice.propTypes = {
  className: PropTypes.string,
  statistics: PropTypes.object
}

export default TrafficByDevice
