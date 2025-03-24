Feature: Payment Flow

  Scenario: Navegar para página de métodos de pagamento com sucesso
    Given o usuário está na página de "Pagamento"
    When o usuário seleciona a opção "Adicionar novo cartão"
    Then o usuário vai para página de "Cadastro de cartão"

  Scenario: Cadastro de cartão concluído com sucesso
    Given o usuário está na página de "Cadastro de cartão"
    When o usuário preenche o apelido "Cartão de teste de painho", a transação "Crédito", o nome "Wilson F Torres", o código "5356614114927905", o vencimento "08/2032" e o cvc "123"
    Then o usuário vai para página de "Pagamento"
    And o usuário tem o cartão de apelido "Cartão de teste de painho" cadastrado

  Scenario: Atualização de cartão cadastrado com sucesso
    Given o usuário está na página de "Atualização de cartão"
		And o usuário tem o cartão de apelido "Cartão de teste de painho" cadastrado
    When o usuário seleciona a opção "Atualizar" o cartão "Cartão de teste de painho"
    And o usuário preenche o apelido "Cartão de teste de painho atualizado", a transação "Débito", o nome "Wilson F Torres", o código "4556737586899855", o vencimento "03/2030" e o cvc "123"
    Then o usuário vai para página de "Pagamento"
    And o usuário tem o cartão de apelido "Cartão de teste de painho atualizado" cadastrado

  Scenario: Remoção de cartão cadastrado com sucesso
		Given o usuário está na página de "Pagamento"
		And o usuário tem o cartão de apelido "Cartão de teste de painho atualizado" cadastrado
		When o usuário seleciona a opção "Remover" o cartão "Cartão de teste de painho atualizado"
		Then o usuário vai para página de "Pagamento"
		And o usuário não tem o cartão de apelido "Cartão de teste de painho atualizado" cadastrado