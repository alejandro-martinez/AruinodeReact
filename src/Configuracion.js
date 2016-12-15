/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Router,Link, Route, hashHistory } from 'react-router';
import * as HTML from './HTML';
import Socket from './Socket';
import Utils from './Utils';

export class Configuracion extends Component {
	constructor( props ) {
		super( props );
		props.route.root.setState({ 
			page: "Configuración",
			showAddIcon: false,
			showTimerIcon: false
		});
		this.resetServer = this.resetServer.bind(this);
		this.items = [
		  {
		    "text": "Log sistema",
		    "url": "/Configuracion/log"
		  },
		  {
		    "text": "Ajustes servidor",
		    "url": "/Configuracion/ajustes"
		  }
		];
		this.items.push({
			"text": "Resetear servidor",
			"onClick": this.resetServer,
			"url": "javascript:void(0)"
		});
	}
	resetServer(e) {
		e.preventDefault();
		Socket.emit('resetServer');
	}
	render() { return ( <HTML.ListaLinks root={ this.props.route.root } items={ this.items } /> ); }
}

export class Log extends Component {
	constructor( props ) {
		super( props );
		props.route.root.setState({ 
			page: "Log sistema",
			showAddIcon: false,
			showTimerIcon: false
		});
		this.state = { logFile: null };
		Socket.listen('logUpdated', ( data ) => {
			this.setState({'logFile': data});
		});
	}
	componentDidMount() {
		Socket.emit('getLog');
	}
	generateLine( text ) {
		return <p> { text }</p>;
	}
	render() { 
		if ( this.state.logFile !== null) {
			var lines = this.state.logFile.map( this.generateLine );

			return ( <div className="logContainer"> { lines }</div> ); 
		}
		return null;
	}
	
}

export class Ajustes extends Component {
	constructor( props ) {
		super( props );
		props.route.root.setState({ 
			page: "Ajustes servidor",
			showAddIcon: false,
			showTimerIcon: false
		});
		this.state = { edit: false };
	}
	render() { 
		
		if ( this.props.route.root.state.config ) {
			return ( 
				<div className={"ajustes show" + this.props.route.root.adminMode}>
					<HTML.EditContainer edit={ this.state.edit }>
						<label> Clave App 
							<HTML.EditRow edit={ this.state.edit }
									 root={ this.props.route.root }
									 inputKey='claveApp'
									 model={ this.props.route.root.state.config }>
							</HTML.EditRow>
						</label>
						<label> Timeout de conexión con dispositivos Arduino (ms)
							<HTML.EditRow edit={ this.state.edit }
									 root={ this.props.route.root }
									 inputKey='socketTimeout'
									 model={ this.props.route.root.state.config }>
							</HTML.EditRow>
						</label>
						<label> Retardo inicial de escaneo de tareas (ms)
							<HTML.EditRow edit={ this.state.edit }
									 root={ this.props.route.root }
									 inputKey='tiempoEscaneoTareas'
									 model={ this.props.route.root.state.config }>
							</HTML.EditRow>
						</label>
					</HTML.EditContainer>
				</div>
			);
		}
		return null;
	}
	
}


