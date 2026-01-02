"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const router = express_1.default.Router();
router.post('/newGroup', groupController_1.addGroup);
router.get('/groups', groupController_1.getAllGroups);
router.get('/group/:groupId', groupController_1.getGroupById);
exports.default = router;
