import * as readline from 'node:readline/promises';
import * as fs from 'fs';
import { stdin as input, stdout as output } from 'node:process';

interface Transaction {
    amount: number;
    startDate: string;
}

interface BalanceSheetEntry {
    amount: number;
    startDate: string;
}

interface InputData {
    expenseData?: Transaction[];
    revenueData?: Transaction[];
}

interface OutputData {
    balance: BalanceSheetEntry[];
}

const rl = readline.createInterface({ input, output });
const fileName: string = await rl.question('Enter the name of your input file: ');
rl.close();

fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading input file:', err);
        return;
    }

    try {
        const inputData: InputData = JSON.parse(data);
        const expenseData: Transaction[] = inputData.expenseData || [];
        const revenueData: Transaction[] = inputData.revenueData || [];
        const balanceSheet: BalanceSheetEntry[] = calculateBalanceSheet(expenseData, revenueData);
        const outputData: OutputData = { balance: balanceSheet };

        // Write the output JSON to a file
        fs.writeFile('output.json', JSON.stringify(outputData, null, 2), (err) => {
            if (err) {
                console.error('Error writing output file:', err);
            } else {
                console.log('Balance sheet has been generated successfully!');
                console.log(balanceSheet);
            }
        });
    } catch (err) {
        console.error('Error parsing input JSON:', err);
    }
});

function calculateBalanceSheet(expenseData: Transaction[], revenueData: Transaction[]): BalanceSheetEntry[] {
    const balanceSheet: BalanceSheetEntry[] = [];

    // Create a map to store the balances for each date. Given that the day and the time doesn't change.
    const balanceMap: Map<string, number> = new Map();

    // Process the expense data
    for (const expense of expenseData) {
        const amount: number = expense.amount;
        const startDate: string = expense.startDate;
        balanceMap.set(startDate, (balanceMap.get(startDate) ?? 0) - amount)
    }

    // Process the revenue data
    for (const revenue of revenueData) {
        const amount: number = revenue.amount;
        const startDate: string = revenue.startDate;
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


