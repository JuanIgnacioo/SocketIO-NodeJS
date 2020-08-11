const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const DDBB = require("./DDBBfunctions");
const pathFile = './datos.json'

const path = require('path');

const app = express();

let server = http.createServer(app);

const publicPath = path.resolve(__dirname, './public');
const port = process.env.PORT || 3001;

app.use(express.static(publicPath));

let io = socketIO(server)

// inicializamos la cola de tickets, ultimo ticket y la cola de atendidos
// con los datos que posee el JSON

let colaTickets;
let ultimoTicket;
let colaAtendidos;

DDBB.jsonReader(pathFile, (err, obj) => {
    if (err) {
        console.log('Error reading file:', err)
        return
    }

    colaTickets = obj.tickets;
    ultimoTicket = obj.lastticket;
    colaAtendidos = obj.attendeds;
});

io.on('connection', (client) => {
    console.log(`Usuario ${client.id} conectado`);

    // enviamos la cantidad de elementos de la cola de tickets al cliente

    client.emit('stateQueue', ultimoTicket);

    //enviamos la cola de tickets attendeds 

    client.emit('updateShiftViewer', colaAtendidos);

    client.on('disconnect', () => {
        console.log(`Usuario ${client.id} desconectado`);
    });

    // escuchamos la peticion del cliente para cargar la cola de tickets

    client.on('loadTicket', (ticketnumber) => {

        //guardamos el ultimo ticketnumber de ticket para mantener el contador, lo añadimos a la cola de tickets y actualizamos json

        colaTickets.push(ticketnumber);        
        DDBB.addTicket(pathFile, ticketnumber);

        ultimoTicket = ticketnumber;
        console.log(ultimoTicket);

        DDBB.addLastTicket(pathFile, ultimoTicket);


        console.log(`Cola tickets: ${colaTickets}`);
    })

    // escuchamos la peticion del escritorio para atender un ticket

    client.on('requestTicket', (desknumber) => {

        //eliminamos ticket de la cola y actualizamos json

        let ticketnumber = colaTickets.shift()
        DDBB.removeTicket(pathFile);

        //enviamos el ticketnumber de ticket al escritorio para atenderlo

        client.emit('sendTicket', ticketnumber)

        if (ticketnumber != null) {
            let turn = {
                ticketnumber,
                desknumber
            }

            // añadimos ticket a la cola y actualizamos el json

            colaAtendidos.push(turn);
            DDBB.addAtended(pathFile, turn);


            // enviamos mensaje para actualizar la pantalla de turns
            io.sockets.emit('showNewTurn', turn)

        }

    })

})

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});