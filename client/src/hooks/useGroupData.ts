import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchGroupById } from "@/utils/http";
import type { GroupMember } from "@/types/type";

type GroupMembersMap = Record<
  string,
  {
    name: string;
    email?: string;
    joinedAt: number;
  }
>;

export const useGroupData = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const {
    data: groupData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroupById(groupId!),
    enabled: !!groupId,
  });

  const group = groupData?.groups?.[0];

  const rawMembers = group?.groupMembers as GroupMembersMap | undefined;

  const members: GroupMember[] = rawMembers
    ? Object.entries(rawMembers).map(([uid, data]) => ({
        uid,          
        name: data.name,
        email: data.email,
        joinedAt: data.joinedAt,
      }))
    : [];

  return {
    group,
    members,
    isLoading,
    isError,
    error,
    refetch,
  };
};
