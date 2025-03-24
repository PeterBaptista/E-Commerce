import { Router } from "express";
import { RequestHandler } from "express";
import {
  getProductOrderHistory,
  postProductOrderHistory,
  deleteProductOrderHistory,
  putProductOrderHistory,
} from "../controllers/productOrderHistory/product-order-history-controllers";

const productOrderHistoryRouter = Router();

productOrderHistoryRouter.get("/", getProductOrderHistory);
productOrderHistoryRouter.post("/", postProductOrderHistory);
productOrderHistoryRouter.put("/", putProductOrderHistory);
productOrderHistoryRouter.delete("/", deleteProductOrderHistory);

export { productOrderHistoryRouter };
