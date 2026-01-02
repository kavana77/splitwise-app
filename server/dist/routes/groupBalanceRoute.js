"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupBalanceController_1 = require("../controllers/groupBalanceController");
const router = express_1.default.Router();
router.get('/group/balance/:groupId', groupBalanceController_1.getGroupBalance);
router.post('/group/:groupId/convert', groupBalanceController_1.convertGroupExpenses);
exports.default = router;
