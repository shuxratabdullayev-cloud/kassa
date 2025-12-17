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
        // Count specific transaction type for simple numbering, or global? 
        // Let's do type specific: KK (Kassa Kirim) or CHQ (Chiqim)
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
            // Very simple active check based on onclick content or index is tricky
            // Let's just remove active from all and add to clicked one? 
            // In HTML onclick we pass 'income', 'expense'. 
            // We need to match the button index unfortunately or use event delegation.
            // Simplified: The UI class handles the visual switching.
            tab.classList.remove('active');
            if (tab.getAttribute('onclick').includes(tabId)) {
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

        this.renderAll(); // Refresh data when switching
    }

    updateNextNumbers() {
        if (this.receiptNumberInput) this.receiptNumberInput.value = this.manager.generateId('income');
        if (this.expenseNumberInput) this.expenseNumberInput.value = this.manager.generateId('expense');
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        ['date', 'expenseDate'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = today;
        });
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
            notes: document.getElementById('notes').value
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
        this.showNotification('Chiqim muvaffaqiyatli bajarildi!', 'success'); // Orange color logic pending but 'success' works
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
        const incomes = this.manager.getTransactionsByType('income');
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
                    <!-- Add print here later -->
                </td>
            </tr>
        `).join('');
    }

    renderExpenseTable() {
        const expenses = this.manager.getTransactionsByType('expense');
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
        // Chronological order (Oldest first) for running balance
        const allTx = this.manager.getAllTransactions().reverse();

        let runningBalance = 0;
        const rows = allTx.map(t => {
            const isIncome = t.type === 'income';
            if (isIncome) runningBalance += t.amount;
            else runningBalance -= t.amount;

            return `
                <tr>
                    <td>${t.date}</td>
                    <td><strong>${t.orderNumber}</strong></td>
                    <td>${isIncome ? 'Kirim: ' + t.payer : 'Chiqim: ' + t.recipient} <br> <small>${t.purpose}</small></td>
                    <td class="balance-positive">${isIncome ? this.formatCurrency(t.amount) : '-'}</td>
                    <td class="balance-negative">${!isIncome ? this.formatCurrency(t.amount) : '-'}</td>
                    <td><strong>${this.formatCurrency(runningBalance)}</strong></td>
                </tr>
            `;
        }).reverse(); // Show newest on top? Or strictly by date? Usually books are bottom-up or top-down. 
        // Let's keep newest on top for Web UI convenience, but calculated correctly.

        this.cashBookBody.innerHTML = rows.join('');

        // Update Current Balance Header
        this.currentBalanceDisplay.textContent = this.formatCurrency(this.manager.calculateBalance());
    }

    updateStats() {
        const stats = this.manager.getTodayStats();
        if (this.todayTotalDisplay) this.todayTotalDisplay.textContent = this.formatCurrency(stats.income);
        // We could enhance stats to show expenses too, but keeping existing ID structure for now
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
    }

    showNotification(msg, type) {
        // ... Existing notification logic ...
        const div = document.createElement('div');
        div.className = `notification notification-${type}`;
        div.textContent = msg;
        div.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 1rem; 
            background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
        `;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
}

// Global instance for onclick handlers
let manager;
let ui;

document.addEventListener('DOMContentLoaded', () => {
    manager = new TransactionManager();
    ui = new UIManager(manager);
});

// Global helpers
window.deleteTx = (id) => {
    if (confirm('Ushbu operatsiyani o\'chirasizmi?')) {
        manager.deleteTransaction(id);
        ui.renderAll();
    }
};

window.ui = ui; // Expose for tab switching onclick
// Save receipts to LocalStorage
saveReceipts() {
    localStorage.setItem('cashReceipts', JSON.stringify(this.receipts));
}

// Generate receipt number
generateReceiptNumber() {
    const year = new Date().getFullYear();
    const count = this.receipts.length + 1;
    return `KK-${year}-${String(count).padStart(4, '0')}`;
}

// Add new receipt
addReceipt(receipt) {
    const newReceipt = {
        id: Date.now().toString(),
        receiptNumber: this.generateReceiptNumber(),
        ...receipt,
        createdAt: new Date().toISOString()
    };
    this.receipts.push(newReceipt);
    this.saveReceipts();
    return newReceipt;
}

// Update existing receipt
updateReceipt(id, updatedData) {
    const index = this.receipts.findIndex(receipt => receipt.id === id);
    if (index !== -1) {
        this.receipts[index] = {
            ...this.receipts[index],
            ...updatedData,
            updatedAt: new Date().toISOString()
        };
        this.saveReceipts();
        return this.receipts[index];
    }
    return null;
}

// Delete receipt
deleteReceipt(id) {
    const index = this.receipts.findIndex(receipt => receipt.id === id);
    if (index !== -1) {
        this.receipts.splice(index, 1);
        this.saveReceipts();
        return true;
    }
    return false;
}

// Get receipt by ID
getReceipt(id) {
    return this.receipts.find(receipt => receipt.id === id);
}

// Get all receipts
getAllReceipts() {
    return this.receipts;
}

// Calculate total amount
calculateTotal() {
    return this.receipts.reduce((total, receipt) => {
        return total + parseFloat(receipt.amount);
    }, 0);
}

// Calculate today's total
calculateTodayTotal() {
    const today = new Date().toISOString().split('T')[0];
    return this.receipts
        .filter(receipt => receipt.date === today)
        .reduce((total, receipt) => total + parseFloat(receipt.amount), 0);
}

// Calculate month's total
calculateMonthTotal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return this.receipts
        .filter(receipt => {
            const receiptDate = new Date(receipt.date);
            return receiptDate.getFullYear() === year && receiptDate.getMonth() === month;
        })
        .reduce((total, receipt) => total + parseFloat(receipt.amount), 0);
}
}

// ==================== UI Management ====================
class UIManager {
    constructor(receiptManager) {
        this.receiptManager = receiptManager;
        this.initializeElements();
        this.attachEventListeners();
        this.renderReceipts();
        this.updateStatistics();
    }

    initializeElements() {
        // Form elements
        this.receiptForm = document.getElementById('receiptForm');
        this.receiptNumberInput = document.getElementById('receiptNumber');
        this.payerNameInput = document.getElementById('payerName');
        this.payerPhoneInput = document.getElementById('payerPhone');
        this.amountInput = document.getElementById('amount');
        this.dateInput = document.getElementById('date');
        this.debitAccountInput = document.getElementById('debitAccount');
        this.creditAccountInput = document.getElementById('creditAccount');
        this.purposeInput = document.getElementById('purpose');
        this.notesInput = document.getElementById('notes');

        // Statistics elements
        this.todayTotalDisplay = document.getElementById('todayTotal');
        this.monthTotalDisplay = document.getElementById('monthTotal');
        this.totalAmountDisplay = document.getElementById('totalAmount');
        this.orderCountDisplay = document.getElementById('orderCount');

        // Table elements
        this.receiptsTableBody = document.getElementById('receiptsTableBody');

        // Modal elements
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.closeModalBtn = document.getElementById('closeModal');
        this.cancelEditBtn = document.getElementById('cancelEdit');

        this.editIdInput = document.getElementById('editId');
        this.editReceiptNumberInput = document.getElementById('editReceiptNumber');
        this.editPayerNameInput = document.getElementById('editPayerName');
        this.editPayerPhoneInput = document.getElementById('editPayerPhone');
        this.editAmountInput = document.getElementById('editAmount');
        this.editDateInput = document.getElementById('editDate');
        this.editDebitAccountInput = document.getElementById('editDebitAccount');
        this.editCreditAccountInput = document.getElementById('editCreditAccount');
        this.editPurposeInput = document.getElementById('editPurpose');
        this.editNotesInput = document.getElementById('editNotes');

        // Print modal elements
        this.printModal = document.getElementById('printModal');
        this.closePrintModalBtn = document.getElementById('closePrintModal');
        this.cancelPrintBtn = document.getElementById('cancelPrint');
        this.printBtn = document.getElementById('printBtn');
        this.printContent = document.getElementById('printContent');

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;

        // Set next receipt number
        this.receiptNumberInput.value = this.receiptManager.generateReceiptNumber();
    }

    attachEventListeners() {
        // Form submission
        this.receiptForm.addEventListener('submit', (e) => this.handleAddReceipt(e));

        // Edit form submission
        this.editForm.addEventListener('submit', (e) => this.handleEditReceipt(e));

        // Modal controls
        this.closeModalBtn.addEventListener('click', () => this.closeEditModal());
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());

        // Print modal controls
        this.closePrintModalBtn.addEventListener('click', () => this.closePrintModal());
        this.cancelPrintBtn.addEventListener('click', () => this.closePrintModal());
        this.printBtn.addEventListener('click', () => this.handlePrint());

        // Close modals on outside click
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeEditModal();
            }
        });

        this.printModal.addEventListener('click', (e) => {
            if (e.target === this.printModal) {
                this.closePrintModal();
            }
        });

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.editModal.classList.contains('active')) {
                    this.closeEditModal();
                }
                if (this.printModal.classList.contains('active')) {
                    this.closePrintModal();
                }
            }
        });
    }

    handleAddReceipt(e) {
        e.preventDefault();

        const receiptData = {
            payerName: this.payerNameInput.value.trim(),
            payerPhone: this.payerPhoneInput.value.trim(),
            amount: parseFloat(this.amountInput.value),
            date: this.dateInput.value,
            debitAccount: this.debitAccountInput.value,
            creditAccount: this.creditAccountInput.value,
            purpose: this.purposeInput.value.trim(),
            notes: this.notesInput.value.trim()
        };

        this.receiptManager.addReceipt(receiptData);
        this.renderReceipts();
        this.updateStatistics();
        this.receiptForm.reset();

        // Reset date to today and update receipt number
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;
        this.receiptNumberInput.value = this.receiptManager.generateReceiptNumber();

        this.showNotification('Kirim muvaffaqiyatli qabul qilindi!', 'success');
    }

    handleEditReceipt(e) {
        e.preventDefault();

        const id = this.editIdInput.value;
        const updatedData = {
            payerName: this.editPayerNameInput.value.trim(),
            payerPhone: this.editPayerPhoneInput.value.trim(),
            amount: parseFloat(this.editAmountInput.value),
            date: this.editDateInput.value,
            debitAccount: this.editDebitAccountInput.value,
            creditAccount: this.editCreditAccountInput.value,
            purpose: this.editPurposeInput.value.trim(),
            notes: this.editNotesInput.value.trim()
        };

        this.receiptManager.updateReceipt(id, updatedData);
        this.renderReceipts();
        this.updateStatistics();
        this.closeEditModal();
        this.showNotification('Kirim muvaffaqiyatli yangilandi!', 'success');
    }

    openEditModal(id) {
        const receipt = this.receiptManager.getReceipt(id);
        if (receipt) {
            this.editIdInput.value = receipt.id;
            this.editReceiptNumberInput.value = receipt.receiptNumber;
            this.editPayerNameInput.value = receipt.payerName;
            this.editPayerPhoneInput.value = receipt.payerPhone || '';
            this.editAmountInput.value = receipt.amount;
            this.editDateInput.value = receipt.date;
            this.editDebitAccountInput.value = receipt.debitAccount || '';
            this.editCreditAccountInput.value = receipt.creditAccount || '';
            this.editPurposeInput.value = receipt.purpose;
            this.editNotesInput.value = receipt.notes || '';
            this.editModal.classList.add('active');
        }
    }

    closeEditModal() {
        this.editModal.classList.remove('active');
        this.editForm.reset();
    }

    handleDeleteReceipt(id) {
        if (confirm('Ushbu kirim orderini o\'chirmoqchimisiz?')) {
            this.receiptManager.deleteReceipt(id);
            this.renderReceipts();
            this.updateStatistics();
            this.showNotification('Kirim o\'chirildi', 'info');
        }
    }

    openPrintModal(id) {
        const receipt = this.receiptManager.getReceipt(id);
        if (receipt) {
            this.printContent.innerHTML = this.generatePrintContent(receipt);
            this.printModal.classList.add('active');
        }
    }

    closePrintModal() {
        this.printModal.classList.remove('active');
    }

    handlePrint() {
        window.print();
    }

    generatePrintContent(receipt) {
        const date = new Date(receipt.date);
        const formattedDate = new Intl.DateTimeFormat('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);

        return `
            <div class="print-header">
                <h3>NAQD PUL KIRIM QABULI</h3>
                <p>Qabul №: ${receipt.receiptNumber}</p>
            </div>
            <div class="print-body">
                <div class="print-row">
                    <span class="print-label">To'lovchi:</span>
                    <span>${this.escapeHtml(receipt.payerName)}</span>
                </div>
                ${receipt.payerPhone ? `
                <div class="print-row">
                    <span class="print-label">Telefon:</span>
                    <span>${this.escapeHtml(receipt.payerPhone)}</span>
                </div>
                ` : ''}
                <div class="print-row">
                    <span class="print-label">Summa:</span>
                    <span>${this.formatCurrency(receipt.amount)}</span>
                </div>
                <div class="print-row">
                    <span class="print-label">Debit schyoti:</span>
                    <span>${this.escapeHtml(receipt.debitAccount || '-')}</span>
                </div>
                <div class="print-row">
                    <span class="print-label">Kredit schyoti:</span>
                    <span>${this.escapeHtml(receipt.creditAccount || '-')}</span>
                </div>
                <div class="print-row">
                    <span class="print-label">To'lov maqsadi:</span>
                    <span>${this.escapeHtml(receipt.purpose)}</span>
                </div>
                <div class="print-row">
                    <span class="print-label">Sana:</span>
                    <span>${formattedDate}</span>
                </div>
                ${receipt.notes ? `
                <div class="print-row">
                    <span class="print-label">Izoh:</span>
                    <span>${this.escapeHtml(receipt.notes)}</span>
                </div>
                ` : ''}
            </div>
            <div class="print-footer">
                <p>Rahmat!</p>
                <p style="margin-top: 20px;">_________________</p>
                <p>Kassir imzosi</p>
            </div>
        `;
    }

    renderReceipts() {
        const receipts = this.receiptManager.getAllReceipts();

        if (receipts.length === 0) {
            this.receiptsTableBody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="8">
                        <div class="empty-message">
                            <span class="empty-icon">📋</span>
                            <p>Hozircha kirim orderlar yo'q</p>
                            <p class="empty-hint">Yuqoridagi formadan yangi kirim qo'shing</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            this.receiptsTableBody.innerHTML = receipts.map((receipt) => {
                return `
                    <tr>
                        <td><strong>${this.escapeHtml(receipt.receiptNumber)}</strong></td>
                        <td>${this.escapeHtml(receipt.payerName)}</td>
                        <td><strong>${this.formatCurrency(receipt.amount)}</strong></td>
                        <td>${this.escapeHtml(receipt.debitAccount || '-')}</td>
                        <td>${this.escapeHtml(receipt.creditAccount || '-')}</td>
                        <td>${this.escapeHtml(receipt.purpose)}</td>
                        <td>${this.formatDate(receipt.date)}</td>
                        <td>
                            <button class="btn btn-print" onclick="ui.openPrintModal('${receipt.id}')" title="Chop etish">
                                🖨️
                            </button>
                            <button class="btn btn-edit" onclick="ui.openEditModal('${receipt.id}')" title="Tahrirlash">
                                ✏️
                            </button>
                            <button class="btn btn-delete" onclick="ui.handleDeleteReceipt('${receipt.id}')" title="O'chirish">
                                🗑️
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    updateStatistics() {
        const todayTotal = this.receiptManager.calculateTodayTotal();
        const monthTotal = this.receiptManager.calculateMonthTotal();
        const total = this.receiptManager.calculateTotal();
        const count = this.receiptManager.getAllReceipts().length;

        this.todayTotalDisplay.textContent = this.formatCurrency(todayTotal);
        this.monthTotalDisplay.textContent = this.formatCurrency(monthTotal);
        this.totalAmountDisplay.textContent = this.formatCurrency(total);
        this.orderCountDisplay.textContent = count;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount) + ' so\'m';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('uz-UZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            color: #0a1f0f;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.4s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
}

// ==================== Initialize Application ====================
let receiptManager;
let ui;

document.addEventListener('DOMContentLoaded', () => {
    receiptManager = new ReceiptManager();
    ui = new UIManager(receiptManager);

    console.log('Naqd Pul Kirim Order Tizimi ishga tushdi!');
    console.log(`Jami ${receiptManager.getAllReceipts().length} ta kirim yuklandi`);
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
