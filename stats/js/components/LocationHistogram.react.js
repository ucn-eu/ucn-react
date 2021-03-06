import React from 'react';
import GoogleMapsLoader from 'google-maps';
import HistogramStore from '../stores/HistogramStore';
import YAxes from './YAxes.react';
import d3 from 'd3';
import {colour} from '../utils/utils';
import {zoneSelected} from '../actions/ZoneActions';

let map, googleapi, marker;
let circles = {};
let xscale = d3.scale.linear();
let yscale = d3.scale.linear();

		
export default class LocationHistogram extends React.Component {
	
	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this.state = {}
		this.state.data = HistogramStore.locations();
	}
	
	componentDidMount(){
		HistogramStore.addChangeListener(this._onChange);

		GoogleMapsLoader.load(function(google){
			googleapi = google;

			map = new google.maps.Map(document.getElementById("map"),
			{
				center: {lat: 52.95450, lng: -1.15749},
				zoom: 18
			});
	
			marker = new google.maps.Marker({
				position: {lat: 52.95450, lng: -1.15749},
				map: map,
				title: "here you are",
			});
		});
	}
	
	componentWillUnmount(){
		HistogramStore.removeChangeListener(this._onChange);
	}
	
	render(){		
		
		let width = this.props.width, height = this.props.height;
  		
  		let marginright = 0, marginleft = 20, marginbottom = 0, margintop = 40;
		
		let chartprops = {
			width: width+marginleft+marginright,
			height: height+margintop+marginbottom,
		}
		
		let gprops = {
			transform: 'translate(' + marginleft  + ',' + marginbottom + ')'
		}
		
		xscale.domain([0, this.state.data.length]);
		xscale.range([0,this.props.width]);
		
		yscale.domain([0,100]);
		yscale.range([0,this.props.height]);
		
		this.state.data.map((zone,i)=>{
			
			if (googleapi && map){
				if (!circles[zone.name]){
					let circle = new googleapi.maps.Circle({
						strokeColor: colour(zone.name),
						strokeOpacity: 1.0,
						strokeWeight: 2,
						fillColor: colour(zone.name),
						fillOpacity: 0.5,
						map: map,
						center: {lat:zone.lat, lng: zone.lng},
						radius: 10,
					});
					
					googleapi.maps.event.addListener(circle, 'click', this._selectZone.bind(this,zone));
					circles[zone.name] = circle;
				}
			}
		});
			
		let bars = this.state.data.map((item,i)=>{
			let props = {
				key: i,
				x: xscale(i),
				y: this.props.height - yscale(item.value),
				width: this.props.width / this.state.data.length,
				height: yscale(item.value),
				onClick: this._selectZone.bind(this, item),
			}
			
			let style = {
				fill: colour(item.name),
				stroke: "#000"
			} 
			
			return <rect  {...props} style={style}/>
		});
		
		
		var scaleprops = {
			padding: 0,
			height: height,
			width: width,
		}
					
		var yaxiscale = d3.scale.linear();
		yaxiscale.domain([100,0]);
		yaxiscale.range([0, this.props.height]);
		
		return	<div>
					<h5>location <small>where browsing took place</small></h5>
					<hr/>
					<svg {...chartprops}>
						<g {...gprops}>
							{bars}
							<YAxes  yScale={yaxiscale} {...scaleprops}/>
						</g>
					</svg>
					
				</div>
	}
	
	_selectZone(zone){
		zoneSelected(zone);
		if (googleapi && map && zone.lat){
  			map.setCenter({lat: zone.lat, lng: zone.lng});
  			marker.setPosition({lat: zone.lat, lng: zone.lng});
  		}
	}
	
	_onChange(){
		this.setState({data:  HistogramStore.locations()});
	}

}