import {
  Given,
  When,
  Then,
  After,
} from "@badeball/cypress-cucumber-preprocessor";

Given(
  "o usuário {string} com e-mail {string} está logado no sistema com acesso de {string}",
  (nome: string, email: string, role: string) => {
    // Mock login - you should implement your actual login logic here
  }
);
Given(
  `que o  usuário {string} está na página {string}`,
  (arg0: string, arg1: string) => {
    // [Given] Sets up the initial state of the system.
  }
);

Given("o usuário está na página de {string}", (pagina: string) => {
  if (pagina === "Gerenciamento de Itens") {
    cy.visit("/admin/products");
  } else if (pagina === "Pagamento" || pagina === "Atualização de cartão") {
    cy.visit("/payment");
  } else if (pagina === "Cadastro de cartão") {
    cy.visit("/payment/new_card");
  } else if (pagina === "Cupons") {
    cy.visit("/admin/coupons");
  }
  cy.wait(2000);
});

When(
  `ele insere o nome {string}, descrição {string},  preço {string}, categoria {string}, disponibilidade {string}, desconto: {string}, imagem {string}`,
  (
    nome: string,
    descricao: string,
    preco: string,
    categoria: string,
    disponibilidade: string,
    desconto: string,
    imagem: string
  ) => {
    cy.get("[data-cy=create-product-button]").click();

    cy.get("[data-cy=product-name]").type(nome);
    cy.get("[data-cy=product-description]").type(descricao);
    cy.get("[data-cy=product-price]").type(preco);
    cy.get("[data-cy=product-quantity]").type(disponibilidade);
    cy.get("[data-cy=product-discount]").type(desconto);
    cy.get("[data-cy=product-category]").click();
    cy.get(`[data-cy-value="${categoria}"]`).click();

    cy.get("[data-cy=product-image]").type(imagem);
  }
);

Then("o sistema deve validar os dados inseridos", () => {
  cy.get("[data-cy=submit-button]").click();
  //   cy.intercept("POST", `${Cypress.env("apiUrl")}/new`).as("createProduct");
  //   cy.wait("@createProduct").then((interception: any) => {
  //     console.log("interception", interception);
  //     Cypress.env("lastCreatedProductId", interception.response.body.id);
  //   });
  cy.get("[data-cy=form-errors]").should("not.exist");
});

Then(
  `o item {string} deve ser exibido na lista de itens cadastrados`,
  (item: string) => {
    cy.get("[data-cy=products-table]").should("contain", item);
  }
);
Then("o sistema deve exibir a mensagem {string}", (mensagem: string) => {
  cy.get("[data-cy=toast]").should("contain", mensagem);
});

Given(
  `o item com o nome {string} está registrado no sistema`,
  (name: string) => {
    cy.get("[data-cy=products-table]").should("contain", name);
    cy.get("[data-cy=products-table]")
      .find("[data-cy=product-actions]")
      .click();
    cy.get("[data-cy=products-table]")
      .find("[data-cy=product-actions] [data-cy=edit-product-button]")
      .click();
    // [Given] Sets up the initial state of the system.
  }
);

When(`ele altera o preço para {string}`, (price: string) => {
  cy.get("[data-cy=product-price]").clear().type(price);
});

Then(`o sistema deve registrar a data e hora da atualização`, () => {
  // [Then] Describes the expected outcome or result of the scenario.
});

// Cleanup after each scenario
After({ tags: "@product-cleanup" }, () => {
  const productId = Cypress.env("lastCreatedProductId");
  if (productId) {
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/products/${productId}`,
      failOnStatusCode: false,
    });
    Cypress.env("lastCreatedProductId", null);
  }
});
