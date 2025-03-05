function appendCharacter(char) {
    document.getElementById('expression').value += char;
}

function clearExpression() {
    document.getElementById('expression').value = '';
}

function generateTruthTable() {
    const expression = document.getElementById('expression').value;
    const variables = getVariables(expression);
    const numRows = Math.pow(2, variables.length);
    let truthTable = [];

    for (let i = 0; i < numRows; i++) {
        let row = {};
        for (let j = 0; j < variables.length; j++) {
            row[variables[j]] = (i >> (variables.length - j - 1)) & 1;
        }
        row['result'] = evaluateExpression(expression, row);
        truthTable.push(row);
    }

    displayTruthTable(truthTable, variables);a
}

function getVariables(expression) {
    let matches = expression.match(/[A-F]/g);
    return [...new Set(matches)].sort();
}

function evaluateExpression(expression, row) {
    let evalExpr = expression;
    for (let variable in row) {
        evalExpr = evalExpr.replace(new RegExp(variable, 'g'), row[variable]);
    }
    evalExpr = evalExpr.replace(/¬/g, '!');
    evalExpr = evalExpr.replace(/∧/g, '&&');
    evalExpr = evalExpr.replace(/∨/g, '||');
    evalExpr = evalExpr.replace(/→/g, '=>');
    evalExpr = evalExpr.replace(/↔/g, '===');
    return eval(toBooleanExpr(evalExpr));
}

function toBooleanExpr(expr) {
    // Transforma expressões como "1=>0" em "!(1) || 0" e "1<=>0" em "(1 === 0)"
    expr = expr.replace(/(\d+)=>(\d+)/g, '!($1) || $2');
    expr = expr.replace(/(\d+)<=>/g, '($1 === ');
    expr = expr.replace(/<=(\d+)/g, ' === $1)');
    return expr;
}

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
