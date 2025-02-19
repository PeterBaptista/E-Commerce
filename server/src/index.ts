import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { cardRouter } from "./routes/card-routes";
import { couponsRouter, couponsRouter_test } from "./routes/coupons-routes";
import { productRouter } from "./routes/product-routes";
import { categoriesRouter } from "./routes/categories-routes";
import { departmentRouter } from "./routes/departament-routes";
import { orderHistoryRouter } from "./routes/order-history-routes";
import { productOrderHistoryRouter } from "./routes/product-order-history-routes";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/products", cors(), productRouter);
app.use("/cards", cors(), cardRouter);
app.use("/coupons", cors(), couponsRouter);
app.use("/coupons_test", cors(), couponsRouter_test);
app.use("/category", cors(), categoriesRouter);
app.use("/department", cors(), departmentRouter);
app.use("/order-history", orderHistoryRouter);
app.use("/product-order-history", productOrderHistoryRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
