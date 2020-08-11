var params = new URLSearchParams(location.search);
var desknumber = params.get('desk');

document.getElementById("desk").innerHTML = "Desk " + desknumber;

function requestTicket() {
    socket.emit('requestTicket', desknumber);
};

var socket = io();

// escuchar 
socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
})

socket.on('sendTicket', function(ticketnumber) {
    if (ticketnumber != null) {
        document.getElementById("currentTicket").innerHTML = "Ticket " + ticketnumber;
    } else {
        document.getElementById("currentTicket").innerHTML = "....";
    }
})