import express from 'express'

import ProductManager from './ProductManager.js'

const app = express()
const PORT = 8080

const products = new ProductManager('../src/Productos.json')

app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log('Listo, app escuchando puerto: ', PORT);
})

app.get('/products', async (req, res)=>{
    const {limit} = req.query
    try{
        const data = await products.getProducts()
        limit ? res.send(data.filter(product => product.id <= limit)) : res.send(data)
    }catch (error){
        console.log(error)
    }
})

app.get('/products/:pid', async (req, res)=>{
    const {pid} = req.params
    let productos = await products.getProducts()
    let producto = productos.find(product => product.id === pid)
    console.log(producto)
    if(!producto) return res.send('No existe el producto')
    res.send(producto)
})