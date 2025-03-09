// Funções para manipulação da interface
function appendCharacter(char) {
    document.getElementById('expression').value += char;
}

function clearExpression() {
    document.getElementById('expression').value = '';
    document.getElementById('result').innerHTML = '';
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
    let expr = expression;

    // Substituir variáveis pelos seus valores
    for (const variable in values) {
        const regex = new RegExp('\\b' + variable + '\\b', 'g');
        expr = expr.replace(regex, values[variable]);
    }

    // Converter símbolos lógicos para operadores em texto
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

        // Tratar parênteses e expressões com múltiplos operadores
        // Isso é uma simplificação - expressões complexas podem precisar de um parser mais avançado

        // Avaliar a expressão como código JavaScript
        return Function('NOT', 'AND', 'OR', 'IMPLIES', 'BICONDITIONAL', 'return ' + expr)(NOT, AND, OR, IMPLIES, BICONDITIONAL);
    } catch (error) {
        console.error("Erro na avaliação da expressão:", error);
        return "Erro";
    }
}

// Função para gerar a tabela verdade
function generateTruthTable() {
    const expressionInput = document.getElementById('expression').value;

    if (!expressionInput) {
        alert("Por favor, insira uma expressão lógica.");
        return;
    }

    // Extrair variáveis únicas da expressão
    const variableMatches = expressionInput.match(/[A-Z]/g) || [];
    const variables = [...new Set(variableMatches)];

    if (variables.length === 0) {
        alert("A expressão não contém variáveis válidas.");
        return;
    }

    // Criar tabela verdade
    const truthTable = [];
    const numRows = Math.pow(2, variables.length);

    for (let i = 0; i < numRows; i++) {
        const row = {};

        // Atribuir valores para cada variável (0 ou 1)
        for (let j = 0; j < variables.length; j++) {
            row[variables[j]] = ((numRows - i - 1) >> (variables.length - j - 1)) & 1;
        }

        // Avaliar a expressão com os valores atuais
        row['result'] = evaluateLogicalExpression(expressionInput, row);
        truthTable.push(row);
    }

    // Exibir a tabela verdade
    displayTruthTable(truthTable, variables);
}

// Função para exibir a tabela verdade no HTML
function displayTruthTable(truthTable, variables) {
    let table = '<table><tr>';
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