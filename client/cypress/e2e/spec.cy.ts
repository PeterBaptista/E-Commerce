describe("feature 1 payment sucess", () => {
	it("passes", () => {
		cy.visit("http://localhost:4000/payment");

		cy.get("#select-card").click();
		cy.get("#button-add-card").click();

		cy.url().should("include", "/payment/new_card");
	});
});
