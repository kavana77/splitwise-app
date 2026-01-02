"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settlePaymentController_1 = require("../controllers/settlePaymentController");
const router = express_1.default.Router();
router.post('/settlement', settlePaymentController_1.settlePayment);
exports.default = router;
