Feature: Histórico de Pedidos
  Como um usuário do sistema
  Quero acessar e interagir com o histórico de pedidos
  Para visualizar informações e realizar ações relacionadas a pedidos realizados

  Scenario: Verificar a exibição inicial dos pedidos mais recentes
    Given o usuário está na página "Histórico de Pedidos"
    Then o sistema deve exibir os 3 pedidos mais recentes com os seguintes detalhes:
      | Pedido ID | Data       | Valor Total | Local de envio | Status do pedido |
      | 1         | 2023-10-01 | 550.00      | Rua A, 123     | Entregue         |
      | 2         | 2023-09-25 | 200.00      | Rua B, 456     | Em trânsito      |
      | 3         | 2023-09-20 | 150.00      | Rua C, 789     | Pendente         |

  Scenario: Visualizar todos os pedidos ao clicar no botão "Ver Todos os Pedidos"
    Given o usuário está na página "Histórico de Pedidos"
    When clica no botão "Ver Todos os Pedidos"
    Then o sistema deve exibir todos os pedidos realizados pelo usuário com os seguintes detalhes:
      | Pedido ID | Data       | Valor Total | Local de envio | Status do pedido |
      | 1         | 2023-10-01 | 550.00      | Rua A, 123     | Entregue         |
      | 2         | 2023-09-25 | 200.00      | Rua B, 456     | Em trânsito      |
      | 3         | 2023-09-20 | 150.00      | Rua C, 789     | Pendente         |
      | 4         | 2023-09-15 | 300.00      | Rua D, 101     | Cancelado        |
      | 5         | 2023-09-10 | 100.00      | Rua E, 202     | Entregue         |

  Scenario: Exibir mensagem quando o usuário não possui pedidos
    Given o usuário está na página "Histórico de Pedidos"
    And não existem pedidos registrados para o usuário
    Then o sistema deve exibir a mensagem "Você ainda não realizou nenhum pedido."