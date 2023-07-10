import fs from 'fs'

export class CartManager{
    constructor(ruta){
        this.path=ruta
    }
  
  getCartProducts = async (cid) => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const productDb = JSON.parse(data);
        const carrito = productDb[parseInt(cid) - 1]
        return carrito;
      }
      await fs.promises.writeFile(this.path, '[]', 'utf-8')
      return ['Su carrito se encuentra vacío']
    } catch (error) {
      console.log(error);
    }
  }

  createCart = async () => {
    const cart = {}

    if(fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      const cartDb = JSON.parse(data)

      cart.id = cartDb[cartDb.length -1].id + 1
      cart.products = []
      cartDb.push(cart)

      await fs.promises.writeFile(this.path, `${JSON.stringify(cartDb, null, '\t')}`, 'utf-8')
    } else {
      cart.id = 1
      cart.products = []
      const arrayCarrito = [cart]

      await fs.promises.writeFile(this.path, `${JSON.stringify(arrayCarrito, null, '\t')}`, 'utf-8')
    }
  }

  addToCart = async (cid, pid) => {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      const cartDb = JSON.parse(data)
      const carrito = cartDb[parseInt(cid) - 1]
      const idx = carrito.products.findIndex(product => product.id === parseInt(pid))
      if (idx !== -1) {
        const product = carrito.products[idx]
        console.log(product);
        product.quantity++
        carrito.products[idx] = product
      } else {
        const product = {}
        product.id = parseInt(pid)
        product.quantity = 1
        carrito.products = [...carrito.products, product]
      }

      cartDb[parseInt(cid) - 1] = carrito

      await fs.promises.writeFile(this.path, JSON.stringify(cartDb, null, '\t'), 'utf-8')
    } catch (error) {
      console.log(error);
    }
  }

}