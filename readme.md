## Fails or feels like a dream

Desafio para vaga de desenvedor.

### Objetivo
Desenvolver uma simples aplicação web que envie
um arquivo de imagem ao Firebase Storage e reconheça 
a expressão facial contida na mesma.

#### Impedimentos (dificuldades)
A tentativa de submeter e mapear resultado de analise da imagem do/ao Cloud Vision não obteve sucesso devido ao erro: 
No module named cloud in "from google.cloud import vision", mesmo o pacote estando devidamente instalado no ambiente de desenvolvimento.

Após várias tentativas de solucionar o erro, todas sem sucesso, optei por realizar a requisição ao vision diretamente do front-end. O backend continuou com a função de servir o template e os arquivos estáticos.

A requição ao Vision poderia ser realizada pelo backend sem a nescesidade de importar a API do vision usando mesma lógica no front. Isso diminuiria a carga de código no front e uma melhor manuteção e evolução do processo de análise da imagem, mas optei por realizar em JS pela familirialidade com a linguagem.

### Percepições
Durante os destes de retorno das anotações de reconhecimento facil do Cloud Vision pude perceber que algumas imagens poderiam estar visualmente mais de um sentimento ao nivél "muito provavél", então fiz questão de que o código pudese mostrar mais de um resultado ao usuário caso isso ocorra.

Mesmo sabendo tecnicas mais modernas de programação front-end e usa-las no dia-a-dia, suas blibiotecas, frameowrks, transpiladores, etc.,
é sempre interesante voltar as origens e escrever um código puro. Essa aplicação utilizou apenas a SDK do Firebase como apoio e me recordou de quando fiz meus primeiros códigos de requisão Ajax ao meu servidor PHP, ótima experiência!