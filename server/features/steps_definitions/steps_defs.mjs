import { Given, Then, When } from "@cucumber/cucumber";
import axios from "axios";
import { expect } from "chai";
import { spawn } from "child_process";
import { parse } from "path";

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

const BASE_URL = process.env.BASE_URL;

// COUPONS FEATURE

Given("cleanup", async function () {
  let response = await axios.get("http://localhost:3000/coupons_test")

    for (const entry of response.data) {
      await axios.delete("http://localhost:3000/coupons_test"+"/"+entry.id);
    }

    response = await axios.get("http://localhost:3000/coupons_test");
    expect(response.data.length).to.equal(0);
});

Given('Existe um cupom com nome {string} e porcentagem {string}%', async function (name, percentage) {
  let response = await axios.get("http://localhost:3000/coupons_test");
  if (await response.data.some(entry => entry.codename === name)) {
    return
  }
  
  let body = "{ 'name': '"+name+"', 'percentage': "+percentage+" }";
  let parsedBody = JSON.parse(body.replace(/'/g, '"'));
      response = await axios.post("http://localhost:3000/coupons_test", parsedBody);
  expect(response.status).to.equal(201);
});

Given('Não existe um cupom com nome {string} e porcentagem {string}%', async function (name, percentage) {
  let response = await axios.get("http://localhost:3000/coupons_test");
  if (response.data.some(entry => entry.codename === name)) {
    let entry = response.data.find(entry => entry.codename === name);
    let id = entry ? entry.id : null;
    await axios.delete("http://localhost:3000/coupons_test/"+id);
  }
  
  response = await axios.get("http://localhost:3000/coupons_test");
  expect(response.data.some(entry => entry.codename === name)).to.be.false;
});

Given('{string} tem apenas {string} entradas', async function (db, ammount) {
  let response = await axios.get("http://localhost:3000/"+db+"_test")

  expect(response.data.length).to.equal(Number(ammount));
});

Then('{string} tem {string} entradas', async function (db, ammount) {
  let response = await axios.get("http://localhost:3000/"+db+"_test")

  expect(response.data.length).to.equal(Number(ammount));
});

let status = 0;

When('requisitarem todos os cupons disponíveis', async function () {
  let response = await axios.get("http://localhost:3000/coupons_test");  
  status = response.status;
  // expect(response.status).to.equal(200);  
});

When('requisitarem o cadastro de um cupom com o nome {string} e a porcentagem {string}%', async function (name, percentage) {
  let body = "{ 'name': '"+name+"', 'percentage': "+percentage+" }"; 
  let parsedBody = JSON.parse(body.replace(/'/g, '"'));
  let response = await axios.post("http://localhost:3000/coupons_test", parsedBody);  
  status = response.status;
  // expect(response.status).to.equal(201);  
});

When('requisitarem a atualização de um cupom com o nome {string} e a porcentagem {string}%', async function (name, percentage) {
  let body = "{ 'name': '"+name+"', 'percentage': "+percentage+" }"; 
  let parsedBody = JSON.parse(body.replace(/'/g, '"'));
  let response = await axios.put("http://localhost:3000/coupons_test", parsedBody);  
  status = response.status;
  // expect(response.status).to.equal(200);  
});

When('requisitarem a deleção de um cupom com o nome {string}', async function (name) {
  let response = await axios.delete("http://localhost:3000/coupons_test/"+name);  
  status = response.status;
  // expect(response.status).to.equal(200);  
});

Then('Cupons tem uma entrada com nome {string} e porcentagem {string}%', async function (name, percentage) {
  let response = await axios.get("http://localhost:3000/coupons_test");  
  expect(response.data.some(entry => entry.codename === name)).to.be.true;
  expect(response.data.some(entry => entry.percentage === Number(percentage))).to.be.true;
});

Then('Cupons não tem uma entrada com nome {string}', async function (name) {
  let response = await axios.get("http://localhost:3000/coupons_test");  
  expect(response.data.some(entry => entry.codename === name)).to.be.false;
});

Then('Uma mensagem de {string} é enviada', async function(status_str) {
  switch (status_str) {
    case "sucesso":
      expect(status).to.be.oneOf([200, 201]);
      break;
    case "erro":
      expect(status).to.be.oneOf([400, 404, 500]);
      break;
  }
})

// END OF COUPONS FEATURE

Given("o usuário está na página de {string}", function (string) {
  switch (string) {
    case "Cadastro de cartão":
      this.cenario = "Cadastrar";
      break;
    case "Atualização de cartão":
      this.cenario = "Atualizar";
      break;
    default:
      // this given isn't necessary to this service scenario
      break;
  }
});

Given(
  "o usuário tem os cartões de apelido {string} e {string} cadastrados",
  async function (string, string2) {
    const data = new Date();
    let mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    if (mes < 10) mes = `0${mes}`;

    const response1 = await axios.post("http://localhost:3000/cards/new", {
      nickname: string,
      transactionType: "Debit",
      name: "John Doe",
      code: "5197952644616116",
      expiration: `${ano}/${mes}`,
      cvc: "123",
    });

    const response2 = await axios.post("http://localhost:3000/cards/new", {
      nickname: string2,
      transactionType: "Debit",
      name: "John Doe",
      code: "4485168778187659",
      expiration: `${ano}/${mes}`,
      cvc: "456",
    });

    this.card1 = response1.data;
    this.card2 = response2.data;

    await axios.get("http://localhost:3000/cards").then((response) => {
      const cards = response.data;
      const card = cards.find((card) => card.id === this.card1.id);

      this.id1 = card.id;
    });

    await axios.get("http://localhost:3000/cards").then((response) => {
      const cards = response.data;
      const card = cards.find((card) => card.id === this.card2.id);

      this.id2 = card.id;
    });

    if (!this.card1 || !this.card2) {
      throw new Error("Erro ao criar cartões");
    }
  }
);

When(
  "o usuário seleciona a opção {string} o cartão {string}",
  async function (string, string2) {
    switch (string) {
      case "Remover":
        this.cenario = "Remover";
        switch (string2) {
          case this.card1.nickname:
            await axios.delete(`http://localhost:3000/cards/${this.id1}`);
            break;
          case this.card2.nickname:
            await axios.delete(`http://localhost:3000/cards/${this.id2}`);
            break;
          default:
            throw new Error("Cartão não encontrado");
        }
        break;
      case "Atualizar":
        // This step is not necessary for this service scenario
        break;
      default:
        return "pending";
    }
  }
);

Then(
  "o cartão de apelido {string} é removido da lista de cartões",
  async function (string) {
    await axios.get("http://localhost:3000/cards").then((response) => {
      const cards = response.data;
      const card = cards.find((card) => card.id === this.id1 && card.nickname === string);
      
      expect(card).to.be.undefined;
    });
  }
);

Then(
  "o usuário tem os cartões de apelido {string} cadastrados",
  async function (string) {
    const data = new Date();
    let mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    if (mes < 10) mes = `0${mes}`;

    let response;

    switch (this.cenario) {
      case "Remover":
        await axios.get("http://localhost:3000/cards").then((response) => {
          const cards = response.data;
          const card = cards.find((card) => card.id === this.id2);

          expect(card.nickname).to.equal(string);
        });

        await axios.delete(`http://localhost:3000/cards/${this.id2}`);
        break;

      default:
        response = await axios.post("http://localhost:3000/cards/new", {
          nickname: string,
          transactionType: "Debit",
          name: "John Doe",
          code: "5197952644616116",
          expiration: `${ano}/${mes}`,
          cvc: "123",
        });

        this.card = response.data;
        expect(response.status).to.equal(200);

        response = await axios
          .get("http://localhost:3000/cards")
          .then((response) => {
            const cards = response.data;
            const card = cards.find((card) => card.id === this.card.id);

            expect(card.nickname).to.equal(string);
            expect(response.status).to.equal(200);
            this.id = card.id;
          });
        break;
    }
  }
);

When(
  "o usuário preenche o apelido {string}, a transação {string}, o nome {string}, o código {string}, o vencimento {string} e o cvc {string}",
  async function (string1, string2, string3, string4, string5, string6) {
    let response;
    let card;

    switch (this.cenario) {
      case "Cadastrar":
        response = await axios.post("http://localhost:3000/cards/new", {
          nickname: string1,
          transactionType: string2,
          name: string3,
          code: string4,
          expiration: string5,
          cvc: string6,
        });

        card = response.data;
        expect(card.nickname).to.equal(string1);
        expect(card.transaction_type).to.equal(string2);
        expect(card.name).to.equal(string3);
        expect(card.code_last4).to.equal(string4.slice(-4));

        this.id = response.data.id;
        break;

      case "Atualizar":
        response = await axios.put(`http://localhost:3000/cards/${this.id}`, {
          nickname: string1,
          transactionType: string2,
          name: string3,
          code: string4,
          expiration: string5,
          cvc: string6,
        });

        this.id = response.data.id;
        this.nickname = string1;
        this.name = string2;
        this.code = string3;
        break;
      default:
        break;
    }
    expect(response.status).to.equal(200);
  }
);

Then(
  "o cartão é salvo na conta com o apelido {string}, a transação {string}, o nome {string}, os quatro últimos dígitos {string} e o tipo {string}",
  async function (string, string2, string3, string4, string5) {
    // Write code here that turns the phrase above into concrete actions

    await axios.get("http://localhost:3000/cards").then((response) => {
      const cards = response.data;
      const card = cards.find((card) => card.id === this.id);

      expect(card.nickname).to.equal(string);
      expect(card.transaction_type).to.equal(string2);
      expect(card.name).to.equal(string3);
      expect(card.code_last4).to.equal(string4);
      expect(card.card_type).to.equal(string5);
    });

    axios.delete(`http://localhost:3000/cards/${this.id}`);
  }
);



Given('existe a categoria {string} do departamento {string}', async function (categoria, departamento) {
  let response = await axios.get("http://localhost:3000/department");
  expect(response.data.some(entry => entry.name === departamento)).to.be.true;
  let dept = response.data.find(entry => entry.name === departamento);
  
  
  response = await axios.get("http://localhost:3000/category");
  if(!response.data.some(entry => entry.name === categoria))
  {
    let body = "{'name' : '"+categoria+"' , 'department_id' : "+dept.id+"}";
    let parsedBody = JSON.parse(body.replace(/'/g, '"'));
    response = await axios.post("http://localhost:3000/category", parsedBody);
    expect(response.status).to.equal(201);
    return;
  }
  
  let entry = response.data.find(entry => entry.name === categoria);
  if(entry.department_id == dept.id) return;

  let body = "{'name' : '"+categoria+"' , 'department_id' : "+dept.id+"}";
  let parsedBody = JSON.parse(body.replace(/'/g, '"'));
  response = await axios.put("http://localhost:3000/category/"+entry.id, parsedBody);
  expect(response.status).to.equal(201);
});

Given('não existe a categoria {string}', async function (categoria) {
  let response = await axios.get("http://localhost:3000/category");
  let entry = response.data.find(entry => entry.name === categoria);
  if(!entry) return;
  
  response = await axios.delete("http://localhost:3000/category/"+entry.id);
  expect(response.status).to.equal(200);
});

Given('existe o departamento {string}', async function (departamento) {
  let response = await axios.get("http://localhost:3000/department");
  if (await response.data.some(entry => entry.name === departamento))
    return;
  
  let body = "{ 'name': '"+departamento+"' }";
  let parsedBody = JSON.parse(body.replace(/'/g, '"'));
  response = await axios.post("http://localhost:3000/department", parsedBody);
  expect(response.status).to.equal(201);
});

Given('não existe o departamento {string}', async function (departamento) {
  let response = await axios.get("http://localhost:3000/department");
  
  if( response.data.some(entry => entry.name === departamento) == true ){
    let entry = response.data.find(entry => entry.name === departamento);
    response = await axios.delete("http://localhost:3000/department/"+entry.id);
    expect(response.status).to.equal(200);
  }
});

When('o usuário tenta cadastrar a Categoria com nome {string} e o departamento {string}', async function (categoria, departamento) {
  let response = await axios.get("http://localhost:3000/department");
  expect(response.data.some(entry => entry.name === departamento)).to.be.true;
  let dept = response.data.find(entry => entry.name === departamento);
  
  let body = "{'name' : '"+categoria+"' , 'department_id' : "+dept.id+"}";
  let parsedBody = JSON.parse(body.replace(/'/g, '"'));
  response = await axios.post("http://localhost:3000/category", parsedBody);
  
  status = response.status;
});

When('o usuário tenta cadastrar o Departamento com nome {string}', async function (departamento) {
  let body = "{ 'name': '"+departamento+"' }";
  let parsedBody = JSON.parse(body.replace(/'/g, '"'));
  let response = await axios.post("http://localhost:3000/department", parsedBody);
  
  status = response.status;
});

When('o usuário tenta editar o Departamento com nome {string} para {string}', async function (departamento, novo_nome) {
  let response = await axios.get("http://localhost:3000/department");
  let entry = response.data.find(entry => entry.name === departamento);

  let body = "{ 'name': '"+novo_nome+"' }";
  let parsedBody = JSON.parse(body.replace(/'/g, '"'));
  response = await axios.put("http://localhost:3000/department/"+entry.id, parsedBody);
  
  status = response.status;
});

Then('o usuário consegue ver {string} na lista de categorias', async function (categoria) {
  let response = await axios.get("http://localhost:3000/category");
  let entry = response.data.some(entry => entry.name === categoria);
  expect(entry).to.be.true;
});

Then('o usuário consegue ver {string} na lista de departamentos', async function (departamento) {
  let response = await axios.get("http://localhost:3000/department");
  let entry = response.data.some(entry => entry.name === departamento);
  expect(entry).to.be.true;
});

Then('não existe {string} na lista de categorias', async function (categoria) {
  let response = await axios.get("http://localhost:3000/category");
  let entry = response.data.some(entry => entry.name === categoria);
  expect(entry).to.be.false;
});

Then('não existe {string} na lista de departamentos', async function (departamento) {
  let response = await axios.get("http://localhost:3000/department");
  let entry = response.data.some(entry => entry.name === departamento);
  expect(entry).to.be.false;
});
