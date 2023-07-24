import { error } from 'console'
import fs from 'fs'

export class ProductManager{
    constructor(ruta){
        this.path=ruta
    }

    addProduct = async (producto) => {
        let productos = await this.getProducts()
        let yaEsta = productos.find(item => item.code == producto.code)
        try{
            if(!yaEsta){
                if(productos.length == 0){ 
                    producto.id=1
                }else{
                    producto.id=productos[productos.length-1].id + 1
                }
                productos.push(producto)
                await fs.promises.writeFile(this.path, JSON.stringify(productos, '\t'), 'utf-8')
            }
        }catch (error) {
            console.log(error)
        }
    }

    getProducts = async () => {
        try{
            if(!fs.existsSync(this.path)){
                await fs.promises.writeFile(this.path, '[]', 'utf-8')
            }
            let dataProductos = await fs.promises.readFile(this.path, 'utf-8')
            let productos = JSON.parse(dataProductos)
            return productos
        }catch (error) {
            console.log(error)
        }
    }

    getProductById = async (id) => {
        try{
            let productos = await this.getProducts()
            let yaEsta = productos.find(item => item.id == id)
            return yaEsta
        }catch (error) {
            console.log(error)
        }
        
    }
    
    updateProduct = async (id, productoActualizado) => {
        try{
            let productos = await this.getProducts()
            let index = await productos.findIndex(product => product.id == id)
            productos[index]=productoActualizado
            fs.promises.writeFile(this.path, JSON.stringify(productos, null,'\t'))
        }catch (error){
            console.log(error)
        }
    }

    deleteProduct = async (id) => {
        try{
            let productos = await this.getProducts()
            let index = await productos.findIndex(product => product.id == id)
            productos.splice(index, 1)
            fs.promises.writeFile(this.path, JSON.stringify(productos, null,'\t'))
        }catch (error){
            console.log(error)
        }
    }

}

//const products = new ProductManager('./Productos.json')
//products.addProduct('asd', 'dsa', '14.23', 'ert', 'qwa', 12).then(resp => console.log(resp))
//products.addProduct('asd', 'dsa', '14.23', 'ert', 'qwi', 12).then(resp => console.log(resp))
//products.getProducts().then(resp => console.log(resp))
//products.getProductById(2).then(resp => console.log(resp))
//products.updateProduct(2, {title: 'asd2', description: 'dsa2', price: '14.43', thumbnail: 'ert2', code: 'qwa2', stock: 24} ).then(resp => console.log(resp))
//products.deleteProduct(2).then(resp => console.log(resp))