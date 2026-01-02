"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = __importDefault(require("./utils/validation"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const groupRoute_1 = __importDefault(require("./routes/groupRoute"));
const expenseRoute_1 = __importDefault(require("./routes/expenseRoute"));
const settlePaymentRoute_1 = __importDefault(require("./routes/settlePaymentRoute"));
const groupBalanceRoute_1 = __importDefault(require("./routes/groupBalanceRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = validation_1.default.PORT;
app.use("/api/check", groupBalanceRoute_1.default);
app.use("/api/add", groupRoute_1.default, expenseRoute_1.default, settlePaymentRoute_1.default, userRoute_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
