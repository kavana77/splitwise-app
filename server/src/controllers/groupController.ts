import { RequestHandler } from "express";
import db from "../config/firebaseConfig";
import { sendEmail } from "../utils/sendEmail";

interface GroupMember {
  uid: string;
  name: string;
  email?: string;
}

interface AddGroupBody {
  groupName: string;
  groupMembers: GroupMember[];
  groupType: string;
  createdBy: string;
}

export const addGroup: RequestHandler<AddGroupBody> = async (req, res) => {
  const { groupName, groupMembers, groupType, createdBy } = req.body;

  try {
    if (
      !groupName ||
      !Array.isArray(groupMembers) ||
      groupMembers.length === 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid group data. Group name, creator, and at least one member are required.",
        });
    }

    const newGroupRef = db.ref("group").push();
    const groupId = newGroupRef.key;
    const createdAt = Date.now();

    const memberObj: Record<string, any> = {};
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
    await Promise.all(
      groupMembers.map((member) => {
        if (member.email) {
          const subject = `Invitation to join group: ${groupName}`;
          const text = `Hi ${member.name},\n\nYou have been invited to join the group "${groupName}" on Splitwise.\n\nBest regards,\nSplitwise Team`;
          return sendEmail(member.email, subject, text);
        }
        return Promise.resolve();
      })
    );
    res
      .status(200)
      .json({ message: "Group created successfully", group: groupData });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllGroups: RequestHandler = async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ message: "User ID required" });

  try {
    const snap = await db
      .ref("group")
      .orderByChild("createdBy")
      .equalTo(uid as string)
      .once("value");
    if (!snap.exists())
      return res.status(200).json({ message: "Group not exists" });

    const val = snap.val() as Record<string, AddGroupBody>;
    const groups = Object.entries(val).map(([key, g]) => ({
      id: key,
      ...g,
    }));
    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getGroupById: RequestHandler = async (req, res) => {
  const { groupId } = req.params;

  try {
    const groupSnap = await db
      .ref("group")
      .orderByChild("groupId")
      .equalTo(groupId)
      .once("value");

    if (!groupSnap.exists()) {
      return res.status(404).json({ message: "Group not found" });
    }

    const data = groupSnap.val() as Record<string, any>;
    const groups = Object.entries(data).map(([key, group]) => ({
      id: key,
      ...group,
      groupMembers: group.groupMembers,
    }));

    res.status(200).json({ message: "Group fetched successfully", groups });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
