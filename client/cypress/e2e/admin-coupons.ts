import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';


Given(`Não existe um cupom com nome {string}`, (arg0: string) => {
    // [Given] Sets up the initial state of the system for the specific coupon name.
        
    cy.request("GET", "http://localhost:3000/coupons/").then((response) => {
        if (response.body.some((coupon: any) => coupon.codename === arg0)) {
            cy.get("[data-cy=coupons-table]").contains(arg0).parents("tr").find("[data-cy=dropdown-menu-trigger]").click();
            cy.get("[data-cy=delete-coupon-button]").click();
        }
    });

});

When(`requisitarem o cadastro de um cupom com o nome {string} e a porcentagem {string}%`, (nome: string, porcentagem: string) => {
    cy.get("[data-cy=create-coupon-button]").click();
    cy.get("[data-cy=coupon-name]").type(nome);
    cy.get("[data-cy=coupon-percentage]").type(porcentagem);

});

Then(`Uma mensagem de {string} é enviada`, (arg0: string) => {
    cy.get("[data-cy=toast]").should("contain", arg0);
});

Then(`Cupons tem uma entrada com nome {string} e porcentagem {string}%`, (arg0: string, arg1: string) => {
    cy.get("[data-cy=coupons-table]").should("contain", arg0);
    cy.get("[data-cy=coupons-table]").contains(arg0).parents("tr").should("contain", arg1);
});

Given(`Existe um cupom com nome {string} e porcentagem {string}%`, (arg0: string, arg1: string) => {
    cy.request("GET", "http://localhost:3000/coupons/").then((response) => {
        if (!response.body.some((coupon: any) => coupon.codename === arg0)) {
            cy.request("POST", "http://localhost:3000/coupons/", {
                name: arg0,
                percentage: arg1,
            });
        }
    }
    );
});

When(`requisitarem a deleção de um cupom com o nome {string}`, (arg0: string) => {
    // [When] Describes the action or event that triggers the scenario.
    cy.get("[data-cy=coupons-table]").contains(arg0).parents("tr").find("[data-cy=dropdown-menu-trigger]").click();
    cy.get("[data-cy=delete-coupon-button]").click();
});

Then(`Cupons não tem uma entrada com nome {string}`, (arg0: string) => {
    cy.get("[data-cy=coupons-table]").should("not.contain", arg0);
});

When(`requisitarem a atualização de um cupom com o nome {string} e a porcentagem {string}%`, (arg0: string, arg1: string) => {
    // [When] Describes the action or event that triggers the scenario.
    cy.get("[data-cy=coupons-table]").contains(arg0).parents("tr").find("[data-cy=dropdown-menu-trigger]").click();
    cy.get("[data-cy=edit-coupon-button]").click();
    cy.get("[data-cy=coupon-name]").clear().type(arg0);
    cy.get("[data-cy=coupon-percentage]").type("{selectall}").type(arg1);
});