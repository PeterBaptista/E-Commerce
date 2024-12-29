Feature: Cadastro e manutenção de itens no menu

    Scenario: Adicionar um novo item ao menu

    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "administrador"
    And o usuário está na página de "Gerenciamento de Itens"
    When ele insere o nome "Redmi Note 13 pro", descrição "Celular de última geração", preço "2000.00", categoria "Celulares", disponibilidade "Disponível"
    And ele anexa uma imagem representativa em "img item"
    Then o sistema deve validar os dados inseridos
    And o item deve ser exibido na lista de itens cadastrados
    Then o sistema deve exibir a mensagem "Item cadastrado com sucesso"



    Scenario: Impedir a exclusão de um item associado a pedidos em andamento

    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "administrador"
    And o usuário está na página de "Gerenciamento de Itens"
    And o item "Redmi Note 13 pro" está associado a pedidos em andamento
    When ele solicita a exclusão do item da lista "Lista de itens"
    Then o sistema deve exibir a mensagem de erro "Itens associados com pedidos não podem ser excluídos"
    And o item "Redmi Note 13 pro" deve permanecer na lista "Lista de itens"
    Then o sistema deve redirecionar o usuário para a página de "Gerenciamento de Itens"


    Scenario: Adicionar um item com dados inválidos

    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "administrador"
    And o usuário está na página de "Gerenciamento de Itens"
    When ele insere o preço "Texto string"
    Then o sistema deve exibir a mensagem de erro "Preço deve ser numérico"
    And o sistema não deve salvar o item


    Scenario: Remover um item não associado a pedidos em andamento

    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "administrador"
    And o usuário está na página de "Gerenciamento de Itens"
    And o item "Redmi Note 13 pro" não está associado a pedidos em andamento
    When ele solicita a exclusão do item
    Then o sistema deve exibir a mensagem de confirmação "Você tem certeza que deseja excluir esse item?"
    And após a confirmação, o sistema deve remover o item da lista de itens
    Then o sistema deve exibir a mensagem "Item excluído com sucesso"

    Scenario: Atualizar informações de um item existente

    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "administrador"
    And o usuário está na página de "Gerenciamento de Itens"
    And o item "Redmi Note 13 pro" está registrado no sistema
    When ele altera o preço para "2500.00"
    And clica em salvar alterações
    Then o sistema deve registrar a data e hora da atualização
    And o item deve ser atualizado na lista de itens
    Then o sistema deve exibir a mensagem "Item atualizado com sucesso :)"
