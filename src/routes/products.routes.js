import { Router } from 'express'
import { ProductManager } from '../managers/ProductManager.js'

const router = Router()

const productManager = new ProductManager('./datos/Productos.json')

router.get('/', async (req, res) => {
  const { limit } = req.query

  try {
    const data = await productManager.getProducts()

    limit ? res.status(200).send(data.slice(0,limit)) : res.send(data)
  } catch (error) {
    console.log(error);
  }
})

router.get('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid)

  try {
    const data = await productManager.getProductById(pid)
    if(!data){
      res.status(401).send('No existe el producto')
    }else{
      res.status(200).send(data)
    }
  }catch (error) {
    console.log(error);
  }
})

router.post('/', async (req, res) => {
  let newItem = req.body
  newItem.status = true
  if (!newItem.thumbnail){
    newItem.thumbnail=[]
  }
  //VALIDACIONES
  if (!newItem.title || !newItem.description || !newItem.price || !newItem.code || !newItem.stock || !newItem.category)  {
    return res.status(402).send('Error: Todos los campos son obligatorios.')
  }
  //VALIDACIONES
  let productDb = await productManager.getProducts()
  const data = await productDb.find(product => product.code === newItem.code)

  if (data) {
     res.status(403).send('El código de producto ya existe')
  } else {
    try {
      await productManager.addProduct(newItem)
      res.status(200).send('Producto agregado')
    } catch (error) {
      console.log(error);
    }
  }
})

router.put('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid)
  const data = req.body

  try{
    const product = await productManager.getProductById(pid)
    if(!product){
       return res.status(401).send('No se encontró el producto a actualizar')
    }else{
      product.title = data.title || product.title
      product.description = data.description || product.description
      product.price = data.price || product.price
      product.code = data.code || product.code
      product.stock = data.stock || product.stock
      product.category = data.category || product.category
      product.thumbnail = data.thumbnail || product.thumbnail
      product.status = data.status || product.status
      await productManager.updateProduct(pid, product)
      res.status(200).send('Producto actualizado')
    }
  } catch (error) {
    console.log(error);
  }
})

router.delete('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid)

  try {
    const producto = await productManager.getProductById(pid)
    if(!producto){
      res.status(401).send('No se encontró el producto a eliminar')
    }else{
      await productManager.deleteProduct(pid)
      res.status(200).send('Producto eliminado')
    }
  } catch (error) {
    console.log(error);
  }
})

export default router