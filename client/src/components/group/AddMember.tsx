import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, addGroupMember } from "@/utils/http";
import type { GroupMember } from "@/types/type";
import SelectDialog from "@/components/SelectDialog";
import { Input } from "@/components/ui/input";

interface Props {
  userBox: boolean;
  setUserBox: (open: boolean) => void;
  groupId?: string;
}

const MemberSection = ({ userBox, setUserBox, groupId }: Props) => {
    const queryClient = useQueryClient();
  const { register, handleSubmit, setValue,reset } = useForm<GroupMember>();
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: ({ uid, name, email }: GroupMember) =>
      addGroupMember(groupId!, [{ uid, name, email }]),
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:["group",groupId]})
        reset();
        setUserBox(false)
    }
  });

  const handleSelectUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUid = e.target.value;
    const selectedUser = users.find((user) => user.uid === selectedUid);

    if (selectedUser) {
      setValue("uid", selectedUser.uid);
      setValue("name", selectedUser.name);
      setValue("email", selectedUser.email);
    }
  };

  const onSubmit = (data: GroupMember) => {
    mutation.mutate(data);
  };

  return (
    <SelectDialog
      isOpen={userBox}
      onOpenChange={setUserBox}
      title="Add new Group member"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <select
          onChange={(e) => handleSelectUser(e)}
          className="border p-2 rounded-md w-full"
        >
          <option value="" className="bg-gray-600">-- Select a user --</option>
          {users.map((user) => (
            <option key={user.uid} value={user.uid} className="bg-background">
              {user.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input type="hidden" {...register("uid")} />
          <Input {...register("name")} type="text" placeholder="Name" readOnly />
          <Input {...register("email")} type="email" placeholder="Email" readOnly />
        </div>
        <button
          type="submit"
          className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
        >
          Save
        </button>
      </form>
    </SelectDialog>
  );
};

export default MemberSection;
