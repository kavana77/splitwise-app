"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupById = exports.getAllGroups = exports.addGroup = void 0;
const firebaseConfig_1 = __importDefault(require("../config/firebaseConfig"));
const sendEmail_1 = require("../utils/sendEmail");
const addGroup = async (req, res) => {
    const { groupName, groupMembers, groupType, createdBy } = req.body;
    try {
        if (!groupName ||
            !Array.isArray(groupMembers) ||
            groupMembers.length === 0) {
            return res
                .status(400)
                .json({
                message: "Invalid group data. Group name, creator, and at least one member are required.",
            });
        }
        const newGroupRef = firebaseConfig_1.default.ref("group").push();
        const groupId = newGroupRef.key;
        const createdAt = Date.now();
        const memberObj = {};
        groupMembers.forEach((member) => {
            memberObj[member.uid] = {
                name: member.name,
                email: member.email,
                joinedAt: createdAt,
            };
        });
        const groupData = {
            groupId,
            groupName,
            groupMembers: memberObj,
            groupType: groupType || "others",
            createdAt,
            createdBy,
        };
        await newGroupRef.set(groupData);
        // Send email invitations to group members
        await Promise.all(groupMembers.map((member) => {
            if (member.email) {
                const subject = `Invitation to join group: ${groupName}`;
                const text = `Hi ${member.name},\n\nYou have been invited to join the group "${groupName}" on Splitwise.\n\nBest regards,\nSplitwise Team`;
                return (0, sendEmail_1.sendEmail)(member.email, subject, text);
            }
            return Promise.resolve();
        }));
        res
            .status(200)
            .json({ message: "Group created successfully", group: groupData });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.addGroup = addGroup;
const getAllGroups = async (req, res) => {
    const { uid } = req.query;
    if (!uid)
        return res.status(400).json({ message: "User ID required" });
    try {
        const snap = await firebaseConfig_1.default
            .ref("group")
            .orderByChild("createdBy")
            .equalTo(uid)
            .once("value");
        if (!snap.exists())
            return res.status(200).json({ message: "Group not exists" });
        const val = snap.val();
        const groups = Object.entries(val).map(([key, g]) => ({
            id: key,
            ...g,
        }));
        res.status(200).json({ groups });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.getAllGroups = getAllGroups;
const getGroupById = async (req, res) => {
    const { groupId } = req.params;
    try {
        const groupSnap = await firebaseConfig_1.default
            .ref("group")
            .orderByChild("groupId")
            .equalTo(groupId)
            .once("value");
        if (!groupSnap.exists()) {
            return res.status(404).json({ message: "Group not found" });
        }
        const data = groupSnap.val();
        const groups = Object.entries(data).map(([key, group]) => ({
            id: key,
            ...group,
            groupMembers: group.groupMembers,
        }));
        res.status(200).json({ message: "Group fetched successfully", groups });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.getGroupById = getGroupById;
