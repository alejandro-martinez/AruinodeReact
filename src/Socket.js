/*jshint esversion: 6 */
import io from 'socket.io-client'

// Inicializacion de socket para la comunicacion con el servidor
window.socket = io.connect( window.location.origin );

// Evento para mostrar / ocultar componente Loading
var showLoading = ( show ) => {
	document.dispatchEvent( new CustomEvent( "loadingEvent", { detail: show}) );
};

class SocketIO {
	emit( param, data ) {
		console.log("Emit",param)
		showLoading( true );
		window.socket.emit( param, data );
	}
	listen( param, callback) {
		var onResponse = function( data ) {
			console.log("Listen",param)
			showLoading( false );
			callback( data );
		};
		window.socket.removeListener( param ).on( param, onResponse);
	}
}
const Socket = new SocketIO();

export default Socket;