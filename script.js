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

function evaluateLogicalExpression(expression, values) {
    // Substituir as variáveis pelos seus valores (assumindo que são 0 ou 1)
for (let variable in values) {
    let re = new RegExp('\\b' + variable + '\\b', 'g');
    expression = expression.replace(re, values[variable]);
}

// Substituir os símbolos lógicos por palavras (para facilitar o processamento)
expression = expression
    .replace(/&/g, ' AND ')
    .replace(/<=>/g, ' BICONDITIONAL ')
    .replace(/=>/g, ' IMPLIES ')
    .replace(/¬/g, ' NOT ')
    .replace(/∧/g, ' AND ')
    .replace(/∨/g, ' OR ');

// Função auxiliar para aplicar repetidamente um regex até não haver mais substituições
function replaceOperator(pattern, replacement) {
    while (pattern.test(expression)) {
    expression = expression.replace(pattern, replacement);
    }
}

// Definindo um padrão para "operandos" que podem ser um dígito ou uma chamada de função já formada.
// (Note que esse padrão não trata recursivamente parênteses aninhados, mas serve para expressões simples.)
const operandPattern = '(?:\\d+|[A-Z]+\\([^()]*\\))';

// Aplicar as substituições na ordem de precedência:

replaceOperator(new RegExp('NOT\\s+(' + operandPattern + ')', 'g'), 'NOT($1)');

replaceOperator(new RegExp('(' + operandPattern + ')\\s+AND\\s+(' + operandPattern + ')', 'g'), 'AND($1,$2)');

replaceOperator(new RegExp('(' + operandPattern + ')\\s+OR\\s+(' + operandPattern + ')', 'g'), 'OR($1,$2)');

replaceOperator(new RegExp('(' + operandPattern + ')\\s+IMPLIES\\s+(' + operandPattern + ')', 'g'), 'IMPLIES($1,$2)');

replaceOperator(new RegExp('(' + operandPattern + ')\\s+BICONDITIONAL\\s+(' + operandPattern + ')', 'g'), 'BICONDITIONAL($1,$2)');

// Agora, a expressão foi transformada em chamadas de função aninhadas de acordo com a precedência desejada.
// Exemplo: "A&B<=>C" (supondo A=1, B=1, C=1) vira "BICONDITIONAL(AND(1,1),1)"
try {
    return Function('NOT','AND','OR','IMPLIES','BICONDITIONAL', 'return ' + expression)
        (NOT, AND, OR, IMPLIES, BICONDITIONAL);
} catch (e) {
    console.error("Erro na avaliação da expressão:", e);
    return "Erro";
}
}

// Função para gerar a tabela verdade
// Função para gerar a tabela verdade
function generateTruthTable() {
    // Obter a expressão lógica do campo de entrada
    var expressionInput = document.getElementById('expression').value;

    // Se a expressão estiver vazia, a função exibe um alerta pedindo para o usuário inserir uma expressão.
    if (!expressionInput) {
        alert("Por favor, insira uma expressão lógica.");
        return;
    }

    // Extrair variáveis únicas da expressão
    var variableMatches = expressionInput.match(/[A-Z]/g) || [];
    var variables = [...new Set(variableMatches)];

    if (variables.length === 0) { // Se não houver variáveis, exibe um alerta informando que a expressão não contém variáveis válidas.
        alert("A expressão não contém variáveis válidas.");
        return;
    }

    // Criar tabela verdade
    var truthTable = [];
    var numRows = Math.pow(2, variables.length);

    for (var i = 0; i < numRows; i++) {
        var row = {};

        // Atribuir valores para cada variável (0 ou 1)
        for (var j = 0; j < variables.length; j++) {
            row[variables[j]] = ((numRows - i - 1) >> (variables.length - j - 1)) & 1;
        }

        // Avaliar a expressão com os valores atuais
        row['result'] = evaluateLogicalExpression(expressionInput, row);
        truthTable.push(row);
    }

    // Exibir a tabela verdade com a expressão inserida como cabeçalho
    displayTruthTable(truthTable, variables, expressionInput);
}

// Função para exibir a tabela verdade no HTML
function displayTruthTable(truthTable, variables, expressionInput) {
    var table = '<table>';

    // Exibir as variáveis como cabeçalhos
    variables.forEach(variable => {
        table += `<th>${variable}</th>`;
    });

    // Adicionar a coluna para a expressão inserida
    table += `<th>${expressionInput}</th>`;
    table += '</tr>';

    // Adicionar uma linha para cada linha da tabela verdade
    truthTable.forEach(row => {
        table += '<tr>';
        
        // Exibir os valores das variáveis
        variables.forEach(variable => {
            table += `<td>${row[variable]}</td>`;
        });

        // Exibir o resultado final da expressão
        table += `<td>${row['result']}</td></tr>`;
    });

    table += '</table>';
    document.getElementById('result').innerHTML = table;
}

//Para cada linha da tabela verdade, a função adiciona uma nova linha HTML (<tr>) com os valores das variáveis e o resultado da expressão.
//  No final, a tabela é exibida no elemento #result da página.