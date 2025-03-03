import { Given, When, Then, setWorldConstructor } from "@cucumber/cucumber";
import { expect } from "chai";
import axios from "axios";


// Variáveis globais
let allOrders = [];
let response = [];

class CustomWorld {
  constructor() {
    this.orders = [];
    this.orderItems = [];
    this.errorMessage = undefined;
  }
}



setWorldConstructor(CustomWorld);

// Cenário 1: Listar todos os itens dentro de um pedido específico
Given("o usuário está na página {string}", function (page) {
  this.currentPage = page;
});

When("clica no pedido com ID {string}", async function (orderId) {
  const response = await axios.get(`http://localhost:3000/product-order-history?order_id=${orderId}`);
  //const response = await axiosApi(`/product-order-history?order_id=${orderId}`);
  this.orderItems = response.data;
});

Then("o sistema exibe os itens do pedido com os seguintes detalhes:", function (dataTable) {
  const expectedItems = dataTable.hashes();

  // Normalizar os dados para garantir consistência
  const normalizedActualItems = this.orderItems.map((item) => ({
    id: String(item.id),
    created_at: item.created_at,
    order_id: String(item.order_id),
    product_id: item.product_id,
    price_paid: String(item.price_paid),
    amount: String(item.amount),
  }));

  expect(normalizedActualItems).to.deep.equal(expectedItems);
});

Then("o usuário permanece na página {string}", function (expectedPage) {
  expect(this.currentPage).to.equal(expectedPage);
});

// Cenário 2: Recuperar todos os pedidos registrados no sistema
Given("existem pedidos registrados no sistema", function () {
    // This step can be empty or used to initialize any necessary preconditions.
  });
  
  When("o sistema consulta todos os pedidos", async function () {
    try {
      this.response = await axios.get(`http://localhost:3000/order-history`);
    } catch (error) {
      console.error("Erro ao consultar pedidos:", error);
      throw error;
    }
  });
  
  Then("o sistema retorna todos os pedidos:", function (dataTable) {
    const expectedOrders = dataTable.hashes();
    
    // Normalize actual orders from the response
    const normalizedActualOrders = this.response.data.map((order) => ({
      order_id: String(order.order_id),
      order_data: order.order_data,
      destination: order.destination,
      status: order.status,
      total_value: String(order.total_value),
    }));
  
    // Assert that the actual orders match the expected orders
    expect(normalizedActualOrders).to.deep.equal(expectedOrders);
  });

// Cenário 3: Recuperar os 3 pedidos mais recentes do usuário
// Dado que o usuário atual possui pedidos registrados
Given('o usuário atual possui pedidos registrados', async function () {
  try {
    // Simula uma chamada GET para obter todos os pedidos do endpoint
    const apiResponse = await axios.get('http://localhost:3000/order-history');
    allOrders = apiResponse.data.map((order) => ({
      order_id: String(order.order_id),
      order_data: String(order.order_data),
      destination: String(order.destination),
      status: String(order.status),
      total_value: String(order.total_value),
    }));
  } catch (error) {
    console.error('Erro ao consultar pedidos:', error.message);
    throw new Error('Falha ao carregar pedidos do sistema.');
  }
});

// Quando o sistema consulta os 3 pedidos mais recentes do usuário
When('o sistema consulta os 3 pedidos mais recentes do usuário', function () {
  // Ordena os pedidos pela data mais recente usando o campo 'order_data'
  const sortedOrders = allOrders.sort((a, b) => {
    return new Date(b.order_data).getTime() - new Date(a.order_data).getTime();
  });
  // Limita o número de pedidos aos 3 mais recentes
  response = sortedOrders.slice(0, 3);
});

// Então o sistema retorna os seguintes pedidos
Then('o sistema retorna os seguintes pedidos:', function (dataTable) {
  // Converte a tabela Gherkin para um array de objetos
  const expectedOrders = dataTable.hashes().map((order) => ({
    order_id: String(order.order_id),
    order_data: String(order.order_data),
    destination: String(order.destination),
    status: String(order.status),
    total_value: String(order.total_value),
  }));

  // Normaliza os dados da resposta para garantir consistência
  const normalizedActualOrders = response.map((order) => ({
    order_id: String(order.order_id),
    order_data: String(order.order_data),
    destination: String(order.destination),
    status: String(order.status),
    total_value: String(order.total_value),
  }));

  // Compara os pedidos retornados com os dados esperados
  expect(normalizedActualOrders).to.deep.equal(expectedOrders);
});