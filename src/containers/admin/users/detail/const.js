import React from 'react'

const p = { style: { margin: 8 } }

export const columns = [
  {
    title: 'Word',
    dataIndex: 'word',
    key: 'word',
    render: text => <a>{text}</a>
  },
  {
    title: 'Audio',
    dataIndex: 'audio_url',
    key: 'audio_url',
    render: url => <a>{url ? 'yes' : 'no'}</a>
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
    render: duration => <span>{duration / 1000}秒</span>
  },
  {
    title: 'Action',
    dataIndex: 'audio_url',
    key: 'audio_url',
    render: url => {
      return <audio controls src={'/file/' + url} {...p} />
    }
  }
]
