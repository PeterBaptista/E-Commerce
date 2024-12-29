GUI Scenario: Preenchimento bem sucedido
Given o usuário “Samuell” está logado no sistema como “aluno”
and o usuário está na página “Autoavaliação” 
when o usuário seleciona “MPA” no item “1”
and o usuário seleciona “MANA” no item “2”
and o usuário seleciona “MA” no item “3”
and o usuário seleciona “Submit”
Then aparece uma mensagem de confirmação
and o usuário está na página “Autoavaliação” 
and o usuário pode ver “MPA” no item “1”
and o usuário pode ver “MANA” no item “2”
and o usuário pode ver “MA” no item “3”

GUI Scenario: Preenchimento mal sucedido
Given o usuário “Samuell” está logado no sistema como “aluno”
and o usuário está na página “Autoavaliação” 
when o usuário seleciona “MPA” no item “1”
and o usuário seleciona “MANA” no item “2”
and o usuário seleciona “Submit” 
Then aparece uma mensagem de erro  
and o usuário está na página “Autoavaliação” 

Cenário: Cadastro de Departamento sem sucesso com nome inválido
Given o usuário “Eduardo” com e-mail “eduardocesb@gmail.com” está logado no sistema com acesso de administrador.
AND o usuário está na página “Departamentos e Categorias”
AND o usuário consegue ver a lista de “Departamentos” somente com “Eletrônicos” e “Casa”
When o usuário seleciona a opção “Adicionar Departamento”
AND o usuário tenta cadastrar o Departamento com nome “Esportes!*%”
Then o sistema deve exibir a mensagem de erro "nome com caracteres inválidos"
AND o usuário consegue ver a lista de “Departamentos” somente com “Eletrônicos” e “Casa”

Cenário: Cadastro de Categoria sem sucesso com nome repetido
Given o usuário “Eduardo” com e-mail “eduardocesb@gmail.com” está logado no sistema com acesso de administrador.
AND o usuário está na página “Departamentos e Categorias”
AND o usuário consegue ver a lista de “Categorias” somente com “Notebooks” e “Sofas”
When o usuário seleciona a opção “Adicionar Categoria”
AND o usuário tenta cadastrar a Categoria com nome “Notebooks” e seleciona o departamento “Eletrônicos”
Then o sistema deve exibir a mensagem de erro "categoria com nome repetido"
AND o usuário consegue ver a lista de “Categorias” somente com “Notebooks” e “Sofas”

Cenário: Adicionar Categoria a um item
Given o usuário “Eduardo” com e-mail “eduardocesb@gmail.com” está logado no sistema com acesso de administrador.
AND o usuário está na página “editar item” com o item “lenovo ideaped S145”
AND o usuário consegue ver a lista de “Categorias” vazia
When o usuário seleciona a opção “Adicionar Categoria ao item”
AND o usuário seleciona a categoria “Notebooks” 
AND o usuário seleciona a opção “salvar alterações”
Then aparece uma mensagem de confirmação
AND o usuário está na página “item” com o item “lenovo ideaped S145”
AND o usuário consegue ver a lista de “Categorias” somente com “Notebooks”

Cenário: Remover Categoria de um item
Given o usuário “Eduardo” com e-mail “eduardocesb@gmail.com” está logado no sistema com acesso de administrador.
AND o usuário está na página “editar item” com o item “lenovo ideaped S145”
AND o usuário consegue ver a lista de “Categorias” somente com “Notebooks” e “Casa”
When o usuário seleciona a opção “Remover <Casa>”
AND o usuário seleciona a opção “salvar alterações”
Then aparece uma mensagem de confirmação
AND o usuário está na página “item” com o item “lenovo ideaped S145”
AND o usuário consegue ver a lista de “Categorias” somente com “Notebooks”