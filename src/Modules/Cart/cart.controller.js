import { Cart } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";


/**
 * @api {POST}  /carts/add Add to cart
 */
export const AddToCart = async (req, res, next) => {
    const userId = req.authUser._id;
    const { quantity } = req.body;
    const { productId } = req.params;

    const product = await Product.findOne({ _id: productId, stock: { $gte: quantity } })
    if (!productId) {
        return next(new ErrorClass("Product not available", 404, "Product not available"))
    }

    const cart = await Cart.findOne({ userId })
    if (!cart) {
        const subTotal = product.appliedPrice * quantity
        const newCart = new Cart({
            userId,
            products: [{
                productId: product._id,
                quantity,
                price: product.appliedPrice
            }],
            subTotal
        })

        await newCart.save();
        res.status(201).json({ message: "Product added to cart", cart: newCart })
    }
    const isProductExist = cart.products.find(p => p.productId == productId)
    if (isProductExist) {
        return next(new ErrorClass("Product already in car", 404, "Product already in car"))
    }
    cart.products.push({ 
        productId: product._id,
        quantity,
        price: product.appliedPrice
    })
    cart.subTotal += product.appliedPrice * quantity;

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart })
}


/**
 * @api {PUT}  /carts/remove remove from cart
 */


/**
 * @api {POST}  /carts/update update to cart
 */


/**
 * @api {GET}  /carts Get cart
 */