import React, {Component} from 'react';
import {Button, Spin, List, Avatar, Checkbox} from 'antd';
import satellite from '../assets/images/satellite.svg' // Otherwise the image will not show

class SatelliteList extends Component {
    state = {
        selected: []

    }
    render() {
        const satList = this.props.satInfo ? this.props.satInfo.above : [];
        const {isLoad} = this.props;
        return (
            <div className="sat-list-box">
                <div className="btn-container">
                    <Button type="primary"
                            disabled={this.state.selected.length === 0}
                            className="sat-list-btn"
                            size="large"
                            onClick={this.onShowSatMap}>
                        Track on the Map
                    </Button>
                </div>
                <hr/>
                {
                    isLoad? <div className="spin-box">
                                <Spin tip="Loading Data"></Spin>
                            </div>
                        :
                        <div>
                            <List className="sat-list"
                                  itemLayout = "horizontal"
                                  dataSource={satList}
                                  renderItem={ item => (
                                      <List.Item actions = {
                                          [
                                              <Checkbox
                                                  dataInfo = {item}
                                                  onChange = {this.onChange}/>
                                          ]
                                      }>
                                          <List.Item.Meta
                                              title={<p>{item.satname}</p>}
                                              avatar={<Avatar size={50} src={satellite}/>}
                                              description={`Launch Date: ${item.launchDate}`}
                                          />
                                      </List.Item>
                                  )
                                  }

                            />
                        </div>
                }

            </div>
        );
    }
    onShowSatMap = () => {
        this.props.onShowMap(this.state.selected)
    }

    onChange = e => {
        console.log(e.target)
        const {dataInfo, checked} = e.target;
        const {selected} = this.state;
        // Add or Remove from selected
        const list = this.addOrRemove(dataInfo, checked, selected)
        this.setState({selected: list})
    }
    addOrRemove = (item, status, list) => {
        const found = list.some(entry => entry.satid === item.satid)
        if (status && !found) {
            // add to list
            list = [...list, item]
        }
        if (!status && found) {
            // remove from list
            list = list.filter(entry => entry.satid !== item.satid)
        }
        return list;
    }
}

export default SatelliteList;