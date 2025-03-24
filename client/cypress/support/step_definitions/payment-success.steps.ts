import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("o usuário seleciona a opção {string}", (opcao: string) => {
	if (opcao === "Adicionar novo cartão") {
		cy.get("#select-card").click();
		cy.get("#button-add-card").click();
	}
});

When(
	"o usuário preenche o apelido {string}, a transação {string}, o nome {string}, o código {string}, o vencimento {string} e o cvc {string}",
	(
		apelido: string,
		transação: string,
		nome: string,
		código: string,
		vencimento: string,
		cvc: string,
	) => {
		const months = [
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
			"Agosto",
			"Setembro",
			"Outubro",
			"Novembro",
			"Dezembro",
		];

		cy.get("#nickname").clear().type(apelido);
		cy.get("#name").clear().type(nome);
		cy.get("#code").clear().type(código);
		cy.get("#cvc").clear().type(cvc);
		cy.get("#year").clear().type(vencimento.substring(3, 7));
		cy.get("#month").click();
		cy.get(
			`#${months[Number.parseInt(vencimento.substring(0, 2)) - 1]}`,
		).click();

		const url = cy.url().toString();
		console.log(url);
		cy.url().then((url) => {
			switch (true) {
				case url.includes("/payment/new_card"):
					switch (transação) {
						case "Crédito":
							cy.get("#select-credit").click();
							break;
						case "Débito":
							cy.get("#select-debit").click();
							break;
						default:
							break;
					}

					cy.get("#cadastrar").click();
					break;
				case url.includes("/payment"):
					switch (transação) {
						case "Crédito":
							cy.get("#dialog-credit").click();
							break;
						case "Débito":
							cy.get("#dialog-debit").click();
							break;
						default:
							break;
					}

					cy.get("#dialog-update-card").click();
					break;
				default:
					break;
			}
		});
	},
);

When(
	"o usuário seleciona a opção {string} o cartão {string}",
	(opcao: string, cartao: string) => {
		cy.visit("/payment");
		cy.get("#select-card").click();
		cy.get(`[data-name="update-${cartao}"]`).click();

		if (opcao === "Atualizar") {
			cy.get(`[data-name="update ${cartao}"]`).click();
		} else if (opcao === "Remover") {
			cy.get(`[data-name="delete ${cartao}"]`).click();
			cy.get("#delete-card").click();
		}
	},
);

Then("o usuário vai para página de {string}", (pagina: string) => {
	if (pagina === "Pagamento") {
		cy.url().should("include", "/payment");
	}
});

Then(
	"o usuário tem o cartão de apelido {string} cadastrado",
	(apelido: string) => {
		cy.visit("/payment");
		cy.get("#select-card").click();
		cy.get(`[data-name="${apelido}"] button`).click();
	},
);

Then(
	"o usuário não tem o cartão de apelido {string} cadastrado",
	(apelido: string) => {
		cy.get("#select-card").click();
		cy.get(`[data-name="${apelido}"] button`).should("not.exist");
	},
);
