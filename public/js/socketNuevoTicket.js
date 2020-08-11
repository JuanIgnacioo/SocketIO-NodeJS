var socket = io();
var count = 0;

function addTicket() {
    count++;
    document.getElementById("lblNewTicket").innerHTML = "Ticket " + count;
    socket.emit('loadTicket', count)
}

// escuchar 
socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
})

//checkeamos el estado de la cola de tickets 

socket.on('stateQueue', function(lastticket) {
    count = lastticket;
})