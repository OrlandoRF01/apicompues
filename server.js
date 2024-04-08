import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const port = 8080;
const app = express();

app.use(bodyParser.json());

// Funcion encargada de leer el archivo DATA.JSON que contiene
// algunos datos referentes a la API
const readData = () => {
    try {
        const data = fs.readFileSync('data.json');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return { pedidos: [] };
    }
};

// Funcion encargada de escribir dentro del archivo DATA.JSON
const writeData = (data) => {
    try {
        fs.writeFileSync('data.json', JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
}

/**
 * Creacion de rutas
 * 1. Ruta principal, solo muestra un mensaje en el navegador
 * 2. Ruta que muestra los datos de la API, los datos se obtienen mediante el
 *    metodo GET
 * 3. Ruta que muestra un valor en especifico mediante el id usando el metodo GET
 * 4. Ruta encargada de almacenar un nuevo valor dentro de la API mediante el metodo
 *    POST
 * 5. Ruta encargada de modificar el valor de un dato mediante el id usando el metodo PUT
 * 6. Ruta encargada de eliminar un valor mediante el id usando el metodo DELETE
*/
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.get('/pedidos', (req, res) => {
    const data = readData();
    res.json(data.pedidos);
});

app.get('/pedidos/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const pedido = data.pedidos.find((pedido) => pedido.id === id);
    res.json(pedido);
});

app.post('/pedidos', (req, res) => {
    const data = readData();
    const body = req.body;
    const newPedido = {
        id: data.pedidos.length + 1,
        ...body,
    };
    data.pedidos.push(newPedido);
    writeData(data);
    res.json(newPedido);
});

app.put('/pedidos/:id', (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const pedidoIndex = data.pedidos.findIndex((pedido) => pedido.id === id);
    data.pedidos[pedidoIndex] = {
        ...data.pedidos[pedidoIndex],
        ...body,
    };

    writeData(data);
    res.json({ message: "Pedido updated successfully." })
});

app.delete('/pedidos/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const pedidoIndex = data.pedidos.findIndex((pedido) => pedido.id === id);
    data.pedidos.splice(pedidoIndex, 1);
    writeData(data);
    res.json({ message: "Pedido deleted successfully" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
