/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Router,Link, Route, hashHistory } from 'react-router';
import * as HTML from './HTML';
import Socket from './Socket';
import { Dispositivos } from './Dispositivos';
import { SalidasDispositivo, SalidasActivas } from './Salidas';

var menu = [
  {
    "text": "Dispositivos",
    "url": "/Dispositivos"
  },
  {
    "text": "Luces encendidas",
    "url": "/Dispositivos/salidasOn"
  },
  {
    "text": "Tareas programadas",
    "url": "/Tareas"
  }
];

export class DB {
	constructor() {
		this.db = null;
	}
	static get() {
		return new Promise((resolve, reject) => {
	    	Socket.listen('DBUpdated', ( db ) => { 
	    		this.db = db;
	    		resolve( db ); 
	    	});
	    });
	}
	static update( db ) {
		Socket.emit('updateDB', db );
	}
}

class Home extends Component {
	render() { 
		return ( <HTML.ListaLinks items={ menu } /> ); 
	}
};

class Arduinode extends Component {
	constructor( props ) {
		super( props );
		this.state = { dispositivos: [] };
		this.updateDB = this.updateDB.bind(this);
	}
	componentWillMount() {
		DB.get().then(( data )=> {
			this.setState({ dispositivos: data });
		});
	}
	updateDB() {
		DB.update( this.state.dispositivos );
	}
	render() {
		const This = this;
		return (
			<div className="Arduinode">
				
				<HTML.Header titulo="Home" />

				<div className="container">
					<Router history={ hashHistory }>
						<Route path="/" component={ Home } />
						<Route root={This} path="Dispositivos" component={ Dispositivos } />
						<Route root={this} path="Dispositivos/salidasOn" component={ SalidasActivas } />
						<Route root={This} path="Dispositivos/salidas/:ip" component={ SalidasDispositivo } />
					</Router>
				</div>
	  		</div>
		);
	}
}

export default Arduinode;