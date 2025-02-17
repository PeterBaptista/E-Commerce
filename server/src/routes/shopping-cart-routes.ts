import { Router } from "express";
import {
  addToCart,
  deleteFromCart,
  getAllCart,
  updateCartProduct,
  emptyShoppingCart,
  getCartProduct,
  checkoutCart
} from "../controllers/shopping-cart/shopping-cart-controllers";

const shoppingCartRouter = Router();

shoppingCartRouter.get("/", getAllCart);
shoppingCartRouter.get("/:productId", getCartProduct);
shoppingCartRouter.post("/add", addToCart);
shoppingCartRouter.post("/checkout", checkoutCart);
shoppingCartRouter.put("/", updateCartProduct);
shoppingCartRouter.delete('/:productId', deleteFromCart);
shoppingCartRouter.delete('/', emptyShoppingCart);

export { shoppingCartRouter };
