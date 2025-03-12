Feature: Departments

Scenario: Cadastrar um departamento novo com sucesso
    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "admin"
    And não existe o departamento "Esportes"
    When o usuário tenta cadastrar o Departamento com nome "Esportes"
    Then Uma mensagem de "sucesso" é enviada
    And o usuário consegue ver "Esportes" na lista de departamentos


Scenario: Cadastrar um departamento novo com nome inválido
    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "admin"
    And não existe o departamento "%Eltro%*&"
    When o usuário tenta cadastrar o Departamento com nome "%Eltro%*&"
    Then Uma mensagem de "erro" é enviada
    And não existe "%Eltro%*&" na lista de departamentos


Scenario: Editar um departamento novo com sucesso
    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "admin"
    And existe o departamento "Eletrônicos"
    And não existe o departamento "ELETRÔNICOS"
    When o usuário tenta editar o Departamento com nome "Eletrônicos" para "ELETRÔNICOS"
    Then Uma mensagem de "sucesso" é enviada
    And o usuário consegue ver "ELETRÔNICOS" na lista de departamentos
    And não existe "Eletrônicos" na lista de departamentos

