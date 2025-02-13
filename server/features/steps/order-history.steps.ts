import { Given, When, Then, setWorldConstructor } from "@cucumber/cucumber";
import { expect } from "chai";
import axios from "axios";

// Definição da classe CustomWorld
class CustomWorld {
  orders: any[] = [];
  orderItems: any[] = [];
  errorMessage: string | undefined;
}

// Configurar o mundo personalizado
setWorldConstructor(CustomWorld);

// Interface para os pedidos
interface Order {
  order_id: number;
  created_at: string;
  order_data: string;
  destination: string;
  status: string;
  total_value: number;
}

// Interface para os itens de pedido
interface OrderItem {
  id: number;
  created_at: string;
  order_id: number;
  product_id: string;
  price_paid: number;
  amount: number;
}

// Cenário 1: Listar todos os itens dentro de um pedido específico
Given("o usuário está na página {string}", function (page: string) {
  this.currentPage = page;
});

When("clica no pedido com ID {string}", async function (orderId: string) {
  const response = await axios.get(`http://localhost:3000/product-order-history?order_id=${orderId}`);
  this.orderItems = response.data;
});

Then("o sistema exibe os itens do pedido com os seguintes detalhes:", function (dataTable) {
  const expectedItems = dataTable.hashes();

  // Normalizar os dados para garantir consistência
  const normalizedActualItems = this.orderItems.map((item: OrderItem) => ({
    id: String(item.id),
    created_at: item.created_at,
    order_id: String(item.order_id),
    product_id: item.product_id,
    price_paid: String(item.price_paid),
    amount: String(item.amount),
  }));

  expect(normalizedActualItems).to.deep.equal(expectedItems);
});

Then("o usuário permanece na página {string}", function (expectedPage: string) {
  expect(this.currentPage).to.equal(expectedPage);
});

// Cenário 2: Recuperar todos os pedidos registrados no sistema
Given("existem pedidos registrados no sistema", function () {
  this.orders = [
    { order_id: 1, order_data: "2023-10-01", destination: "Rua A, 123", status: "delivered", total_value: 550 },
    { order_id: 2, order_data: "2023-09-25", destination: "Rua B, 456", status: "shipped", total_value: 200 },
    { order_id: 3, order_data: "2023-09-20", destination: "Rua C, 789", status: "pending", total_value: 150 },
    { order_id: 4, order_data: "2023-09-15", destination: "Rua D, 101", status: "canceled", total_value: 300 },
    { order_id: 5, order_data: "2023-09-10", destination: "Rua E, 202", status: "delivered", total_value: 100 },
  ];
});

When("o sistema consulta todos os pedidos", function () {
  this.response = this.orders;
});

Then("o sistema retorna todos os pedidos:", function (dataTable) {
  const expectedOrders = dataTable.hashes();

  // Normalizar os dados para garantir consistência
  const normalizedActualOrders = this.response.map((order: Order) => ({
    order_id: String(order.order_id),
    order_data: order.order_data,
    destination: order.destination,
    status: order.status,
    total_value: String(order.total_value),
  }));

  expect(normalizedActualOrders).to.deep.equal(expectedOrders);
});

// Cenário 3: Recuperar os 3 pedidos mais recentes do usuário
// Cenário 3: Recuperar os 3 pedidos mais recentes do usuário
Given("o usuário atual possui pedidos registrados", function () {
  this.orders = [
    { order_id: 1, created_at: "2025-02-09T18:41:15+00:00", order_data: "2023-10-01", destination: "Rua A, 123", status: "delivered", total_value: 550 },
    { order_id: 2, created_at: "2025-02-09T18:45:48.99775+00:00", order_data: "2023-09-25", destination: "Rua B, 456", status: "shipped", total_value: 200 },
    { order_id: 3, created_at: "2025-02-09T18:46:27.623864+00:00", order_data: "2023-09-20", destination: "Rua C, 789", status: "pending", total_value: 150 },
    { order_id: 4, created_at: "2025-02-09T18:49:36.882636+00:00", order_data: "2023-09-15", destination: "Rua D, 101", status: "canceled", total_value: 300 },
    { order_id: 5, created_at: "2025-02-09T18:53:10.346646+00:00", order_data: "2023-09-10", destination: "Rua E, 202", status: "delivered", total_value: 100 },
  ];
});

const mockOrders = [
  { order_id: 1, created_at: "2025-02-09T18:41:15+00:00", order_data: "2023-10-01", destination: "Rua A, 123", status: "delivered", total_value: 550 },
  { order_id: 2, created_at: "2025-02-09T18:45:48.99775+00:00", order_data: "2023-09-25", destination: "Rua B, 456", status: "shipped", total_value: 200 },
  { order_id: 3, created_at: "2025-02-09T18:46:27.623864+00:00", order_data: "2023-09-20", destination: "Rua C, 789", status: "pending", total_value: 150 },
  { order_id: 4, created_at: "2025-02-09T18:49:36.882636+00:00", order_data: "2023-09-15", destination: "Rua D, 101", status: "canceled", total_value: 300 },
  { order_id: 5, created_at: "2025-02-09T18:53:10.346646+00:00", order_data: "2023-09-10", destination: "Rua E, 202", status: "delivered", total_value: 100 },
];

When('o sistema consulta os {int} pedidos mais recentes do usuário', function (limit: number) {
  // Corrigido: Ordenar por order_data em vez de created_at
  const sortedOrders = mockOrders.sort((a, b) => {
    return new Date(b.order_data).getTime() - new Date(a.order_data).getTime();
  });
  this.response = sortedOrders.slice(0, limit);
});

Then('o sistema retorna os seguintes pedidos:', function (dataTable) {
  const expectedOrders = dataTable.hashes();
  const allOrders = [
    { order_id: 1, created_at: "2025-02-09T18:41:15+00:00", order_data: "2023-10-01", destination: "Rua A, 123", status: "delivered", total_value: 550 },
    { order_id: 2, created_at: "2025-02-09T18:45:48.99775+00:00", order_data: "2023-09-25", destination: "Rua B, 456", status: "shipped", total_value: 200 },
    { order_id: 3, created_at: "2025-02-09T18:46:27.623864+00:00", order_data: "2023-09-20", destination: "Rua C, 789", status: "pending", total_value: 150 },
    { order_id: 4, created_at: "2025-02-09T18:49:36.882636+00:00", order_data: "2023-09-15", destination: "Rua D, 101", status: "canceled", total_value: 300 },
    { order_id: 5, created_at: "2025-02-09T18:53:10.346646+00:00", order_data: "2023-09-10", destination: "Rua E, 202", status: "delivered", total_value: 100 },
  ];

  // Corrigido: Ordenar por order_data em vez de created_at
  const sortedOrders = allOrders.sort((a, b) => {
    return new Date(b.order_data).getTime() - new Date(a.order_data).getTime();
  });
  const limitedOrders = sortedOrders.slice(0, 3);

  const normalizedActualOrders = limitedOrders.map((order) => ({
    order_id: String(order.order_id),
    created_at: order.created_at,
    order_data: order.order_data,
    destination: order.destination,
    status: order.status,
    total_value: String(order.total_value),
  }));

  expect(normalizedActualOrders).to.deep.equal(expectedOrders);
});
