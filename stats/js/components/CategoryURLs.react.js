import React from 'react';
import TreeStore from '../stores/TreeStore';

export default class CategoryURLs extends React.Component {
	
	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this.state = {}
		this.state.urls = TreeStore.urls();
	}
	
	componentDidMount(){
		TreeStore.addChangeListener(this._onChange);
	}
	
	componentWillUnmount(){
		TreeStore.removeChangeListener(this._onChange);
	}
	
	render(){		
	
		let maxheight = {
			height: 240,
			overflowY: 'auto',
			overflowX: 'hidden',
		}
		
  		let urls = this.state.urls ? this.state.urls.map( (url, i)=>{
  			let style={
  				fontSize: "0.6rem",
  			}
  			return <li style={style} key={i}>{url}</li>
  		}) : [];
  		
		return	<ul className="no-bullet" style={maxheight}>
               		{urls}
               	</ul> 
	}
	
	_onChange(){
		this.setState({urls: TreeStore.urls()});
	}

}