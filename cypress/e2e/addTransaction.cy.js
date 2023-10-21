describe('Add transaction', () => {

  beforeEach(() => {
    cy.login('thomas.aelbrecht@hogent.be', '12345678')
  });

  it("should add a transaction", () => {
    cy.visit("http://localhost:5173/transactions/add");

    cy.get("[data-cy=date_input]").type("2021-11-01");
    cy.get("[data-cy=place_input]").select("Irish Pub");
    cy.get("[data-cy=amount_input]").type("200");
    cy.get("[data-cy=submit_transaction]").click();

    cy.get("[data-cy=transaction_user]").eq(3).contains("Thomas");
    cy.get("[data-cy=transaction_amount]").each((el, idx) => {
      if (idx === 9) {
        expect(Number(el[0].textContent.replace(/^\D+/g, '').replace(/,/, '.'))).to.equal(200);
      }
    });
    cy.get("[data-cy=transaction]").should("have.length", 4);
  });

  it("should remove the transaction", () => {
    cy.visit("http://localhost:5173/transactions/");
    cy.get("[data-cy=transaction_remove_btn]").eq(3).click();
    cy.get("[data-cy=transaction]").should("have.length", 3);
  });

  it("should show the error message for an invalid amoun", () => {
    cy.visit("http://localhost:5173/transactions/add");

    cy.get("[data-cy=amount_input]").type("-1");
    cy.get("[data-cy=submit_transaction]").click();

    cy.get("[data-cy=label_input_error]").contains("min 1");
  });
});