Funcionalidade: Cancelamento
 Como um Cliente
 Eu quero Poder cancelar pedidos que não tiveram seu pagamento aprovado
 De modo a Que eles não sejam enviados

Cenario: Cancelamento de pedido com sucesso
 Dado o usuário "Pedro" está na página de "Histórico de Pedidos"
 E o usuário consegue ver o pedido de ID "987" contendo o produto "Álgebra Linear por J. L. Boldrini" com o status: "Aguardando pagamento"
 Quando o usuário seleciona a opção de "Cancelar" no pedido "Álgebra Linear por J. L. Boldrini"
 Entao o usuário vê uma mensagem de "Confirmação de cancelamento" juntamente com "Termos para cancelamento"
 Quando o usuário seleciona a opção de "Confirmar"
 Entao o usuário está na página de "Histórico de Pedidos"
 E o usuário consegue ver o pedido "Álgebra Linear por J. L. Boldrini" com o status "cancelado"

Cenario: Cancelamento de pedido com Falho
 Dado o usuário "Lucas" está na página de "Histórico de Pedidos"
 E o usuário consegue ver o pedido "Álgebra Linear por J. L. Boldrini" com o status: "Pagamento aprovado"
 Quando o usuário seleciona a opção de "Cancelar" no pedido "Álgebra Linear por J. L. Boldrini"
 Entao aparece uma mensagem indicando "o pedido não pode ser cancelado segundo os termos de cancelamento"
 E o usuário consegue ver o pedido "Álgebra Linear por J. L. Boldrini" com o status "Pagamento aprovado"
