const fs = require('fs')

function resetFile(pathFile, obj) {
    let jsonData = JSON.stringify(obj, null, 2);
    fs.writeFileSync(pathFile, jsonData, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

function jsonReader(pathFile, cb) {
    fs.readFile(pathFile, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch (err) {
            return cb && cb(err)
        }
    })
}

//para añadir un ticket a la cola de espera

function addTicket(pathFile, obj) {
    jsonReader(pathFile, (err, res) => {
        if (err) {
            console.log('Error reading file:', err)
            return
        }

       
        res.tickets.push(obj);        
        fs.writeFileSync(pathFile, JSON.stringify(res, null, 2), (err) => {
            if (err) {
                console.log('Error writing file:', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    })
};

//para acutalizar el ultimo ticket de la cola

function addLastTicket(pathFile, num) {
    jsonReader(pathFile, (err, res) => {
        if (err) {
            console.log('Error reading file:', err)
            return
        }

        res.lastticket = num;
        fs.writeFileSync(pathFile, JSON.stringify(res, null, 2), (err) => {
            if (err) {
                console.log('Error writing file:', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    })
};

//para agregar un turno a la cola de attendeds

function addAtended(pathFile, obj) {
    jsonReader(pathFile, (err, res) => {
        if (err) {
            console.log('Error reading file:', err)
            return
        }

        res.attendeds.push(obj);
        fs.writeFileSync(pathFile, JSON.stringify(res, null, 2), (err) => {
            if (err) {
                console.log('Error writing file:', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    })
};

//para eliminar ticket de la cola de tickets

function removeTicket(pathFile) {
    jsonReader(pathFile, (err, res) => {
        if (err) {
            console.log('Error reading file:', err)
            return
        }

        res.tickets.shift();
        fs.writeFileSync(pathFile, JSON.stringify(res, null, 2), (err) => {
            if (err) {
                console.log('Error writing file:', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    })
};


// le damos forma al json para crear el archivo persistente (donde guardar la cola tickets, attendeds y el ultimo ticket)

/*
resetFile("./data.json", {
    tickets: [],
    lastticket: 0,
    attendeds: []
})
*/

module.exports = {
    addTicket,
    addLastTicket,
    addAtended,
    jsonReader,
    removeTicket
};