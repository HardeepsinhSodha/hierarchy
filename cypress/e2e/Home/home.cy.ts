/// <reference types="cypress" />
import { controller as SE } from '../../../components/employee/controller';
import { controller as SG } from '../../../components/group_info/controller';
import { controller as S } from '../../../components/tree/controller';
import { employeeData } from '../../../data/employee';
import { groupAllDetails as GD } from '../../../data/group';
const groupCEO = {
  ...GD[1],
  admin: GD?.[1].admin ? employeeData[GD?.[1]?.admin] : undefined,
  children: GD[1].children?.map((child) => GD?.[child.child_group_id]),
};
describe('Tree Test', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('http://localhost:3000/');
  });
  it('Position and Name should be shown', () => {
    cy.get(`#${S.formField.employee.id}`).type(
      `${groupCEO.admin?.name}{enter}`
    );
    cy.get(`#${S.formField.group.id}`)
      .contains(`${groupCEO.name}`)
      .should('exist');
    cy.contains(`${groupCEO.name} | ${groupCEO.admin?.name}`).should('exist');
  });
  it('Promote Employee to the top level', () => {
    cy.get(`#${S.formField.employee.id}`).type('Naruto Uzumaki{enter}');
    cy.get(`#${S.formField.group.id}`).contains(`Team 7`).should('exist');
    cy.get('[data-test-id="tree"]').within(() => {
      cy.contains(`Naruto Uzumaki`)
        .click()
        .parent('div')
        .find('[data-test-id="promoteEmployee"]')
        .click();
      cy.contains(`Team 7 | Naruto Uzumaki`).should('exist');
    });
    cy.contains(SG.action.success.promoted).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    cy.get('[data-test-id="tree"]').within(() => {
      //promote admin employee to parent's group admin postion
      cy.contains(`Naruto Uzumaki`)
        .parent('div')
        .find('[data-test-id="promoteAdmin"]')
        .click();
    });
    cy.contains(`Hidden leaf | Naruto Uzumaki`).should('exist');
    cy.contains(SG.action.success.promoted).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    // promote to top level
    cy.get('[data-test-id="tree"]').within(() => {
      //promote admin employee to parent's group admin postion
      cy.contains(`Naruto Uzumaki`)
        .parent('div')
        .find('[data-test-id="promoteAdmin"]')
        .click();
    });
    cy.contains(`CEO | Naruto Uzumaki`).should('exist');
    cy.contains(SG.action.success.promoted).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
    cy.get('[data-test-id="tree"]').within(() => {
      //promote admin employee to parent's group admin postion
      cy.contains(`Naruto Uzumaki`)
        .parent('div')
        .find('[data-test-id="promoteAdmin"]')
        .click();
    });
    cy.contains(SG.action.success.noPlaceToPromote).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
  });
  it('Edit employee Details', () => {
    cy.get(`#${S.formField.employee.id}`).type('Naruto Uzumaki{enter}');
    cy.get(`#${S.formField.group.id}`).contains(`Team 7`).should('exist');
    cy.get('[data-test-id="tree"]').within(() => {
      cy.contains(`Naruto Uzumaki`)
        .click()
        .parent('div')
        .find('[data-test-id="editEmployeeDetails"]')
        .click();
    });
    cy.get(`#${SE.formField.name.id}`).clear().type('Hero Naruto Uzumaki');
    cy.get(`button[type=submit][form="${SE.formId}"]`).click();
    cy.contains(SE.action.success.edited('Hero Naruto Uzumaki')).should(
      'exist'
    );
    cy.get('[data-test-id="remove-alert"]').click();
  });
  it('Edit Head employee Details', () => {
    cy.get(`#${S.formField.employee.id}`).type('Naruto Uzumaki{enter}');
    cy.get(`#${S.formField.group.id}`).contains(`Team 7`).should('exist');
    cy.get('[data-test-id="tree"]').within(() => {
      cy.contains(`Kakashi Hatake`)
        .click()
        .parent('div')
        .find('[data-test-id="editEmployeeDetails"]')
        .click();
    });
    cy.get(`#${SE.formField.name.id}`).clear().type('Hero Kakashi Hatake');
    cy.get(`button[type=submit][form="${SE.formId}"]`).click();
    cy.contains(SE.action.success.edited('Hero Kakashi Hatake')).should(
      'exist'
    );
    cy.get('[data-test-id="remove-alert"]').click();
  });
  it('Edit Group details', () => {
    cy.get(`#${S.formField.employee.id}`).type('Naruto Uzumaki{enter}');
    cy.get(`#${S.formField.group.id}`).contains(`Team 7`).should('exist');
    cy.get('[data-test-id="tree"]').within(() => {
      cy.contains(`Kakashi Hatake`)
        .click()
        .parent('div')
        .find('[data-test-id="editGroupDetails"]')
        .click();
    });
    cy.get(`[id="${SG.formId}"]`).within(() => {
      cy.get(`#${SG.formField.name.id}`).clear().type('Team 7+');
      cy.get(`#${SG.formField.title.id}`).clear().type('HoD');
    });
    cy.get(`button[type=submit][form="${SG.formId}"]`).click();
    cy.contains(SG.action.success.edited('Team 7+')).should('exist');
    cy.get('[data-test-id="remove-alert"]').click();
  });
});
// Prevent TypeScript from reading file as legacy script
export {};
