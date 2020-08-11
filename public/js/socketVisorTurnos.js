var socket = io();

//para cargar los ultimos 4 datos de la cola de atendidos en pantalla

function loadCellData(queueattended) {
    var data;
    var lastfourtickets;
    if (queueattended.length > 4) {
        lastfourtickets = queueattended.slice(1).slice(-4);
    } else {
        lastfourtickets = queueattended;
    }
    console.log(lastfourtickets);
    var limit = lastfourtickets.length - 1
    console.log(limit);

    var j = 1;
    for (var i = limit; i >= 0; i--) {
        data = lastfourtickets[i];
        document.getElementById("lblTicket" + j).innerHTML = "Ticket " + data.ticketnumber
        document.getElementById("lblDesk" + j).innerHTML = "Desk " + data.desknumber
        j++;
    }
}

// para reordenar los datos en pantalla al agregarse un nuevo turno

function moveCellData(idOrigin, idDestination) {
    console.log("lblTicket" + idOrigin);
    document.getElementById("lblTicket" + idDestination).innerHTML = document.getElementById("lblTicket" + idOrigin).innerText
    document.getElementById("lblDesk" + idDestination).innerHTML = document.getElementById("lblDesk" + idOrigin).innerText
}

// escuchar 
socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
})

// escuchamos la peticion para añadir nuevo turno a la pantalla

socket.on('showNewTurn', function(data) {
    moveCellData("3", "4");
    moveCellData("2", "3");
    moveCellData("1", "2");
    document.getElementById("lblTicket1").innerHTML = "Ticket " + data.ticketnumber;
    document.getElementById("lblDesk1").innerHTML = "Desk " + data.desknumber;

})

// escuchamos la peticion para mantener actualizados los datos en caso de perdida de conexion

socket.on('updateShiftViewer', function(queueattended) {
    if (queueattended.length > 0) {
        loadCellData(queueattended);
    }
})