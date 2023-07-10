import { Router } from 'express'
import { CartManager } from '../CartManager.js'

const router = Router()

const cartManager = new CartManager('./Carrito.json')

router.post('/', async (req, res) => {
  await cartManager.createCart()
  res.send({mensaje: 'Carrito creado'})
})

router.get('/:cid', async (req, res) => {
  const { cid } = req.params

  try {
    const cartProducts = await cartManager.getCartProducts(cid)
    res.send({mensaje: `Lista de productos del carrito con id ${cid}`,
              productos: cartProducts.products})
  } catch (error) {
    console.log(error);
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params

  try {
    await cartManager.addToCart(cid, pid)
    res.send({mensaje: 'Producto agregado al carrito'})
  } catch (error) {
    console.log(error);
  }
})

export default router