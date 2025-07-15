const ListaDeExerciciosItems = [
    {
        numero: '01',
        titulo: 'Hello World!',
        link: '/Exercicio/',
        status: false,
        resolucao: 'Resolução Correta',
        

        introducao: 'O Hello World é uma frase que todo programador apresenta como sinal de sucesso de seu primeiro programa. Vamos manter o objetivo, mas com uma execução diferente. Crie um programa que apresente 4 vezes a frase “Hello, World!”, cada qual de uma forma distinta, conforme a saída abaixo.',

        dica: 'Dica 01',
        explicacao: 'Para realizar uma quebra de linha, utilize o comando \n.',
        solucao: 'Por exemplo: o comando printf("Exemplo\n01"); imprime a seguinte saída:',
        ExImg: '.png../../../public/img/Exemplo01.png',
        
        dica2: 'Dica 02',
        explicacao2: 'Para realizar uma tabulação, utilize o comando \t.',
        note: 'Por exemplo: o comando printf("Exemplo\t01"); imprime a seguinte saída: \n.,',
        ExImg2: '.png../../../public/img/Exemplo01.png',

        funcao: "1. Função print()",
        explixacao: "Está contida na biblioteca stidio.h e possibilita ao programador apresentar na tela os valores resultantes de expressões, variáveis ou simplistemente uma caddeia de caracteres (sting). Sua sintaxe possui duas forma:",
        expm: 'printf("cadeia_de_caracteres"); printf("expressão_de_controle", argumentos);',

        text: 'Nossa equipe de nerds não cadastrou nenhuma dica para esse quesito =[',
        passos: '',   

        int: 'Consulte abaixo a resolução de um algoritmo que envolve passos similares aos quais você usará em suas resoluções.',
        operacao: '4 Operações Matemáticas',
        int2: 'Construa um algoritmo que represente as 4 operações básicas da matemática.',
        codigo: '#include <stdio.h> int main (void) { int numero1, numero2, soma, subtracao, multiplicacao; float divisao; printf("Digite o primeiro numero:\n"); scanf("%d", &numero1); printf("Digite o segundo numero:\n"); scanf("%d", &numero2); soma = numero1 + numero2; subtracao = numero1 - numero2; multiplicacao = numero1 * numero2; divisao = numero1 / numero2; printf("\nA soma eh %d", soma); printf("\nA subtracao eh %d", subtracao); printf("\nA multiplicacao eh %d", multiplicacao); printf("\nA divisao eh %f", divisao); return (0); }',
    },

    {
        numero: '02',
        titulo: 'Média Aritmética',
        link: '/Exercicio',
        status: true,
        resolucao: 'Resolução Correta',
        

        introducao: 'Crie um programa que receba três notas do usuário e calcule a média aritmética dos valores fornecidos.',

        dica: 'Dica 01',
        explicacao: 'Para realizar o cálculo da média aritmética, você vai precisar de 3 notas, representativas das notas em cada unidade para o estudante. Perceba que o tipo mais adequado para se representar notas em um algoritmo é o float. \n.',

        funcao: "1. Função print()",
        explixacao: "Está contida na biblioteca stidio.h e possibilita ao programador apresentar na tela os valores resultantes de expressões, variáveis ou simplistemente uma caddeia de caracteres (sting). Sua sintaxe possui duas forma:",
        expm: 'printf("cadeia_de_caracteres"); printf("expressão_de_controle", argumentos);',

        text: 'A Descrição Detalhada do exercício consiste em sua resolução na forma de uma sequência de passos, que irão reger o algoritmo a ser escrito por você. Leia a descrição com calma e transcreva-a para a Linguagem de Programação adotada para a lista de exercícios.',
        passos: 'Para a resolução do exercício 02, considere os passos a seguir: 1. Crie as variáveis representativas das notas. O tipo mais recomendado é o float; 2. Crie uma quarta variável, que irá armazenar o valor da média. Também recomenda-se que o seu tipo seja float; 3. Solicite e atribua valores às variáveis criadas no passo 1; 4. Calcule a média e atribua o valor à variável criada no passo 2; 5. Apresente o valor obtido para a média.',

        int: 'Consulte abaixo a resolução de um algoritmo que envolve passos similares aos quais você usará em suas resoluções.',
        operacao: '4 Operações Matemáticas',
        int2: 'Construa um algoritmo que represente as 4 operações básicas da matemática.',
        codigo: '#include <stdio.h> int main (void) { int numero1, numero2, soma, subtracao, multiplicacao; float divisao; printf("Digite o primeiro numero:\n"); scanf("%d", &numero1); printf("Digite o segundo numero:\n"); scanf("%d", &numero2); soma = numero1 + numero2; subtracao = numero1 - numero2; multiplicacao = numero1 * numero2; divisao = numero1 / numero2; printf("\nA soma eh %d", soma); printf("\nA subtracao eh %d", subtracao); printf("\nA multiplicacao eh %d", multiplicacao); printf("\nA divisao eh %f", divisao); return (0); }',
    },

    {
        numero: '03',
        titulo: 'Troca de Valores',
        link: '#',
        status: true,
        resolucao: 'Resolução Correta',
        

        introducao:'Crie um programa que solicita e lê dois números (atribua esses valores às variáveis x e y, respectivamente) e realiza a troca de valores entre essas variáveis - isto é, ao final da execução a variável x deve conter o valor inicial de y e vice-versa.',

        dica: 'Dica 01',
        explicacao: 'Para realizar a troca de valores entre duas variáveis, você deve atentar à forma sequencial que rege o fluxo de execução de um algoritmo. Neste sentido, o que for feito nas linhas anteriores terá efeito nas linhas posteriores, ou seja, não basta apenas declarar: x = y; y = x;',
        note: 'Note que na forma acima, a variável x tem seu valor sobrescrito pelo valor da variável y. Em seguida, y recebe o valor da variável x, que já tinha o valor de y. Em resumo, a variável y continuou com o mesmo valor, o que está errado.',

        funcao: "1. Função print()",
        explixacao: "Está contida na biblioteca stidio.h e possibilita ao programador apresentar na tela os valores resultantes de expressões, variáveis ou simplistemente uma caddeia de caracteres (sting). Sua sintaxe possui duas forma:",
        expm: 'printf("cadeia_de_caracteres"); printf("expressão_de_controle", argumentos);',

        text: 'A Descrição Detalhada do exercício consiste em sua resolução na forma de uma sequência de passos, que irão reger o algoritmo a ser escrito por você. Leia a descrição com calma e transcreva-a para a Linguagem de Programação adotada para a lista de exercícios.',
        passos: 'Para a resolução do exercício 03, considere os passos a seguir: 1. Crie duas variáveis do tipo inteiro; 2. Crie uma terceira variável, também do tipo inteiro. Esta irá auxiliar a troca de valores; 3. Solicite ao usuário dois valores e atribua-os às variáveis criadas no passo 1; 4. Apresente os valores atribuídos às variáveis criadas no passo 1; 5. Atribua à variável auxiliar, criada no passo 2, o valor de uma das variáveis criadas no passo 1; 6. Realize a troca de valores, considerando o valor armazenado na variável auxiliar; 7. Apresente os novos valores atribuídos às variáveis criadas no passo 1.',
        
        int: 'Consulte abaixo a resolução de um algoritmo que envolve passos similares aos quais você usará em suas resoluções.',
        operacao: '4 Operações Matemáticas',
        int2: 'Construa um algoritmo que represente as 4 operações básicas da matemática.',
        codigo: '#include <stdio.h> int main (void) { int numero1, numero2, soma, subtracao, multiplicacao; float divisao; printf("Digite o primeiro numero:\n"); scanf("%d", &numero1); printf("Digite o segundo numero:\n"); scanf("%d", &numero2); soma = numero1 + numero2; subtracao = numero1 - numero2; multiplicacao = numero1 * numero2; divisao = numero1 / numero2; printf("\nA soma eh %d", soma); printf("\nA subtracao eh %d", subtracao); printf("\nA multiplicacao eh %d", multiplicacao); printf("\nA divisao eh %f", divisao); return (0); }',
    },
    {
        numero: '04',
        titulo: 'Volume',
        link: '#',
        status: true,
        resolucao: 'Resolução Correta',
        

        introducao: 'Crie um programa que calcule e apresente o valor do volume de uma lata de óleo, utilizando a fórmula abaixo, na qual r é o raio de sua base e h é a sua altura. Defina uma constante chamada PI correspondente ao valor aproximado de π.',
        
        dica: 'Dica 01',
        explicacao: 'Para definir uma constante inicializada com um valor, utilize o seguinte comando após a declaração da biblioteca: #define VARIAVEL VALOR',
        note: 'Note que VARIAVEL refere-se ao nome da variável e VALOR ao seu respectivo valor.',

        funcao: "1. Função print()",
        explixacao: "Está contida na biblioteca stidio.h e possibilita ao programador apresentar na tela os valores resultantes de expressões, variáveis ou simplistemente uma caddeia de caracteres (sting). Sua sintaxe possui duas forma:",
        expm: 'printf("cadeia_de_caracteres"); printf("expressão_de_controle", argumentos);',

        text: 'A Descrição Detalhada do exercício consiste em sua resolução na forma de uma sequência de passos, que irão reger o algoritmo a ser escrito por você. Leia a descrição com calma e transcreva-a para a Linguagem de Programação adotada para a lista de exercícios.',
        passos: 'Para a resolução do exercício 04, considere os passos a seguir: 1. Crie variáveis representativas dos valores do raio e altura, necessários para o cálculo do volume da lata de óleo. Recomenda-se o uso do tipo float; 2. Crie uma terceira variável, que irá armazenar o valor obtido para o volume. Também recomenda-se o uso do tipo float; 3. Solicite e atribua valores às variáveis criadas no passo 1; 4. Calcule o volume utilizando os valores obtidos no passo 3. Atribua o resultado à variável criada no passo 2; 5. Apresente o volume.',

        int: 'Consulte abaixo a resolução de um algoritmo que envolve passos similares aos quais você usará em suas resoluções.',
        operacao: '4 Operações Matemáticas',
        int2: 'Construa um algoritmo que represente as 4 operações básicas da matemática.',
        codigo: '#include <stdio.h> int main (void) { int numero1, numero2, soma, subtracao, multiplicacao; float divisao; printf("Digite o primeiro numero:\n"); scanf("%d", &numero1); printf("Digite o segundo numero:\n"); scanf("%d", &numero2); soma = numero1 + numero2; subtracao = numero1 - numero2; multiplicacao = numero1 * numero2; divisao = numero1 / numero2; printf("\nA soma eh %d", soma); printf("\nA subtracao eh %d", subtracao); printf("\nA multiplicacao eh %d", multiplicacao); printf("\nA divisao eh %f", divisao); return (0); }',
    },
    {
        numero: '05',
        titulo: 'Flores de Aniversário',
        link: '#',
        status: true,
        resolucao: 'Resolução Correta',
        

        introducao: 'O aniversário da mãe de Maria Clara está chegando e ela deseja presenteá-la com flores. Maria pesquisou preços e descobriu que uma rosa custa R$ 2,80 e que uma tulipa custa R$4,20. Agora, ela quer fazer algumas simulações para decidir quantas flores pode comprar com seu salário. Dada a situação, crie um programa que receba como entrada uma quantidade de rosas e uma quantidade de tulipas e exiba o valor total necessário para comprá-las.',

        dica: 'Dica 01',
        explicacao: 'Para realizar o cálculo do preço das rosas e das tulipas, você precisará do quantitativo de flores que Maria deseja comprar. Neste sentido, receba a quantidade de rosas e a quantidade de tulipas para só, então, calcular o preço que Maria irá pagar pelo total de flores de cada tipo.',
        note: '',

        funcao: "1. Função print()",
        explixacao: "Está contida na biblioteca stidio.h e possibilita ao programador apresentar na tela os valores resultantes de expressões, variáveis ou simplistemente uma caddeia de caracteres (sting). Sua sintaxe possui duas forma:",
        expm: 'printf("cadeia_de_caracteres"); printf("expressão_de_controle", argumentos);',

        text: 'A Descrição Detalhada do exercício consiste em sua resolução na forma de uma sequência de passos, que irão reger o algoritmo a ser escrito por você. Leia a descrição com calma e transcreva-a para a Linguagem de Programação adotada para a lista de exercícios.',
        passos: 'Para a resolução do exercício 05, considere os passos a seguir: 1. Crie variáveis representativas do total de rosas, total de tulipas, preço das rosas, preço das tulipas e preço total das flores. Neste caso, recomenda-se o uso dos tipos int e float; 2. Solicite e atribua valores às variáveis criadas no passo 1 que são representativas do total de rosas e total de tulipas; 3. Calcule o preço das rosas e o preço das tulipas a partir dos valores obtidos no passo 2; 4. Calcule o preço total das flores a partir dos valores obtidos no passo 3; 5. Apresente os valores encontrados nos passos 3 e 4.',

        int: 'Consulte abaixo a resolução de um algoritmo que envolve passos similares aos quais você usará em suas resoluções.',
        operacao: '4 Operações Matemáticas',
        int2: 'Construa um algoritmo que represente as 4 operações básicas da matemática.',
        codigo: '#include <stdio.h> int main (void) { int numero1, numero2, soma, subtracao, multiplicacao; float divisao; printf("Digite o primeiro numero:\n"); scanf("%d", &numero1); printf("Digite o segundo numero:\n"); scanf("%d", &numero2); soma = numero1 + numero2; subtracao = numero1 - numero2; multiplicacao = numero1 * numero2; divisao = numero1 / numero2; printf("\nA soma eh %d", soma); printf("\nA subtracao eh %d", subtracao); printf("\nA multiplicacao eh %d", multiplicacao); printf("\nA divisao eh %f", divisao); return (0); }',
    },
    
  ];
  
export default ListaDeExerciciosItems;
  