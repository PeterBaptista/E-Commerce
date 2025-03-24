Feature: Product Management


    Scenario: Adicionar um novo item ao menu
        Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "admin"
        And o usuário está na página de "Gerenciamento de Itens"
        When ele insere o nome "Monitor Gamer LG UltraGear 24 - Teste", descrição "LG UltraGear 24GS60F-B. Os gamers sabem: todo frame importa! Usar um monitor da qualidade do LG UltraGear 24 24GS60F-B 180Hz 1ms GtG NVIDIA G-SYNC AMD FreeSync faz diferença!",  preço "974.32", categoria "Notebooks", disponibilidade "3", desconto: "10", imagem "https://m.media-amazon.com/images/I/61aIuJu0M0L._AC_SL1000_.jpg"
        Then o sistema deve validar os dados inseridos
        And o item "Monitor Gamer LG UltraGear 24 - Teste" deve ser exibido na lista de itens cadastrados
        Then o sistema deve exibir a mensagem "O produto foi criado com sucesso"

        
    Scenario: Atualizar informações de um item existente
        Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "administrador"
        And o usuário está na página de "Gerenciamento de Itens"
        And o item com o nome "Monitor Gamer LG UltraGear 24 - Teste" está registrado no sistema
        When ele altera o preço para "2500.00"
        Then o sistema deve registrar a data e hora da atualização
        Then o sistema deve exibir a mensagem "O produto foi atualizado com sucesso"