import * as readline from 'node:readline/promises';
import * as fs from 'fs';
import { stdin as input, stdout as output } from 'node:process';
const rl = readline.createInterface({ input, output });
const fileName = await rl.question('Enter the name of your input file: ');
rl.close();
function calculateBalanceSheet(expenseData, revenueData) {
    const balanceSheet = [];
    // Create a map to store the balances for each date. Given that the day and the time doesn't change.
    const balanceMap = new Map();
    // Process the expense data
    for (const expense of expenseData) {
        const amount = expense.amount;
        const startDate = expense.startDate;
        balanceMap.set(startDate, (balanceMap.get(startDate) ?? 0) - amount);
    }
    // Process the revenue data
    for (const revenue of revenueData) {
        const amount = revenue.amount;
        const startDate = revenue.startDate;
        balanceMap.set(startDate, (balanceMap.get(startDate) ?? 0) + amount);
    }
    // Sort the balance sheet by timestamp
    for (const [date, balance] of balanceMap) {
        balanceSheet.push({
            startDate: date,
            amount: balance
        });
    }
    balanceSheet.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
    return balanceSheet;
}
fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading input file:', err);
        return;
    }
    try {
        const inputData = JSON.parse(data);
        const expenseData = inputData.expenseData || [];
        const revenueData = inputData.revenueData || [];
        const balanceSheet = calculateBalanceSheet(expenseData, revenueData);
        const outputData = { balance: balanceSheet };
        // Write the output JSON to a file
        fs.writeFile('output.json', JSON.stringify(outputData, null, 2), (err) => {
            if (err) {
                console.error('Error writing output file:', err);
            }
            else {
                console.log('Balance sheet has been generated successfully!');
                console.log(balanceSheet);
            }
        });
    }
    catch (err) {
        console.error('Error parsing input JSON:', err);
    }
});
//# sourceMappingURL=index.js.map