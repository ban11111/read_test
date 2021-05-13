import React from 'react'
import moment from 'moment'

const p = { style: { margin: 8 } }

export const columns = [
  {
    title: 'No.',
    dataIndex: 'word_index',
    key: 'word_index',
    render: index => {
      return index + 1
    }
  },
  {
    title: 'Time',
    dataIndex: 'created_at',
    key: 'created_at',
    render: time => moment(time).format('hh:mm:ss')
  },
  {
    title: 'Word',
    dataIndex: 'word',
    key: 'word',
    render: text => <span>{text}</span>
  },
  {
    title: 'Translation',
    dataIndex: 'translation',
    key: 'translation'
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
    render: duration => <span>{duration / 1000}s</span>
  },
  {
    title: 'Device',
    dataIndex: 'device',
    key: 'device'
  },
  {
    title: 'Action',
    dataIndex: 'audio_url',
    key: 'audio_url',
    fixed: 'right',
    render: url => (url ? <audio controls src={'/file/' + url} {...p} /> : '')
  }
]
