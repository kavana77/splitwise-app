"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const firebaseConfig_1 = __importDefault(require("../config/firebaseConfig"));
const addUser = async (req, res) => {
    const { groupId } = req.params;
    const { groupMembers } = req.body;
    try {
        if (groupMembers.length === 0) {
            return res.status(400).json({ message: "Invalid groupMembers" });
        }
        const groupMembersRef = firebaseConfig_1.default.ref(`group/${groupId}/groupMembers`);
        const membersObj = {};
        groupMembers.forEach((member) => {
            if (member.uid && member.name && member.email) {
                membersObj[member.uid] = member;
            }
        });
        await groupMembersRef.update(membersObj);
        res.status(201).json({ message: "group members updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.addUser = addUser;
