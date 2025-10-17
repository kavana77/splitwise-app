import { RequestHandler } from "express";
import db from "../config/firebaseConfig";

interface GroupMember {
  uid: string;
  name: string;
  email: string;
}

export const addUser: RequestHandler = async (req, res) => {
  const { groupId } = req.params;
  const { groupMembers } = req.body;
  try {
    if (groupMembers.length === 0) {
      return res.status(400).json({ message: "Invalid groupMembers" });
    }
    const groupMembersRef = db.ref(`group/${groupId}/groupMembers`);

    const membersObj: Record<string, GroupMember> = {};
    (groupMembers as GroupMember[]).forEach((member: GroupMember) => {
      if (member.uid && member.name && member.email) {
        membersObj[member.uid] = member;
      }
    });

    await groupMembersRef.update(membersObj);
    res.status(201).json({ message: "group members updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
