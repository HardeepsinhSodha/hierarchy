/// <reference types="cypress" />
import 'cypress-localstorage-commands';
import { controller as S } from '../../../components/employee/controller';
const department = 'department1';
describe('Employee Test', () => {
  before(() => {
    cy.viewport(1280, 720);
    cy.visit('http://localhost:3000/department-info');
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.name}`).type(department);
    });
    cy.get('button[type=submit]').click();
    cy.contains(S.action.success.added(department)).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    cy.saveLocalStorage('persist:root');
  });
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.restoreLocalStorage('persist:root');
    cy.visit('http://localhost:3000/employee');
    cy.get('button[type=submit]').as('submitBtn');
  });

  it('Create Employee', () => {
    cy.contains(/Add employee/i).click();
    cy.contains(S.yupError.required).should('not.exist');
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).click();
      cy.get(`#${S.formField.username.id}`).click();
      cy.get(`#${S.formField.email_id.id}`).click();
      cy.get(`#${S.formField.phone_number.id}`).click();
      cy.get(`#${S.formField.name.id}`).click();

      cy.contains(S.yupError.required).should('exist');

      cy.get(`#${S.formField.name.id}`).type('name');
      cy.contains(S.yupError.required).should('exist');

      cy.get(`#${S.formField.username.id}`).type('username');
      cy.contains(S.yupError.required).should('exist');

      cy.get(`#${S.formField.email_id.id}`).type('noteamil');
      cy.get(`#${S.formField.phone_number.id}`).type('not@^&*Number');

      cy.get(`#${S.formField.username.id}`).click();

      cy.contains(S.yupError.email_id).should('exist');
      cy.contains(S.yupError.phone_number_matchs).should('exist');

      cy.get(`#${S.formField.email_id.id}`).clear().type('email@gmail.com');
      cy.contains(S.yupError.email_id).should('not.exist');

      cy.get(`#${S.formField.phone_number.id}`).clear().type('12345678901');
      cy.contains(S.yupError.phone_number_length).should('exist');

      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567890');
      cy.get(`#${S.formField.department.id}`).type(`${department}{enter}`);
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('name')).should('exist');
  });

  it('Check for duplicate value Error', () => {
    //Add record
    cy.contains(/Add employee/i).click();
    cy.get('form').within(() => {
      cy.contains(S.yupError.required).should('not.exist');
      cy.get(`#${S.formField.name.id}`).type('name');
      cy.get(`#${S.formField.username.id}`).type('username');
      cy.get(`#${S.formField.email_id.id}`).clear().type('email@gmail.com');
      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567890');
      cy.get(`#${S.formField.department.id}`).type(`${department}`);
      cy.contains(S.yupError.email_id).should('not.exist');
      cy.contains(S.yupError.phone_number_length).should('not.exist');
      cy.contains(S.yupError.phone_number_matchs).should('not.exist');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('name')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    //Add another record
    cy.contains(/Add employee/i).click();
    cy.get('form').within(() => {
      cy.contains(S.yupError.required).should('not.exist');
      cy.get(`#${S.formField.name.id}`).type('name');
      cy.get(`#${S.formField.username.id}`).type('username1');
      cy.get(`#${S.formField.email_id.id}`).clear().type('email1@gmail.com');
      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567891');
      cy.get(`#${S.formField.department.id}`).type(`${department}{enter}`);
      cy.contains(S.yupError.email_id).should('not.exist');
      cy.contains(S.yupError.phone_number_length).should('not.exist');
      cy.contains(S.yupError.phone_number_matchs).should('not.exist');
      cy.get('@submitBtn').click();

      cy.contains(S.action.error.nameDuplication).should('exist');

      cy.get(`#${S.formField.name.id}`).clear().type('name1');
      cy.get(`#${S.formField.username.id}`).clear().type('username');
      cy.get('@submitBtn').click();
      cy.contains(S.action.error.usernameDuplication).should('exist');

      cy.get(`#${S.formField.username.id}`).clear().type('username1');
      cy.get(`#${S.formField.email_id.id}`).clear().type('email@gmail.com');
      cy.get('@submitBtn').click();
      cy.contains(S.action.error.emailIdDuplication).should('exist');

      cy.get(`#${S.formField.email_id.id}`).clear().type('email1@gmail.com');
      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567890');
      cy.get('@submitBtn').click();
      cy.contains(S.action.error.phoneNoDuplication).should('exist');

      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567891');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('name1')).should('exist');
  });

  it('Updating Employee details', () => {
    //Add record
    cy.contains(/Add employee/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('name');
      cy.get(`#${S.formField.username.id}`).type('username');
      cy.get(`#${S.formField.email_id.id}`).clear().type('email@gmail.com');
      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567890');
      cy.get(`#${S.formField.department.id}`).type(`${department}{enter}`);
      cy.contains(S.yupError.email_id).should('not.exist');
      cy.contains(S.yupError.phone_number_length).should('not.exist');
      cy.contains(S.yupError.phone_number_matchs).should('not.exist');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('name')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    //Add second record
    cy.contains(/Add employee/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('name1');
      cy.get(`#${S.formField.username.id}`).type('username1');
      cy.get(`#${S.formField.email_id.id}`).clear().type('email1@gmail.com');
      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567891');
      cy.get(`#${S.formField.department.id}`).type(`${department}{enter}`);
      cy.contains(S.yupError.email_id).should('not.exist');
      cy.contains(S.yupError.phone_number_length).should('not.exist');
      cy.contains(S.yupError.phone_number_matchs).should('not.exist');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('name1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    //Edit first record
    cy.get('tbody')
      .contains('name')
      .parent('tr')
      .within(() => {
        cy.get('[data-test-id="edit"]').click();
      });
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).clear().type('name1');
      cy.get('@submitBtn').click();

      cy.contains(S.action.error.nameDuplication).should('exist');

      cy.get(`#${S.formField.name.id}`).clear().type('name2');
      cy.get(`#${S.formField.username.id}`).clear().type('username1');
      cy.get('@submitBtn').click();
      cy.contains(S.action.error.usernameDuplication).should('exist');

      cy.get(`#${S.formField.username.id}`).clear().type('username2');
      cy.get(`#${S.formField.email_id.id}`).clear().type('email1@gmail.com');
      cy.get('@submitBtn').click();
      cy.contains(S.action.error.emailIdDuplication).should('exist');

      cy.get(`#${S.formField.email_id.id}`).clear().type('email2@gmail.com');
      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567891');
      cy.get('@submitBtn').click();
      cy.contains(S.action.error.phoneNoDuplication).should('exist');

      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567892');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.edited('name2')).should('exist');
  });

  it('Delete employee and create again', () => {
    //Add record
    cy.contains(/Add employee/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('name');
      cy.get(`#${S.formField.username.id}`).type('username');
      cy.get(`#${S.formField.email_id.id}`).clear().type('email@gmail.com');
      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567890');
      cy.get(`#${S.formField.department.id}`).type(`${department}{enter}`);
      cy.contains(S.yupError.email_id).should('not.exist');
      cy.contains(S.yupError.phone_number_length).should('not.exist');
      cy.contains(S.yupError.phone_number_matchs).should('not.exist');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('name')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    // delete department1
    cy.get('tbody')
      .contains('name')
      .parent('tr')
      .within(() => {
        cy.get('[data-test-id="delete"]').click();
      });

    cy.contains(S.action.success.deleted('name')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    //Should able to create employee with same details
    cy.contains(/Add employee/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('name');
      cy.get(`#${S.formField.username.id}`).type('username');
      cy.get(`#${S.formField.email_id.id}`).clear().type('email@gmail.com');
      cy.get(`#${S.formField.phone_number.id}`).clear().type('1234567890');
      cy.get(`#${S.formField.department.id}`).type(`${department}{enter}`);
      cy.contains(S.yupError.email_id).should('not.exist');
      cy.contains(S.yupError.phone_number_length).should('not.exist');
      cy.contains(S.yupError.phone_number_matchs).should('not.exist');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('name')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
  });
});
// Prevent TypeScript from reading file as legacy script
export {};
