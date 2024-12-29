Feature: Cadastro e manutenção de itens no menu

    Scenario: Adicionar um novo item ao menu

    Given o usuário “Breninho” com e-mail “breninho@gmail.com” está logado no sistema com acesso de “administrador”
    And o usuário está na página de "Gerenciamento de Itens"
    When ele insere o nome "Redmi Note 13 pro", descrição "Celular de última geração", preço "2000.00", categoria "Celulares", disponibilidade "Disponível"
    And ele anexa uma imagem representativa em "img item"
    Then o sistema deve validar os dados inseridos
    And o item deve ser exibido na lista de itens cadastrados



    Scenario: Impedir a exclusão de um item associado a pedidos em andamento

    Given o usuário “Breninho” com e-mail “breninho@gmail.com” está logado no sistema com acesso de “administrador”
    And o usuário está na página de "Gerenciamento de Itens"
    And o item "Redmi Note 13 pro" está associado a pedidos em andamento
    When ele solicita a exclusão do item da lista "Lista de itens"
    Then o sistema deve exibir a mensagem de erro "Itens associados com pedidos não podem ser excluídos"
    And o item "Redmi Note 13 pro" deve permanecer na lista "Lista de itens"
