import { Router } from 'express'
import { CartManager } from '../managers/CartManager.js'

const router = Router()

const cartManager = new CartManager('./datos/Carrito.json')

router.post('/', async (req, res) => {
  try{
    await cartManager.createCart()
    res.status(200).send('Carrito creado')
  }catch (error) {
    console.log(error);
  }
  
})

router.get('/:cid', async (req, res) => {
  const cid = parseInt(req.params.cid)

  try {
    const cartProducts = await cartManager.getCartProducts(cid)
    if(!cartProducts){
      res.status(401).send('No se encontró el carrito indicado')
    }else{
      res.status(200).send({mensaje: `Lista de productos del carrito con id ${cid}`,
              productos: cartProducts.products})
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid)
  const pid = parseInt(req.params.pid)

  try {
    await cartManager.addToCart(cid, pid)
    res.status(200).send({mensaje: 'Producto agregado al carrito'})
  } catch (error) {
    console.log(error);
  }
})

export default router