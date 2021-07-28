import React, {Component} from 'react';
import {WORLD_MAP_URL, SATELLITE_POSITION_URL, SAT_API_KEY} from "../constants";
import {feature} from 'topojson-client';
import { geoKavrayskiy7 } from 'd3-geo-projection';
import { geoGraticule, geoPath } from 'd3-geo';
import { select as d3Select } from 'd3-selection';
import axios from "axios";
import { schemeCategory10 } from "d3-scale-chromatic";
import * as d3Scale from "d3-scale";
import { timeFormat as d3TimeFormat } from "d3-time-format";


const width = 960;
const height = 600; // originally 600

class WorldMap extends Component {
    constructor() {
        super();
        this.refMap = React.createRef();
        this.refTrack = React.createRef();
        this.state = {
            isLoading: false,
            isDrawing: false
        }
        this.color = d3Scale.scaleOrdinal(schemeCategory10);
    }
    render() {
        return (
            <div className = "map-box">
                <canvas className = "map" ref={this.refMap}/>
                <canvas className={"track"} ref={this.refTrack}/>
                <div className="hint" />
            </div>
        );
    }
    componentDidMount() {
        // fetch world map data
        axios.get(WORLD_MAP_URL)
            .then(response => {
                console.log(response);
                const {data} = response;
                console.log()
                const land = feature(data, data.objects.countries).features;
                // generate world map
                this.generateMap(land);
            })
            .catch(err => {
                console.log(`err in fetching world map data ${err}`)
            })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.satData !== this.props.satData) {
            const {
                latitude,
                longitude,
                elevation,
                duration
            } = this.props.observerData;
            const endTime = duration * 60;
            this.setState({isLoading: true});
            const urls = this.props.satData.map( sat => {
                const {satid} = sat;
                const url = `/api/${SATELLITE_POSITION_URL}/${satid}/${latitude}/${longitude}/${elevation}/${endTime}/&apiKey=${SAT_API_KEY}`;
                return axios.get(url);
            })
            Promise.all(urls)
                .then( res => {
                    console.log(res)
                    const arr = res.map( sat => sat.data);
                    console.log(arr);
                    this.setState({
                        isLoading: false,
                        isDrawing: true
                    })
                    // draw on canvas
                    if (!prevState.isDrawing) {
                        // can draw
                        this.track(arr);
                    } else {
                        const oHint = document.getElementsByClassName("hint")[0];
                        oHint.innerHTML =
                            "Please wait for these satellite animations to finish before selecting new ones!";
                    }
                })
                .catch( err => {
                    console.log(`err in fetch position ${err}`)
                })
        }
    }
    track = data => {
        if (!data[0].hasOwnProperty("positions")) {
            throw new Error("no position data");
            return;
        }
        const len = data[0].positions.length;
        const {duration} = this.props.observerData;
        // get track canvas
        const {context2} = this.map;
        // record current time
        let now = new Date();
        let i = 0;
        let timer = setInterval(() => {
            let ct = new Date();
            let timePassed = i === 0 ? 0 : ct - now;
            let time = new Date(now.getTime() + 60 * timePassed);
            context2.clearRect(0, 0, width, height);
            context2.font = "bold 14px sans-serif";
            context2.fillStyle = "#333";
            context2.textAlign = "center";
            context2.fillText(d3TimeFormat(time), width / 2, 10);
            if (i >= len) {
                clearInterval(timer);
                this.setState({ isDrawing: false });
                const oHint = document.getElementsByClassName("hint")[0];
                oHint.innerHTML = "";
                return;
            }
            data.forEach(sat => {
                const {info, positions} = sat;
                this.draw(info, positions[i]);
            });
            i += 60;
        }, 1000)
    }
    draw = (sat, pos) => {
        const { satlongitude, satlatitude } = pos;

        if (!satlongitude || !satlatitude) return;

        const { satname } = sat;
        const nameWithNumber = satname.match(/\d+/g).join("");

        const { projection, context2 } = this.map;
        const xy = projection([satlongitude, satlatitude]);

        context2.fillStyle = this.color(nameWithNumber);
        context2.beginPath();
        context2.arc(xy[0], xy[1], 4, 0, 2 * Math.PI);
        context2.fill();

        context2.font = "bold 11px sans-serif";
        context2.textAlign = "center";
        context2.fillText(nameWithNumber, xy[0], xy[1] + 14);
    }

    generateMap = land => {
        // use ref to locate canvas in WorldMap.js
        const projection = geoKavrayskiy7()
            .scale(170)
            .translate([width / 2, height / 2])
            .precision(0.1)
        // find canvas
        const canvas = d3Select(this.refMap.current)
            .attr("width", width)
            .attr("height", height)
        const canvas2 = d3Select(this.refTrack.current)
            .attr("width", width)
            .attr("height", height)
        let context = canvas.node().getContext("2d");
        let context2 = canvas2.node().getContext("2d");
        // console.log(context)
        let path = geoPath().projection(projection).context(context); // pen + canvas + content
        const graticule = geoGraticule();

        land.forEach(ele => {
            context.fillStyle = '#B3DDEF';
            context.strokeStyle = '#000';
            context.globalAlpha = 0.7;
            context.beginPath();
            path(ele);
            context.fill();
            context.stroke();

            context.strokeStyle = 'rgba(220, 220, 220, 0.1)';
            context.beginPath();
            path(graticule());
            context.lineWidth = 0.1;
            context.stroke();

            context.beginPath();
            context.lineWidth = 0.5;
            path(graticule.outline());
            context.stroke();

        })
        this.map = {
            projection: projection,
            graticule: graticule,
            context: context,
            context2: context2
        }
    }
}

export default WorldMap;