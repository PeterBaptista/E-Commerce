Scenario 1: Cadastro de cartão sem sucesso por nome incorreto
Given o usuário está na página de "Cadastro de cartão"
When seleciona a opção "Adicionar novo cartão"
And o usuário preenche o apelido “Cartão de painho”, o nome “abc”, o código “5112345678998766”, o vencimento “08/32” e o cvc “123”
Then o usuário está na página de "Cadastro de cartão"
And o sistema emite um alerta de “dados incorretos”

Scenario 2: Cadastro de cartão sem sucesso por código incorreto
Given o usuário está na página de "Cadastro de cartão"
When seleciona a opção "Adicionar novo cartão"
And o usuário preenche o apelido “Cartão de painho”, o nome “Wilson F Torres”, o código “623513”, o vencimento “08/32” e o cvc “123”
Then o usuário está na página de "Cadastro de cartão"
And o sistema emite um alerta de “dados incorretos”

Scenario 3: Cadastro de cartão sem sucesso por vencimento incorreto
Given o usuário está na página de "Cadastro de cartão"
When seleciona a opção "Adicionar novo cartão"
And o usuário preenche o apelido “Cartão de painho”, o nome “abc”, o código “5112345678998766”, o vencimento “08/12” e o cvc “123”
Then o usuário está na página de "Cadastro de cartão"
And o sistema emite um alerta de “dados incorretos”

Scenario 4: Cadastro de cartão sem sucesso por cvc incorreto
Given o usuário está na página de "Cadastro de cartão"
When seleciona a opção "Adicionar novo cartão"
And o usuário preenche o apelido “Cartão de painho”, o nome “abc”, o código “5112345678998766”, o vencimento “08/32” e o cvc “00”
Then o usuário está na página de "Cadastro de cartão"
And o sistema emite um alerta de “dados incorretos”