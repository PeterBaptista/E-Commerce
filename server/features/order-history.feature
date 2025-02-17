Feature: Histórico de Pedidos
  Como um usuário do sistema
  Quero acessar e interagir com o histórico de pedidos
  Para visualizar informações e realizar ações relacionadas a pedidos realizados


  # Cenário de Serviço: Listar Itens Dentro de um Pedido
  Scenario: Listar todos os itens dentro de um pedido específico
    Given o usuário está na página "Histórico de Pedidos"
    When clica no pedido com ID "1"
    Then o sistema exibe os itens do pedido com os seguintes detalhes:
      | id | created_at                | order_id | product_id                  | price_paid | amount |
      | 1  | 2025-02-09T18:43:41.634825+00:00 | 1        | ae5abaa3-fd1b-4f74-85bd-45fbcebeb3db | 500       | 1      |
      | 2  | 2025-02-09T18:54:58.26036+00:00  | 1        | a52f3649-aad8-4338-a263-f3393ecc1a93 | 50        | 1      |
    And o usuário permanece na página "Histórico de Pedidos"

  Scenario: Recuperar todos os pedidos registrados no sistema
    Given existem pedidos registrados no sistema
    When o sistema consulta todos os pedidos
    Then o sistema retorna todos os pedidos:
      | order_id | order_data | destination | status    | total_value |
      | 10       | 2024-02-15 | Rua G, 201  | processing| 2049        |
      | 1        | 2023-10-01 | Rua A, 123  | delivered | 550         |
      | 2        | 2023-09-25 | Rua B, 456  | shipped   | 200         |
      | 6        | 2023-09-20 | Rua F, 404  | canceled  | 1689.2      |
      | 3        | 2023-09-20 | Rua C, 789  | pending   | 150         |
      | 4        | 2023-09-15 | Rua D, 101  | canceled  | 300         |
      | 5        | 2023-09-10 | Rua E, 202  | delivered | 100         |

  # Cenário de Serviço: Recuperar os 3 Pedidos Mais Recentes
  Scenario: Recuperar os 3 pedidos mais recentes do usuário
    Given o usuário atual possui pedidos registrados
    When o sistema consulta os 3 pedidos mais recentes do usuário
    Then o sistema retorna os seguintes pedidos:
      | order_id | order_data | destination   | status    | total_value |
      | 10       | 2024-02-15 | Rua G, 201  | processing| 2049        |
      | 1  | 2023-10-01 | Rua A, 123    | delivered | 550         |
      | 2  | 2023-09-25 | Rua B, 456    | shipped   | 200         |
      #| 3  | 2023-09-20 | Rua C, 789    | pending   | 150         |

  