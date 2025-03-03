Feature: Cancelamento

Scenario: Cancelamento de pedido com sucesso
    Given O histórico de pedidos tem um pedido de ID "987" com status "pending"
    And associdados ao pedido há apenas o produto de ID "239a30b8-a117-4997-a52e-bcfb258636ba" com "9" unidades
    And o produto de ID "239a30b8-a117-4997-a52e-bcfb258636ba" tem "1" unidade em estoque
    When tenta se cancelar o pedido de ID "987"
    Then No histórico de pedidos, o status atual do pedido é "canceled"
    And o produto de ID "239a30b8-a117-4997-a52e-bcfb258636ba" tem atualmente "10" unidade em estoque

Scenario: Cancelamento de pedido com Falho
    Given O histórico de pedidos tem um pedido de ID "879" com status "delivered"
    When tenta se cancelar o pedido de ID "879"
    Then No histórico de pedidos, o status atual do pedido é "delivered"
    And aparece uma mensagem indicando: "Order couldn't be canceled due to status"
