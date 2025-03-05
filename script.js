// Função para adicionar caracteres ao visor
function appendCharacter(char) {
    document.getElementById('expression').value += char;
}

// Função para limpar a expressão
function clearExpression() {
    document.getElementById('expression').value = '';
}

// Função para gerar a Tabela Verdade
function generateTruthTable() {
    const expression = document.getElementById('expression').value;
    const variables = getVariables(expression);
    const numRows = Math.pow(2, variables.length);
    let truthTable = [];

    // Gerar as linhas da tabela verdade
    for (let i = 0; i < numRows; i++) {
        let row = {};
        for (let j = 0; j < variables.length; j++) {
            row[variables[j]] = (i >> (variables.length - j - 1)) & 1;
        }
        row['result'] = evaluateExpression(expression, row);
        truthTable.push(row);
    }

    // Exibir a tabela verdade
    displayTruthTable(truthTable, variables);
}

// Função para extrair as variáveis da expressão
function getVariables(expression) {
    let matches = expression.match(/[A-F]/g); // Captura as variáveis (A, B, C, etc.)
    return [...new Set(matches)].sort(); // Retorna as variáveis únicas e ordenadas
}

// Função para avaliar a expressão lógica
function evaluateExpression(expression, row) {
    let evalExpr = expression;

    // Substituir as variáveis na expressão pelos valores reais
    for (let variable in row) {
        evalExpr = evalExpr.replace(new RegExp(variable, 'g'), row[variable]);
    }

    // Substituir os operadores lógicos pelos nomes das funções
    evalExpr = evalExpr.replace(/¬/g, 'NOT');       // Negação
    evalExpr = evalExpr.replace(/∧/g, 'AND');       // Conjunção
    evalExpr = evalExpr.replace(/∨/g, 'OR');        // Disjunção
    evalExpr = evalExpr.replace(/→/g, 'IMPLIES');   // Condicional
    evalExpr = evalExpr.replace(/↔/g, 'BICONDITIONAL'); // Bicondicional

    // Avaliar a expressão com as funções lógicas
    return evaluateLogicalExpression(evalExpr);
}

// Função para avaliar a expressão lógica com base nos operadores definidos
function evaluateLogicalExpression(expression) {
    // Definindo as funções para os operadores lógicos

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

    function XOR(a, b) {
        if (a !== b) {
            return 1;  // Ou Exclusivo: 1 ⊻ 0 ou 0 ⊻ 1 é 1
        } else {
            return 0;  // Caso contrário é 0
        }
    }

    // Substituir os operadores pelos seus respectivos métodos
    expression = expression.replace(/NOT/g, 'NOT');
    expression = expression.replace(/AND/g, 'AND');
    expression = expression.replace(/OR/g, 'OR');
    expression = expression.replace(/IMPLIES/g, 'IMPLIES');
    expression = expression.replace(/BICONDITIONAL/g, 'BICONDITIONAL');

    // Avaliar a expressão
    try {
        return new Function("return " + expression)();
    } catch (error) {
        console.error("Erro na avaliação da expressão:", error);
        return 0;
    }
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
