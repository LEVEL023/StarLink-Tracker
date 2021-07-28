import React, {Component} from 'react';
import { Form, InputNumber, Button } from 'antd';

class SatSettingForm extends Component {
    showSatellite = (e) => {
        e.preventDefault(); // otherwise the page will refresh itself
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.onShow(values);
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 11 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 },
            },
        };
        return (
            <div>
                <Form {...formItemLayout} onSubmit = {this.showSatellite} className="sat-setting">
                    <Form.Item label="Longitude(degrees)">
                        {
                            getFieldDecorator('longitude', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your longitude'
                                    }
                                ],
                                initialValue: 70
                            })(<InputNumber min={-180} max={180}
                                            style={{width: "100%"}}
                                            placeholder="Please input Longitude"
                            />)
                        }
                    </Form.Item>
                    <Form.Item label="Latitude(degrees)">
                        {
                            getFieldDecorator("latitude", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input your Latitude",
                                    }
                                ],
                                initialValue: -40
                            })(<InputNumber placeholder="Please input Latitude"
                                            min={-90} max={90}
                                            style={{width: "100%"}}
                            />)
                        }
                    </Form.Item>

                    <Form.Item label="Elevation(meters)">
                        {
                            getFieldDecorator("elevation", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input your Elevation",
                                    }
                                ],
                                initialValue: 90
                            })(<InputNumber placeholder="Please input Elevation"
                                            min={-413} max={8850}
                                            style={{width: "100%"}}
                            />)
                        }
                    </Form.Item>

                    <Form.Item label="Altitude(degrees)">
                        {
                            getFieldDecorator("altitude", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input your Altitude",
                                    }
                                ],
                                initialValue: 90
                            })(<InputNumber placeholder="Please input Altitude"
                                            min={0} max={90}
                                            style={{width: "100%"}}
                            /> )
                        }
                    </Form.Item>

                    <Form.Item label="Duration(secs)">
                        {
                            getFieldDecorator("duration", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input your Duration",
                                    }
                                ],
                                initialValue: 2
                            })(<InputNumber placeholder="Please input Duration" min={0} max={90} style={{width: "100%"}} />)
                        }
                    </Form.Item>
                    <Form.Item className="show-nearby">
                        <Button type="primary" htmlType="submit" style={{textAlign: "center"}}>
                            Find Nearby Satellite
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const SatSetting = Form.create({name: 'satellite-setting'})(SatSettingForm)

export default SatSetting;