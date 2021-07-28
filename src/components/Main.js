import React, {Component} from 'react';
import { Row, Col } from 'antd';
import axios from 'axios';

import SatSetting from './SatSetting';
import SatelliteList from "./SatelliteList";
import WorldMap from "./WorldMap";
import {STARLINK_CATEGORY, NEARBY_SATELLITE, SAT_API_KEY} from '../constants';

class Main extends Component {
    state = {
        settings: null,
        satInfo: null,
        isLoading: null,
        satList: null
    }
    render() {
        const {satInfo, isLoading, settings, satList} = this.state;
        return (
            <Row className='main'>
                <Col span={8}>
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList satInfo={satInfo}
                                   isLoad={isLoading}
                                   onShowMap={this.showMap}
                    />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap
                        satData = {satList}
                        observerData = {settings}
                    />
                </Col>
            </Row>
        );
    }
    showMap = (selected) => {
        console.log('show on map', selected)
        this.setState(pre => ({
            ...pre,
            satList: [...selected] // ... makes it a new object instead of a reference
        }))
    }
    showNearbySatellite = setting => {
        console.log(setting);
        this.setState({settings: setting});
        this.fetchSatellite(setting);
    }
    fetchSatellite = setting => {
        // get parameters for api
        const {altitude, elevation, latitude, longitude} = setting;
        // url
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`
        //
        // request
        this.setState({isLoading: true})
        axios.get(url)
            .then(response => {
                console.log(response);
                this.setState({satInfo: response.data, isLoading: false})
            })
            .catch(err => {
                console.log(`fetch satellite error ${err}`)
                this.setState({isLoading: false})
            })
    }
}

export default Main;