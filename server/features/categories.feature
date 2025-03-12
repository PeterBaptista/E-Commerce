Feature: Categories

Scenario: Cadastrar uma categoria nova com sucesso
    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "admin"
    And não existe a categoria "Notebooks"
    And existe o departamento "Eletrônicos"
    When o usuário tenta cadastrar a Categoria com nome "Notebooks" e o departamento "Eletrônicos"
    Then Uma mensagem de "sucesso" é enviada
    And o usuário consegue ver "Notebooks" na lista de categorias


Scenario: Cadastrar uma categoria com nome repetido
    Given o usuário "Breninho" com e-mail "breninho@gmail.com" está logado no sistema com acesso de "admin"
    And existe o departamento "Eletrônicos"
    And existe a categoria "Acessorios" do departamento "Eletrônicos"
    When o usuário tenta cadastrar a Categoria com nome "Acessorios" e o departamento "Eletrônicos"
    Then Uma mensagem de "erro" é enviada
    And o usuário consegue ver "Acessorios" na lista de categorias

