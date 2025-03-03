import { Given, Then, When, setWorldConstructor } from "@cucumber/cucumber";
import axios from "axios";
import { expect } from "chai";
import { exec } from "child_process";

let status_inicial;
let id_produto;
let id_pedido;
let body;
let response;

// Cancel Order
// Background
         Given('O histórico de pedidos tem um pedido de ID {string} com status {string}', async function (id, status) {
            id_pedido = +id;
            status_inicial = status;
            body = {"id":id_pedido,"status":status_inicial}
            await axios.post(`http://localhost:3000/order-history/`,body);
         });

         Given('associdados ao pedido há apenas o produto de ID {string} com {string} unidades', async function (product_id, unidades) {  
            body = {"product_id":id_produto,"order_id":id_pedido,"amount":unidades}
            id_produto = product_id
            await axios.post("http://localhost:3000/product-order-history/",body)
         });

// Definição do número em estoque
         Given('o produto de ID {string} tem {string} unidade em estoque', async function (id, estoque_inicial) { 
            body = {"stock_quantity":estoque_inicial};
            await axios.put(`http://localhost:3000/products/${id}`,body);
         });


         When("tenta se cancelar o pedido de ID {string}", async function (pedido_cancelado) {
            await axios.delete(`http://localhost:3000/cancel-order/${pedido_cancelado}`);
         });


         Then('No histórico de pedidos, o status atual do pedido é {string}', async function (status_esperado) {
            await axios.get(`http://localhost:3000/order-history/${pedido_cancelado}`)
            expect(status_obtido.status).to.equal(status_esperado)
         });


         Then('o produto de ID "239a30b8-a117-4997-a52e-bcfb258636ba" tem atualmente "10" unidade em estoque', async function (id, estoque_esperado) {
            response = await axios.get(`http://localhost:3000/products/${id}`)
            expect(+estoque_esperado).to.eq(response.stock_quantity)
         });

//Mensagem indicando algo

         Then('aparece uma mensagem indicando: {string}', async function (mensagem) {
            expect(response.data).to.include(mensagem);
            if ((response.data).includes("removed from shopping cart successfully")){
              // Apaga todas as entradas para poder realizar o próximo cenário
              await axios.delete("http://localhost:3000/shopping-cart/");
            }
         });

// Cart
// Background
         Given('o produto de nome {string}, ID {string} e com {string} unidades está no carrinho', async function (nome, id, amount) {
          body = {"id":id, "amount":+amount}; 
          response = await axios.post("http://localhost:3000/shopping-cart/add", body);
         });

         When('tenta-se adicionar o produto de ID {string} com {string} unidades ao carrinho', async function (id, amount) {
           body = {"id":id, "amount":+amount}; 
           response = await axios.post("http://localhost:3000/shopping-cart/add", body);
         });

// 2) Scenario: Alterar quantidade de um produto no carrinho # features\cart.feature:13


         When('tenta-se alterar a quantidade de unidades do produto de ID {string} para {string}', async function (id, amount) {
          body = {"id":id, "amount":+amount}; 
          response = await axios.put("http://localhost:3000/shopping-cart/", body);
         });


// 3) Scenario: Remover um produto do carrinho # features\cart.feature:17
         When('tenta-se remover o produto de ID {string}', async function (id) {
           response = await axios.delete(`http://localhost:3000/shopping-cart/${id}`)
           // Apaga todas as entradas para poder realizar o próximo cenário
           await axios.delete("http://localhost:3000/shopping-cart/");
         });

// 4) Scenario: Limpar todos os produtos do carrinho # features\cart.feature:21

         When('tenta-se limpar o carrinho', async function () {
          response = await axios.delete(`http://localhost:3000/shopping-cart/`)
         });

// 5 & 6) Scenario: Finalizar a compra do carrinho de compras

         When('o usuário tenta finalizar a compra do carrinho de compras', async function () {
           response = await axios.post("http://localhost:3000/shopping-cart/checkout")
         });

         Then('agora há no carrinho o produto de nome {string}, ID {string} e com {string} unidades', async function (nome, id_produto, amount) {
          response = await axios.get(`http://localhost:3000/shopping-cart/${id_produto}`);
          expect(response.data.amount).to.equal(+amount);
          expect(response.data.products.name).to.equal(nome);
          // Apaga todas as entradas para poder realizar o próximo cenário
          await axios.delete("http://localhost:3000/shopping-cart/");
         });
        



         


         




         

         