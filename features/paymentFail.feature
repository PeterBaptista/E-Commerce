# Cadastro e Manutenção de Métodos de Pagamento (inserir, remover, atualizar) - Lucas Carvalho

Scenario 1: Cadastro de cartão sem sucesso por nome incorreto
Given o usuário está na página de "Cadastro de cartão"
When seleciona a opção "Adicionar novo cartão"
And o usuário preenche o apelido "Cartão de painho", o nome "abc", o código "5112345678998766", o vencimento "08/32" e o cvc "123"
Then o usuário está na página de "Cadastro de cartão"
And o sistema emite um alerta de "dados incorretos"

Scenario 2: Cadastro de cartão sem sucesso por código incorreto
Given o usuário está na página de "Cadastro de cartão"
When seleciona a opção "Adicionar novo cartão"
And o usuário preenche o apelido "Cartão de painho", o nome "Wilson F Torres", o código "623513", o vencimento "08/32" e o cvc "123"
Then o usuário está na página de "Cadastro de cartão"
And o sistema emite um alerta de "dados incorretos"

Scenario 3: Cadastro de cartão sem sucesso por vencimento incorreto
Given o usuário está na página de "Cadastro de cartão"
When seleciona a opção "Adicionar novo cartão"
And o usuário preenche o apelido "Cartão de painho", o nome "abc", o código "5112345678998766", o vencimento "08/12" e o cvc "123"
Then o usuário está na página de "Cadastro de cartão"
And o sistema emite um alerta de "dados incorretos"

Scenario 4: Cadastro de cartão sem sucesso por cvc incorreto
Given o usuário está na página de "Cadastro de cartão"
When seleciona a opção "Adicionar novo cartão"
And o usuário preenche o apelido "Cartão de painho", o nome "abc", o código "5112345678998766", o vencimento "08/32" e o cvc "00"
Then o usuário está na página de "Cadastro de cartão"
And o sistema emite um alerta de "dados incorretos"

Scenario 5: Atualização de cartão cadastrado sem sucesso por código incorreto
Given o usuário está na página de "Atualização de cartão"
When o usuário seleciona a opção "Atualizar" o cartão "Cartão de painho"
And o usuário preenche o apelido "Cartão de pai", o nome "Wilson F Torres", o código "623513", o vencimento "03/30" e o cvc "123"
Then o usuário está na página de "Atualização de cartão"
And o sistema emite um alerta de "dados incorretos"

Scenario 6: Atualização de cartão cadastrado sem sucesso por vencimento incorreto
Given o usuário está na página de "Atualização de cartão"
When o usuário seleciona a opção "Atualizar" o cartão "Cartão de painho"
And o usuário preenche o apelido "Cartão de painho", o nome "Wilson F Torres", o código "5112345678998766", o vencimento "08/12" e o cvc "00"
Then o usuário está na página de "Atualização de cartão"
And o sistema emite um alerta de "dados incorretos"

Scenario 7: Atualização de cartão cadastrado sem sucesso por nome incorreto
Given o usuário está na página de "Atualização de cartão"
When o usuário seleciona a opção "Atualizar" o cartão "Cartão de painho"
And o usuário preenche o apelido "Cartão de painho", o nome "abc", o código "5112345678998766", o vencimento "08/32" e o cvc "00"
Then o usuário está na página de "Atualização de cartão"
And o sistema emite um alerta de "dados incorretos"