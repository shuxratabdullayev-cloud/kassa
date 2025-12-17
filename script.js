// ==================== Data Management ====================
class TransactionManager {
    constructor() {
        this.transactions = this.loadTransactions();
    }

    loadTransactions() {
        const stored = localStorage.getItem('cashTransactions');
        return stored ? JSON.parse(stored) : [];
    }

    saveTransactions() {
        localStorage.setItem('cashTransactions', JSON.stringify(this.transactions));
    }

    generateId(type) {
        const year = new Date().getFullYear();
        const prefix = type === 'income' ? 'KK' : 'CHQ';
        const count = this.transactions.filter(t => t.type === type).length + 1;
        return `${prefix}-${year}-${String(count).padStart(4, '0')}`;
    }

    addTransaction(transaction) {
        const newTx = {
            id: Date.now().toString(),
            orderNumber: this.generateId(transaction.type),
            ...transaction,
            createdAt: new Date().toISOString()
        };
        this.transactions.push(newTx);
        this.saveTransactions();
        return newTx;
    }

    deleteTransaction(id) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            this.transactions.splice(index, 1);
            this.saveTransactions();
            return true;
        }
        return false;
    }

    getAllTransactions() {
        return this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
    }

    getTransactionsByType(type) {
        return this.getAllTransactions().filter(t => t.type === type);
    }

    calculateBalance() {
        return this.transactions.reduce((acc, t) => {
            return t.type === 'income'
                ? acc + parseFloat(t.amount)
                : acc - parseFloat(t.amount);
        }, 0);
    }

    // For stats
    getTodayStats() {
        const today = new Date().toISOString().split('T')[0];
        const todays = this.transactions.filter(t => t.date === today);
        return {
            income: todays.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
            expense: todays.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
        };
    }
}

// ==================== UI Management ====================
class UIManager {
    constructor(manager) {
        this.manager = manager;
        this.initializeElements();
        this.attachEventListeners();
        this.renderAll();
    }

    initializeElements() {
        // Tabs
        this.tabs = document.querySelectorAll('.nav-tab');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Income Form
        this.receiptForm = document.getElementById('receiptForm');
        this.receiptNumberInput = document.getElementById('receiptNumber');

        // Expense Form
        this.expenseForm = document.getElementById('expenseForm');
        this.expenseNumberInput = document.getElementById('expenseNumber');

        // Tables
        this.receiptsTableBody = document.getElementById('receiptsTableBody');
        this.expensesTableBody = document.getElementById('expensesTableBody');
        this.cashBookBody = document.getElementById('cashBookBody');
        this.currentBalanceDisplay = document.getElementById('currentBalance');

        // Stats displays
        this.todayTotalDisplay = document.getElementById('todayTotal');
        this.monthTotalDisplay = document.getElementById('monthTotal');
        this.totalAmountDisplay = document.getElementById('totalAmount');
        this.orderCountDisplay = document.getElementById('orderCount');

        // Initial Values
        this.updateNextNumbers();
        this.setDefaultDates();
    }

    switchTab(tabId) {
        // Update Buttons
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(tabId)) {
                tab.classList.add('active');
            }
        });

        // Update Content
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-section`) {
                content.classList.add('active');
            }
        });

        this.renderAll();
    }

    updateNextNumbers() {
        if (this.receiptNumberInput) this.receiptNumberInput.value = this.manager.generateId('income');
        if (this.expenseNumberInput) this.expenseNumberInput.value = this.manager.generateId('expense');
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        if (document.getElementById('date')) document.getElementById('date').value = today;
        if (document.getElementById('expenseDate')) document.getElementById('expenseDate').value = today;
    }

    attachEventListeners() {
        if (this.receiptForm) {
            this.receiptForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleIncomeSubmit();
            });
        }

        if (this.expenseForm) {
            this.expenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleExpenseSubmit();
            });
        }
    }

    handleIncomeSubmit() {
        const data = {
            type: 'income',
            payer: document.getElementById('payerName').value,
            amount: parseFloat(document.getElementById('amount').value),
            date: document.getElementById('date').value,
            debit: document.getElementById('debitAccount').value,
            credit: document.getElementById('creditAccount').value,
            purpose: document.getElementById('purpose').value,
            notes: document.getElementById('notes') ? document.getElementById('notes').value : ''
        };

        this.manager.addTransaction(data);
        this.receiptForm.reset();
        this.postSubmitActions();
        this.showNotification('Kirim muvaffaqiyatli qabul qilindi!', 'success');
    }

    handleExpenseSubmit() {
        const data = {
            type: 'expense',
            recipient: document.getElementById('recipientName').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            date: document.getElementById('expenseDate').value,
            credit: document.getElementById('expenseCreditAccount').value,
            debit: document.getElementById('expenseDebitAccount').value,
            docRef: document.getElementById('expenseDocument').value,
            purpose: document.getElementById('expensePurpose').value
        };

        this.manager.addTransaction(data);
        this.expenseForm.reset();
        this.postSubmitActions();
        this.showNotification('Chiqim muvaffaqiyatli bajarildi!', 'success');
    }

    postSubmitActions() {
        this.renderAll();
        this.updateNextNumbers();
        this.setDefaultDates();
    }

    renderAll() {
        this.renderIncomeTable();
        this.renderExpenseTable();
        this.renderCashBook();
        this.updateStats();
    }

    renderIncomeTable() {
        if (!this.receiptsTableBody) return;
        const incomes = this.manager.getTransactionsByType('income');

        if (incomes.length === 0) {
            this.receiptsTableBody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="8">
                        <div class="empty-message">
                            <span class="empty-icon">📋</span>
                            <p>Kirim orderlar mavjud emas</p>
                        </div>
                    </td>
                </tr>`;
            return;
        }

        this.receiptsTableBody.innerHTML = incomes.map(t => `
            <tr>
                <td><strong>${t.orderNumber}</strong></td>
                <td>${t.payer}</td>
                <td class="balance-positive">+${this.formatCurrency(t.amount)}</td>
                <td>${t.debit}</td>
                <td>${t.credit}</td>
                <td>${t.purpose}</td>
                <td>${t.date}</td>
                <td>
                    <button class="btn btn-delete transaction-action" onclick="deleteTx('${t.id}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    renderExpenseTable() {
        if (!this.expensesTableBody) return;
        const expenses = this.manager.getTransactionsByType('expense');

        if (expenses.length === 0) {
            this.expensesTableBody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="8">
                        <div class="empty-message">
                            <span class="empty-icon">📤</span>
                            <p>Chiqim orderlar mavjud emas</p>
                        </div>
                    </td>
                </tr>`;
            return;
        }

        this.expensesTableBody.innerHTML = expenses.map(t => `
            <tr>
                <td><strong>${t.orderNumber}</strong></td>
                <td>${t.recipient}</td>
                <td class="balance-negative">-${this.formatCurrency(t.amount)}</td>
                <td>${t.debit}</td>
                <td>${t.credit}</td>
                <td>${t.purpose}</td>
                <td>${t.date}</td>
                <td>
                    <button class="btn btn-delete transaction-action" onclick="deleteTx('${t.id}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    renderCashBook() {
        if (!this.cashBookBody) return;
        const allTx = this.manager.getAllTransactions().reverse(); // Oldest first for calculation

        let runningBalance = 0;
        const rows = allTx.map(t => {
            const isIncome = t.type === 'income';
            if (isIncome) runningBalance += t.amount;
            else runningBalance -= t.amount;

            return {
                ...t,
                runningBalance,
                isIncome
            };
        }).reverse(); // Show newest first in table

        if (rows.length === 0) {
            this.cashBookBody.innerHTML = `<tr><td colspan="6" class="text-center">Hozircha operatsiyalar yo'q</td></tr>`;
        } else {
            this.cashBookBody.innerHTML = rows.map(t => `
                <tr>
                    <td>${t.date}</td>
                    <td><strong>${t.orderNumber}</strong></td>
                    <td>${t.isIncome ? 'Kirim: ' + t.payer : 'Chiqim: ' + t.recipient} <br> <small>${t.purpose}</small></td>
                    <td class="balance-positive">${t.isIncome ? this.formatCurrency(t.amount) : '-'}</td>
                    <td class="balance-negative">${!t.isIncome ? this.formatCurrency(t.amount) : '-'}</td>
                    <td><strong>${this.formatCurrency(t.runningBalance)}</strong></td>
                </tr>
            `).join('');
        }

        if (this.currentBalanceDisplay) {
            const finalBalance = this.manager.calculateBalance();
            this.currentBalanceDisplay.textContent = this.formatCurrency(finalBalance);
            this.currentBalanceDisplay.className = finalBalance >= 0 ? 'balance-positive' : 'balance-negative';
        }
    }

    updateStats() {
        const stats = this.manager.getTodayStats();
        // Calculate totals
        const total = this.manager.calculateBalance();
        const count = this.manager.getAllTransactions().length;

        if (this.todayTotalDisplay) this.todayTotalDisplay.textContent = this.formatCurrency(stats.income);
        if (this.monthTotalDisplay) this.monthTotalDisplay.textContent = this.formatCurrency(stats.expense); // Using month display for expense temporarily or add new stat
        // Actually let's just show Total Balance in totalAmount
        if (this.totalAmountDisplay) this.totalAmountDisplay.textContent = this.formatCurrency(total);
        if (this.orderCountDisplay) this.orderCountDisplay.textContent = count;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
    }

    showNotification(msg, type) {
        const div = document.createElement('div');
        div.className = `notification notification-${type}`;
        div.textContent = msg;
        div.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 1rem; 
            background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000; font-weight: bold; border-left: 4px solid ${type === 'success' ? '#38ef7d' : '#ff4b2b'};
        `;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
}

// Global instance
let manager;
let ui;

document.addEventListener('DOMContentLoaded', () => {
    manager = new TransactionManager();
    ui = new UIManager(manager);
    window.ui = ui; // Expose for HTML onclick
});

window.deleteTx = (id) => {
    if (confirm('Ushbu operatsiyani o\'chirasizmi?')) {
        manager.deleteTransaction(id);
        ui.renderAll();
    }
};
