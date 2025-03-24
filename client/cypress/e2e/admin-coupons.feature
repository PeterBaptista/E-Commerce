Feature: Coupons

# Happy Path


Scenario: Create a Coupon
    Given   o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "admin"
    And     o usuário está na página de "Cupons"    
    And     Não existe um cupom com nome "BrenoFriday"
    When    requisitarem o cadastro de um cupom com o nome "BrenoFriday" e a porcentagem "20"%
    Then    o sistema deve validar os dados inseridos
    Then    Uma mensagem de "Cupom criado" é enviada
    And     Cupons tem uma entrada com nome "BrenoFriday" e porcentagem "20"%

Scenario: Update Coupons
    Given   o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "admin"
    And     o usuário está na página de "Cupons"    
    And     Existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem a atualização de um cupom com o nome "BrenoFriday" e a porcentagem "30"%
    Then    o sistema deve validar os dados inseridos
    Then    Uma mensagem de "sucesso" é enviada
    And     Cupons tem uma entrada com nome "BrenoFriday" e porcentagem "30"%

Scenario: Delete a Coupon
    Given   o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "admin"
    And     o usuário está na página de "Cupons"    
    And     Existe um cupom com nome "BrenoFriday" e porcentagem "20"%
    When    requisitarem a deleção de um cupom com o nome "BrenoFriday"
    Then    Uma mensagem de "sucesso" é enviada
    And     Cupons não tem uma entrada com nome "BrenoFriday"