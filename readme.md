## Fails or feels like a dream

Desafio para vaga de desenvolvedor.

### Objetivo
Desenvolver uma simples aplicação web que envie
um arquivo de imagem escolhido pelo usuário ao Firebase Storage e reconheça 
a expressão facial contida na mesma.

#### Impedimentos (dificuldades)
A tentativa de submeter e mapear resultado de análise da imagem do/ao Cloud Vision não obteve sucesso devido ao erro: 
No module named cloud in "from google.cloud import vision" na execução do servidor de desenvolvimento, mesmo o pacote estando devidamente instalado no ambiente de desenvolvimento. Esse mesmo erro aconteceu com outras libs que tentei usar para fazer requisição HTTP direta sem o uso da API do vision.

Após várias tentativas de solucionar o erro, todas sem sucesso, e julgar não ter tempo hábil para instalar e configurar outro SO para testar (como o Ubuntu) optei por realizar a requisição ao vision diretamente do front-end. O backend continuou com a função de servir o template e os arquivos estáticos.

### Percepções
Durante os testes de retorno das anotações de reconhecimento facial do Cloud Vision pude perceber que algumas imagens poderiam estar visualmente com mais de um sentimento ao nível "muito provável", então fiz questão de que o código pudesse mostrar mais de um resultado ao usuário caso isso ocorra.

Mesmo sabendo técnicas mais modernas de programação front-end e usá-las no dia-a-dia, suas bibliotecas, frameworks, transpiladores, etc., é sempre interessante voltar às origens e escrever um código puro. Essa aplicação utilizou apenas a SDK do Firebase para realizar o upload, me recordou de meus primeiros códigos JS com requisição Ajax ao PHP, ótima experiência!
