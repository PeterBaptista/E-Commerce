Feature: Coupons

# Happy Path

Scenario: Get all Coupons
    Given   cleanup
    Given   Existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    And     Existe um cupom com nome "BrenoSaturday" e porcentagem "20"%
    And     "Coupons" tem apenas "2" entradas
    When    requisitarem todos os cupons disponíveis
    Then    Uma mensagem de "sucesso" é enviada
    And     Cupons tem uma entrada com nome "BrenoFriday" e porcentagem "20"%
    And     Cupons tem uma entrada com nome "BrenoSaturday" e porcentagem "20"%

Scenario: Create a Coupons
    Given   cleanup
    Given   Existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    Given   Não existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem o cadastro de um cupom com o nome "BrenoFriday" e a porcentagem "20"%
    Then    Uma mensagem de "sucesso" é enviada
    And     Cupons tem uma entrada com nome "BrenoFriday" e porcentagem "20"%

Scenario: Delete Coupons
    Given   cleanup
    Given   Existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem a deleção de um cupom com o nome "BrenoFriday"
    Then    Uma mensagem de "sucesso" é enviada
    And     Cupons não tem uma entrada com nome "BrenoFriday"

Scenario: Update Coupons
    Given   cleanup
    Given   Existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem a atualização de um cupom com o nome "BrenoFriday" e a porcentagem "30"%
    Then    Uma mensagem de "sucesso" é enviada
    And     Cupons tem uma entrada com nome "BrenoFriday" e porcentagem "30"%

# Sad Path

Scenario: Create a Coupons with invalid data
    Given   cleanup
    Given   Não existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem o cadastro de um cupom com o nome "BrenoFriday" e a porcentagem "200"%
    Then    Uma mensagem de "erro" é enviada
    And     Cupons não tem uma entrada com nome "BrenoFriday"

Scenario: Delete Coupons that does not exist
    Given   cleanup
    Given   Não existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem a deleção de um cupom com o nome "BrenoFriday"
    Then    Uma mensagem de "erro" é enviada
    And     Cupons não tem uma entrada com nome "BrenoFriday"

Scenario: Update Coupons that does not exist
    Given   cleanup
    Given   Não existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem a atualização de um cupom com o nome "BrenoFriday" e a porcentagem "30"%
    Then    Uma mensagem de "erro" é enviada
    And     Cupons não tem uma entrada com nome "BrenoFriday"

Scenario: Update Coupons with invalid data
    Given   cleanup
    Given   Existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem a atualização de um cupom com o nome "BrenoFriday" e a porcentagem "200"%
    Then    Uma mensagem de "erro" é enviada
    And     Cupons tem uma entrada com nome "BrenoFriday" e porcentagem "20"%

Scenario: Create a Coupon that already exists
    Given   cleanup
    Given   Existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem o cadastro de um cupom com o nome "BrenoFriday" e a porcentagem "30"%
    Then    Uma mensagem de "erro" é enviada
    And     Cupons tem uma entrada com nome "BrenoFriday" e porcentagem "20"%

# Edge Scenarios

Scenario: Get all Coupons when there is none
    Given   cleanup
    And     "Coupons" tem apenas "0" entradas
    When    requisitarem todos os cupons disponíveis
    Then    Uma mensagem de "sucesso" é enviada
    And     "Coupons" tem "0" entradas
