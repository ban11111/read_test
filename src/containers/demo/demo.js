import React, {Component} from "react";
import "./index.css";
import api from '../../api'

import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/extensions/waveview'

import {makeStyles} from '@material-ui/core/styles';
import {green} from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress'
import {Fab, Button, Container, Grid, Paper} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

export default class demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rec: null,
            status: 'init',
            src: '',
        }
    }

    wave;
    rec = Recorder({
        type: 'mp3',
        bitRate: 128,
        sampleRate: 16000,
        disableEnvInFix: false,
        onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate) => {
            this.wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);//输入音频数据，更新显示波形
        }
    })

    renderVisualization = (hid) => {
        return <Paper style={{height: '50px'}} className='wave-box'/>
    }

    componentDidMount() {
        const t = setTimeout(() => {
            console.log("无法录音：权限请求被忽略（超时假装手动点击了确认对话框）", 1);
        }, 8000);

        console.log("正在打开录音，请求麦克风权限...");
        this.rec.open(() => {
            clearTimeout(t);
            console.log("已打开录音，可以点击开始了", 2);
            this.wave = Recorder.WaveView({elem: ".wave-box"}); // 创建wave对象

            //rec.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程
        }, (msg, isUserNotAllow) => {//用户拒绝未授权或不支持
            clearTimeout(t);
            console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg, 1);
        });
    }

    uploadFile = (e) => {
        const formData = new FormData()
        formData.append('record', e)
        api.uploadAudio(formData).then(resp => {
            console.log('resp', resp)
        })
    }

    uploadFile2 = (blob, duration) => {
        const formData = new FormData()
        formData.append('record', blob, duration + '.mp3')
        api.uploadAudio(formData).then(resp => {
            console.log('resp', resp)
        })
    }

    recStart = (call) => {
        call || (call = function (msg) {
            msg && console.log(msg, 1);
        });
        if (this.rec && Recorder.IsOpen()) {
            this.rec.start();
            const set = this.rec.set;
            console.log("录制中：" + set.type + " " + set.sampleRate + "hz " + set.bitRate + "kbps");
        } else {
            call("未打开录音")
        }
    }

    mouseDown = () => {
        this.setState({status: 'recording'})
        this.recStart()
        document.onmouseup = this.touchUp
    }

    touchUp = () => {
        this.setState({status: 'stopped'}, () => {
            document.onmouseup = null
        })
        this.recStop()

    }

    touchDown = () => {
        this.setState({status: 'recording'})
        this.recStart()
    }

    recStop() {
        this.rec.stop((blob, duration) => {
            // this.rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
            this.uploadFile2(blob, duration)
            this.setState({src: window.URL.createObjectURL(blob)}, () => {
                console.log("src", this.state.src)
            })
            // this.rec = null;
        }, (msg) => {
            console.log("录音失败:" + msg, 1);
            // this.rec.close();//可以通过stop方法的第3个参数来自动调用close
            // this.rec = null;
        });
    }

    playAndStop = () => {
        this.refs.audio.play()
    }

    render() {
        const {status, loadings, src} = this.state;
        const recording = status === 'recording'
        return (
            <Container maxWidth='sm'>
                <div>
                    <Button type="primary" onClick={() => this.recStart()}>
                        New Start
                    </Button>
                    <Button type="primary" onClick={() => this.recStop()}>
                        New Stop
                    </Button>
                </div>
                <Grid container spacing={2} className={useStyles.wrapper} alignItems={'center'}>
                    <Grid item xs={2}>
                        <Fab
                            variant="extended"
                            onMouseDown={this.mouseDown}
                            onTouchStart={this.touchDown}
                            onTouchEnd={this.touchUp}
                            size="medium"
                            color={recording ? 'default' : 'primary'}
                        >{recording ? '松开结束' : '按住录音'}</Fab>
                        {/*{recording && <CircularProgress size={24} className={useStyles.buttonProgress}/>}*/}
                    </Grid>
                    <Grid item xs={7}>
                        {this.renderVisualization()}
                    </Grid>
                    <Grid item xs={3} alignContent={'center'}>
                        <Button color='secondary' variant='contained' onClick={this.playAndStop}>Play</Button>
                    </Grid>
                    <audio controls ref={'audio'} src={src} style={{display: 'block'}}/>
                </Grid>
            </Container>
        );
    }
}
