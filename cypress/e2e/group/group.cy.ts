/// <reference types="cypress" />
import { controller as SD } from '../../../components/department/controller';
import { controller as SE } from '../../../components/employee/controller';
import { controller as S } from '../../../components/group_info/controller';
const department1 = 'department1';
const department2 = 'department2';
describe('Department Test', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    //create departments
    cy.visit('http://localhost:3000/department-info');
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${SD.formField.name.name}`).type(department1);
    });
    cy.get('button[type=submit]').click();
    cy.contains(SD.action.success.added(department1)).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    cy.contains(/Add department/i).click();
    cy.get('form').within(() => {
      cy.get(`#${SD.formField.name.name}`).type(department2);
    });
    cy.get('button[type=submit]').click();
    cy.contains(SD.action.success.added(department2)).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    //add employees
    cy.visit('http://localhost:3000/employee');
    cy.contains(/Add employee/i).click();
    cy.get('form').within(() => {
      cy.get(`#${SE.formField.name.id}`).type('name1');
      cy.get(`#${SE.formField.username.id}`).type('username1');
      cy.get(`#${SE.formField.email_id.id}`).clear().type('email1@gmail.com');
      cy.get(`#${SE.formField.phone_number.id}`).clear().type('1234567891');
      cy.get(`#${SE.formField.department.id}`).type(`${department1}{enter}`);
    });
    cy.get('button[type=submit]').click();
    cy.contains(SE.action.success.added('name1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    //add another employee
    cy.contains(/Add employee/i).click();
    cy.get('form').within(() => {
      cy.get(`#${SE.formField.name.id}`).type('name2');
      cy.get(`#${SE.formField.username.id}`).type('username2');
      cy.get(`#${SE.formField.email_id.id}`).clear().type('email2@gmail.com');
      cy.get(`#${SE.formField.phone_number.id}`).clear().type('1234567892');
      cy.get(`#${SE.formField.department.id}`).type(`${department2}{enter}`);
    });
    cy.get('button[type=submit]').click();
    cy.contains(SE.action.success.added('name2')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    cy.visit('http://localhost:3000/group-info');
    cy.get('button[type=submit]').as('submitBtn');
  });

  it('Create Group', () => {
    cy.contains(/Add group/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).click();
      cy.get(`#${S.formField.title.id}`).click();

      cy.contains(S.yupError.required).should('exist');

      cy.get(`#${S.formField.name.id}`).type('teamName1');
      cy.get(`#${S.formField.title.id}`).type('Title');

      cy.get(`#${S.formField.admin.id}`).type('name1');
      cy.get(`#${S.formField.allowedDepartments.id}`).type(
        `${department1}{enter}`
      );
      cy.get(`#${S.formField.removable.id}`).should('be.visible');

      cy.get(`#${S.formField.canHaveSubGroup.id}`).uncheck();
      cy.get(`#${S.formField.children.id} input`).should('be.disabled');
      cy.get(`#${S.formField.canHaveSubGroup.id}`).check();
      cy.get(`#${S.formField.children.id} input`).should('not.be.disabled');

      cy.get(`#${S.formField.canHaveMembers.id}`).uncheck();
      cy.get(`#${S.formField.members.id} input`).should('be.disabled');
      cy.get(`#${S.formField.canHaveMembers.id}`).check();
      cy.get(`#${S.formField.members.id} input`).should('not.be.disabled');
      cy.get(`#${S.formField.members.id}`).type('name');
      // as we have selected department1 in allowedDepartments, department2's employee should be not there
      cy.contains('name2').should('not.exist');
      // now select department2 aswell
      cy.get(`#${S.formField.allowedDepartments.id}`).type(
        `${department2}{enter}`
      );
      cy.get(`#${S.formField.members.id}`)
        .find('[type="text"]')
        .clear()
        .type('name');

      cy.contains('name2').should('exist');
      cy.get(`#${S.formField.members.id}`)
        .find('[type="text"]')
        .clear()
        .type('name1{enter}');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('teamName1')).should('exist');
  });
  it('Two group can not have same team name', () => {
    // create group with teamName1
    cy.contains(/Add group/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('teamName1');
      cy.get(`#${S.formField.title.id}`).type('Title');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('teamName1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    // create another group with same teamName1 and check for duplication error
    cy.contains(/Add group/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('teamName1');
      cy.get(`#${S.formField.title.id}`).type('Title');
      cy.get('@submitBtn').click();
      cy.contains(S.action.error.nameDuplication).should('exist');
      cy.get(`#${S.formField.name.id}`).clear().type('teamName2');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('teamName2')).should('exist');
  });
  it('Edit team', () => {
    // create group with teamName1
    cy.contains(/Add group/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('teamName1');
      cy.get(`#${S.formField.title.id}`).type('Title');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('teamName1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    // create another group with name teamName2
    cy.contains(/Add group/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).clear().type('teamName2');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('teamName2')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    //Edit first record
    cy.get('tbody')
      .contains('teamName1')
      .parent('tr')
      .within(() => {
        cy.get('[data-test-id="edit"]').click();
      });
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).clear().type('teamName2');
      cy.get('@submitBtn').click();
      cy.contains(S.action.error.nameDuplication, { timeout: 5000 }).should(
        'exist'
      );
      cy.get(`#${S.formField.name.id}`).clear().type('teamName3');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.edited('teamName3')).should('exist');
  });
  it('chagne member in Group', () => {
    // create group with teamName1
    cy.contains(/Add group/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('teamName1');
      cy.get(`#${S.formField.title.id}`).type('Title');
      cy.get(`#${S.formField.admin.id}`).type('name2{enter}');
      cy.get(`#${S.formField.allowedDepartments.id}`).type(
        `${department1}{enter}`
      );
      cy.get(`#${S.formField.members.id}`).type('name1{enter}');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('teamName1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    //Edit first record
    cy.get('tbody')
      .contains('teamName1')
      .parent('tr')
      .within(() => {
        cy.get('[data-test-id="edit"]').click();
      });
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).clear().type('teamName2');
      cy.get(`#${S.formField.admin.id}`)
        .find('[type="text"]')
        .clear()
        .type('name1{enter}');
      cy.get(`#${S.formField.allowedDepartments.id}`)
        .find('[type="text"]')
        .clear()
        .type(`${department2}{enter}`);
      cy.get(`#${S.formField.members.id}`)
        .find('[type="text"]')
        .clear()
        .type('name2{enter}');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.edited('teamName2')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    cy.get('tbody')
      .contains('teamName2')
      .parent('tr')
      .within(() => {
        cy.contains('name1').should('exist');
        cy.contains(department2).should('exist');
        cy.contains('name2').should('exist');
      });
  });
  it('delete Group', () => {
    // create group with teamName1
    cy.contains(/Add group/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('teamName1');
      cy.get(`#${S.formField.title.id}`).type('Title');
      cy.get(`#${S.formField.admin.id}`).type('name2{enter}');
      cy.get(`#${S.formField.allowedDepartments.id}`).type(
        `${department1}{enter}`
      );
      cy.get(`#${S.formField.members.id}`).type('name1{enter}');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('teamName1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    //Edit first record
    cy.get('tbody')
      .contains('teamName1')
      .parent('tr')
      .within(() => {
        cy.get('[data-test-id="delete"]').click();
      });
    cy.contains(S.action.success.deleted('teamName1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();

    // again create Same record to check that we don't get duplication team name error
    cy.contains(/Add group/i).click();
    cy.get('form').within(() => {
      cy.get(`#${S.formField.name.id}`).type('teamName1');
      cy.get(`#${S.formField.title.id}`).type('Title');
      cy.get(`#${S.formField.admin.id}`).type('name2{enter}');
      cy.get(`#${S.formField.allowedDepartments.id}`).type(
        `${department1}{enter}`
      );
      cy.get(`#${S.formField.members.id}`).type('name1{enter}');
      cy.get('@submitBtn').click();
    });
    cy.contains(S.action.success.added('teamName1')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
  });
});
// Prevent TypeScript from reading file as legacy script
export {};
