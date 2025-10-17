import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { FaUsers } from "react-icons/fa";
import { User } from "lucide-react";
import Logo from "@/assets/images.png";
import type { Group, GroupMember } from "@/types/type";

interface Props {
  groups: Group[];
  members: GroupMember[];
  selected: string;
  setSelected: (id: string) => void;
  setUserBox: (open: boolean) => void;
}

const GroupSection = ({ groups, members, selected, setSelected, setUserBox }: Props) => {
  return (
    <div className="py-8 px-8 lg:w-72 xl:w-96">
      <div className="flex justify-between py-5">
        <Text className="md:text-2xl flex items-center gap-2">
          <FaUsers />
          Group
        </Text>
        <Link
          to="/groups/new"
          className="bg-black text-white px-3 py-1 rounded-md hover:bg-white hover:text-emerald-600 border border-gray-500 text-sm hover:scale-105 transition-all duration-300"
        >
          + Create
        </Link>
      </div>
    <div className="space-y-2">
      {groups.length > 0 ? (
        groups.map((group) => (
          <Card className="space-y-8 h-10 flex justify-center " key={group.groupId}>
            <CardContent className="flex gap-3">
              <img src={Logo} className="w-10 h-10 rounded-full" />
              <div className="flex flex-col">
                <Link
                  to={`/dashboard/group/${group.groupId}`}
                  onClick={() => setSelected(group.groupId)}
                  className={` block rounded-md font-bold ${
                    selected === group.groupId
                      ? "text-emerald-500"
                      : "hover:text-emerald-200"
                  }`}
                >
                  {group.groupName}
                </Link>
                {selected === group.groupId && (
                    <p className="text-xs text-gray-500">{members.length} people</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-sm italic p-2 text-center text-gray-500">
          You do not have any groups yet
        </p>
      )}
</div>
      <div className="mt-12">
        <div className="flex justify-between ">
          <Text className="text-2xl">Members</Text>
          <button
            onClick={() => setUserBox(true)}
            className="bg-black text-white px-3 py-1 rounded-md hover:bg-white hover:text-emerald-600 border border-gray-500 text-sm hover:scale-105 transition-all duration-300"
          >
            + Add
          </button>
        </div>
        <div className="pl-4">
          {members.length > 0 ? (
            members.map((m) => (
              <p key={m.uid} className="text-sm flex items-center gap-2 p-2">
                <User className="w-5 h-5" />
                {m.name}
              </p>
            ))
          ) : (
            <p className="text-sm italic py-2 text-center text-gray-500">
              No members yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSection;
