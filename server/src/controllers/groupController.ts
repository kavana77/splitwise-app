import { RequestHandler } from "express";
import db from "../config/firebaseConfig";

interface GroupMember {
  uid: string;
  name: string;
  email?: string;
}

interface AddGroupBody {
  groupName: string;
//   createdBy: string;
  groupMembers: GroupMember[];
  groupType: string;
}

export const addGroup: RequestHandler<AddGroupBody> = async (req, res) => {
  const { groupName, groupMembers, groupType } = req.body;
  
  try {
    if (!groupName || !Array.isArray(groupMembers) || groupMembers.length === 0) {
      return res.status(400).json({ message: "Invalid group data. Group name, creator, and at least one member are required." });
    }

    const newGroupRef = db.ref("group").push();
    const groupId = newGroupRef.key;
    const createdAt = Date.now();
    
    // Transform array to object for efficient Firebase access
    const memberObj: Record<string, any> = {};
    groupMembers.forEach((member) => {
      memberObj[member.uid] = {
        name: member.name,
        email: member.email,
        // role: member.uid === createdBy ? "admin" : "member",
        joinedAt: createdAt
      };
    });

    const groupData = {
        groupId,
      groupName,
    //   createdBy,
      groupMembers: memberObj,
      groupType: groupType || "others",
      createdAt
    };
    
    await newGroupRef.set(groupData);
    res.status(200).json({message:"Group created successfully", group:groupData})

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllGroups: RequestHandler = async (req, res) => {
  try {
    const snap = await db.ref("group").once("value");
    if (!snap.exists()) return res.status(200).json({ groups: [] });

    const val = snap.val() as Record<string, any>;
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

    const data = groupSnap.val();
    const groups = Object.entries(data).map(([id, group]) => ({
      id,
      ...(group as Record<string, unknown>)
    }));

    res.status(200).json({ message: "Group fetched successfully", groups });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};