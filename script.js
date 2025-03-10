// Funções para manipulação da interface

//Essa função é chamada para adicionar um caractere à expressão lógica que o usuário está digitando.
// O parâmetro char é o caractere a ser adicionado. Ela pega o valor atual da expressão no campo de entrada (expression) e acrescenta o caractere
function appendCharacter(char) {
    document.getElementById('expression').value += char;
}

//Essa função limpa a expressão lógica e o resultado exibido na interface. Ela define o valor do campo de expressão como uma string vazia e limpa o conteúdo da área de resultado.
function clearExpression() {
    document.getElementById('expression').value = '';
    document.getElementById('result').innerHTML = '';
}

//Essa função é chamada para deletar o último caractere da expressão lógica que o usuário está digitando.
// usa slice para remover o último caractere (com o índice -1) e então atualiza o campo de entrada.
function deleteCharacter() {
    var expression = document.getElementById('expression').value;
    document.getElementById('expression').value = expression.slice(0, -1);
}

// Funções lógicas
function NOT(value) {
    if (value === 0) {
        return 1;  // Negação: 0 vira 1
    } else {
        return 0;  // Negação: 1 vira 0
    }
}

function AND(a, b) {
    if (a === 1 && b === 1) {
        return 1;  // Conjunção: 1 ∧ 1 é 1
    } else {
        return 0;  // Qualquer outro caso é 0
    }
}

function OR(a, b) {
    if (a === 1 || b === 1) {
        return 1;  // Disjunção: 1 ∨ 0 ou 1 ∨ 1 é 1
    } else {
        return 0;  // Caso contrário é 0
    }
}

function IMPLIES(a, b) {
    if (a === 1 && b === 0) {
        return 0;  // Condicional: 1 → 0 é 0
    } else {
        return 1;  // Qualquer outro caso é 1
    }
}

function BICONDITIONAL(a, b) {
    if (a === b) {
        return 1;  // Bicondicional: 1 ↔ 1 ou 0 ↔ 0 é 1
    } else {
        return 0;  // Caso contrário é 0
    }
}

// Função para avaliar a expressão lógica
function evaluateLogicalExpression(expression, values) {
    // Criar uma cópia da expressão para trabalhar
    var expr = expression;

    // Substituir variáveis pelos seus valores
    for (var variable in values) {
        var regex = new RegExp('\\b' + variable + '\\b', 'g'); //A expressão regular \\b garante que apenas variáveis completas sejam substituídas, evitando conflitos com partes de outras variáveis ou palavras.
        expr = expr.replace(regex, values[variable]);
    }

    // Converter símbolos lógicos para operadores em texto
    //é importante deixar o bicondicional primeiro, pois ele contém o sinal de igual, que pode ser comido pelo replace do condicional.
    expr = expr.replace(/¬/g, 'NOT');
    expr = expr.replace(/∧/g, ' AND ');
    expr = expr.replace(/∨/g, ' OR ');
    expr = expr.replace(/↔/g, ' BICONDITIONAL ');
    expr = expr.replace(/\<=>/g, ' BICONDITIONAL ');
    expr = expr.replace(/→/g, ' IMPLIES ');
    expr = expr.replace(/\=>/g, ' IMPLIES ');


    try {
        // Substituir operadores por chamadas de função
        // Primeiro tratamos o NOT que é unário
        expr = expr.replace(/NOT\s+(\d)/g, 'NOT($1)');

        // Depois os operadores binários
        expr = expr.replace(/(\d)\s+AND\s+(\d)/g, 'AND($1,$2)');
        expr = expr.replace(/(\d)\s+OR\s+(\d)/g, 'OR($1,$2)');
        expr = expr.replace(/(\d)\s+IMPLIES\s+(\d)/g, 'IMPLIES($1,$2)');
        expr = expr.replace(/(\d)\s+BICONDITIONAL\s+(\d)/g, 'BICONDITIONAL($1,$2)');

        //(\d): O \d corresponde a qualquer dígito (0-9), e o parêntese () cria um grupo de captura. O valor encontrado dentro desse grupo será referenciado na substituição.
        //\s+: O \s+ corresponde a um ou mais espaços em branco (como espaços, tabulações, etc.).
        //(\d): Mais uma vez, o (\d) captura um número (um dígito).
        //g: O modificador "global" permite que a substituição seja feita em todas as ocorrências, não apenas na primeira.
        //$1 e $2 são referências aos grupos de captura da expressão regular.
        //$1 é o primeiro número
        //$2 é o segundo número
        //O resultado da substituição será uma string no formato "AND(numero1,numero2)"

        // Tratar parênteses e expressões com múltiplos operadores
        // Isso é uma simplificação - expressões complexas podem precisar de um parser mais avançado

        // Avaliar a expressão como código JavaScript
        //A função usa Function() para criar uma função dinâmica a partir da expressão lógica e executa essa função.
        // Ela passa as funções lógicas (NOT, AND, etc.) como parâmetros para a avaliação. Se ocorrer um erro, ele é capturado e uma mensagem de erro é exibida
        return Function('NOT', 'AND', 'OR', 'IMPLIES', 'BICONDITIONAL', 'return ' + expr)(NOT, AND, OR, IMPLIES, BICONDITIONAL);
    } catch (error) {
        console.error("Erro na avaliação da expressão:", error);
        return "Erro";
    }
}

// Função para gerar a tabela verdade
function generateTruthTable() {
    // Obter a expressão lógica do campo de entrada
    var expressionInput = document.getElementById('expression').value;

    //Se a expressão estiver vazia, a função exibe um alerta pedindo para o usuário inserir uma expressão.
    if (!expressionInput) {
        alert("Por favor, insira uma expressão lógica.");
        return;
    }

    // Extrair variáveis únicas da expressão
    //Aqui, a função extrai as variáveis da expressão (assumindo que sejam letras maiúsculas de A a Z) e cria um array com essas variáveis, removendo duplicatas usando o Set.
    var variableMatches = expressionInput.match(/[A-Z]/g) || [];
    var variables = [...new Set(variableMatches)];

    if (variables.length === 0) { //Se não houver variáveis, exibe um alerta informando que a expressão não contém variáveis válidas.
        alert("A expressão não contém variáveis válidas.");
        return;
    }

    // Criar tabela verdade
    // A função cria uma tabela verdade. numRows calcula o número de linhas da tabela com base no número de variáveis (2^n, onde n é o número de variáveis).
    var truthTable = [];
    var numRows = Math.pow(2, variables.length);


    //O loop percorre cada linha da tabela verdade. Para cada linha, ele cria um objeto row com as variáveis e seus valores (0 ou 1) e o resultado da expressão lógica para esses valores.
    for (var i = 0; i < numRows; i++) {
        var row = {};

        // Atribuir valores para cada variável (0 ou 1)
        for (var j = 0; j < variables.length; j++) {
            row[variables[j]] = ((numRows - i - 1) >> (variables.length - j - 1)) & 1;
        }

        // Avaliar a expressão com os valores atuais
        //A função evaluateLogicalExpression é chamada para avaliar a expressão lógica com os valores atuais das variáveis. O resultado é armazenado no objeto row.
        row['result'] = evaluateLogicalExpression(expressionInput, row);
        truthTable.push(row);
    }

    // Exibir a tabela verdade
    displayTruthTable(truthTable, variables);
}

// Função para exibir a tabela verdade no HTML
//Essa função cria a estrutura HTML para exibir a tabela verdade. Primeiro, ela cria a linha de cabeçalho com as variáveis e a coluna "Resultado"
function displayTruthTable(truthTable, variables) {
    var table = '<table><tr>';
    variables.forEach(variable => {
        table += `<th>${variable}</th>`;
    });
    table += '<th>Resultado</th></tr>';

    truthTable.forEach(row => {
        table += '<tr>';
        variables.forEach(variable => {
            table += `<td>${row[variable]}</td>`;
        });
        table += `<td>${row['result']}</td></tr>`;
    });

    table += '</table>';
    document.getElementById('result').innerHTML = table;
}
//Para cada linha da tabela verdade, a função adiciona uma nova linha HTML (<tr>) com os valores das variáveis e o resultado da expressão.
//  No final, a tabela é exibida no elemento #result da página.