import { Given, Then, When } from "@cucumber/cucumber";
import axios from "axios";
import { expect } from "chai";

const BASE_URL = process.env.BASE_URL;

Given("o usuário está na página de {string}", function (string) {
  // This isn't necessary to service scenario
});

Given(
  "o usuário tem os cartões de apelido {string} e {string} cadastrados",
  function (string, string2) {
    this.cardId = "3123";
    // Write code here that turns the phrase above into concrete actions
    return "pending";
  }
);

When(
  "o usuário seleciona a opção {string} o cartão {string}",
  function (string, string2) {
    // Write code here that turns the phrase above into concrete actions
    return "pending";
  }
);

Then(
  "o cartão de apelido {string} é removido da lista de cartões",
  (string) => {
    // Write code here that turns the phrase above into concrete actions
    return "pending";
  }
);

Then(
  "o usuário tem os cartões de apelido {string} cadastrados",
  function (string) {
    // Write code here that turns the phrase above into concrete actions
    return "pending";
  }
);

When(
  "o usuário preenche o apelido {string}, o nome {string}, o código {string}, o vencimento {string} e o cvc {string}",
  async function (string1, string2, string3, string4, string5) {
    // Debug para verificar os dados enviados
    const response = await axios.post("http://localhost:3000/cards/new", {
      nickname: string1,
      name: string2,
      code: string3,
      expiration: string4,
      cvc: string5,
    });

    this.cardId = response.data.id;

    expect(response.status).to.equal(200);
  }
);

When("o usuário seleciona a opção {string} com sucesso", function (string) {
  // Write code here that turns the phrase above into concrete actions

  return "pending";
});

Then(
  "o cartão é salvo na conta com o apelido {string}, o nome {string}, os quatro últimos dígitos {string} e o tipo {string}",
  async function (string, string2, string3, string4) {
    // Write code here that turns the phrase above into concrete actions

    await axios.get("http://localhost:3000/cards").then((response) => {
      const cards = response.data;
      const card = cards.find((card) => card.id === this.cardId);

      expect(card.nickname).to.equal(string);
      expect(card.name).to.equal(string2);
      expect(card.code_last4).to.equal(string3);
      expect(card.card_type).to.equal(string4);
    });

    axios.delete(`http://localhost:3000/cards/${this.cardId}`);
  }
);

Then("o cartão é validado", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Then(
  "o cartão é salvo com a figura do tipo {string} ou {string}",
  (string, string2) => {
    // Write code here that turns the phrase above into concrete actions
    return "pending";
  }
);

Given(
  "o usuário {string} com e-mail {string} está logado no sistema com acesso de {string}",
  function (string, string2, string3) {
    // Write code here that turns the phrase above into concrete actions
  }
);

Given(
  "que o  usuário {string} está na página {string}",
  function (string, string2) {
    // Write code here that turns the phrase above into concrete actions
  }
);
When(
  "ele insere o nome {string}, descrição {string}, preço {string}, categoria {string}, disponibilidade {string}, imagem {string}",
  async function (name, description, price, category, stock_quantity, img_url) {
    // Write code here that turns the phrase above into concrete actions

    const response = await axios.post(`http://localhost:3000/products/new`, {
      name: name,
      price: +price, // Fix: price should be assigned correctly
      stock_quantity: Number(stock_quantity),
      is_active: true,
      description: description,
      image_url: img_url,
    });
    this.productId = response.data.id;
    this.productCreateData = response.data;

    // Store the product ID in the context (this)
  }
);

Then("o sistema deve validar os dados inseridos", async function () {
  // Write code here that turns the phrase above into concrete actions

  const response = await axios.get(
    `http://localhost:3000/products/${this.productId}`
  );

  expect(JSON.stringify(response.data)).to.be.eql(
    JSON.stringify(this.productCreateData)
  );
});

Then(
  "o item deve ser exibido na lista de itens cadastrados",
  async function () {
    // Write code here that turns the phrase above into concrete actions

    const response = await axios.get(`http://localhost:3000/products`);

    const idx = response.data.findIndex((item) => item.id === this.productId);
    expect(idx).to.be.greaterThan(-1);
  }
);
