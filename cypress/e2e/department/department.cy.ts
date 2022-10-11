/// <reference types="cypress" />
import { controller as S } from '../../../components/department/controller';
describe('Department Test', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('http://localhost:3000/department-info');
    cy.get('button[type=submit]').as('submitBtn');
  });

  it('Create Department', () => {
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.name}`).type('department1');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('department1')).should('exist');
  });

  it('Check for duplicate department Error', () => {
    // add first department
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.name}`).type('department1');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('department1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    // add second department
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.name}`).type('department1');
      cy.get('@submitBtn').click();
      cy.contains(S.action.error.nameDuplication);

      // update department Name
      cy.get(`#${S.formField.name.name}`).clear().type('department2');
      cy.get('@submitBtn').click();
    });

    cy.contains(S.action.success.added('department2')).should('exist');
  });

  it('Updating department name', () => {
    // add first department
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.name}`).type('department1');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('department1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    //add second department
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.name}`).type('department2');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('department2')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    //change name:- department1 to department2
    cy.get('tbody')
      .contains('department1')
      .parent('tr')
      .within(() => {
        cy.get('[data-test-id="edit"]').click();
      });
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.name}`).clear().type('department2');
      cy.get('@submitBtn').click();
      // should give error
      cy.contains(S.action.error.nameDuplication).should('exist');
      // change to department3
      cy.get(`#${S.formField.name.name}`).clear().type('department3');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.edited('department3')).should('exist');
  });

  it('Delete department and create again', () => {
    // add record
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.name}`).type('department1');
      cy.get('@submitBtn').click();
    });

    cy.contains(S.action.success.added('department1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    // delete department1
    cy.get('tbody')
      .contains('department1')
      .parent('tr')
      .within(() => {
        cy.get('[data-test-id="delete"]').click();
      });

    cy.contains(S.action.success.deleted('department1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    //Should able to create department with same name
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.name}`).type('department1');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('department1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
  });
});
// Prevent TypeScript from reading file as legacy script
export {};
