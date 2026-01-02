"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = require("../controllers/expenseController");
const router = express_1.default.Router();
router.post('/expenses', expenseController_1.addExpenses);
router.get('/getExpense/:groupId', expenseController_1.getExpenseByGroupId);
router.delete('/expense/:groupId/:expenseId', expenseController_1.deleteExpense);
exports.default = router;
