import { useForm, useFieldArray } from "react-hook-form";
import InputBox from "../components/InputBox";
import { Input } from "../components/ui/input";
import Logo from "../assets/images.png";
import Text from "../components/ui/text";
import { createGroup, fetchUsers } from "@/utils/http";
import type { AddGroupBody } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { auth } from "../firebaseConfig";
import { toast } from "sonner";

const GroupPage = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<AddGroupBody>({
    defaultValues: {
      groupMembers: [{ uid: "", name: "", email: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "groupMembers",
  });
  const handleSelectUser = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const selectedUid = e.target.value;
    const selectedUser = users.find((user) => user.uid === selectedUid);

    if (selectedUser) {
      setValue(`groupMembers.${index}.uid`, selectedUser.uid);
      setValue(`groupMembers.${index}.name`, selectedUser.name);
      setValue(`groupMembers.${index}.email`, selectedUser.email);
    }
  };
  const onSubmit = async (data: AddGroupBody) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");
      const groupData = {
        ...data,
        createdBy: user.uid,
      };
      await createGroup(groupData);
      console.log("Data saved successfully", data);
      navigate("/dashboard");
      toast.success("Group data added successfully");
    } catch (error) {
      console.error("Error submitting blog data: ", error);
      alert(error);
    }
  };
  if (isLoading) return <p>Loading users...</p>;

  return (
    <section className="px-12 space-y-4 mt-12 flex bg-background text-foreground">
      <Link to="/dashboard">
        <ArrowLeft />
      </Link>
      <div className="hidden w-[50%] lg:w-[30%] md:flex flex-col items-center pl-10">
        <img src={Logo} className="w-50 h-50 hidden md:flex" />
      </div>
      <div className="md:w-[50%] ">
        <Text className="text-gray-400 md:text-3xl">START A NEW GROUP</Text>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <InputBox
            {...register("groupName")}
            label="My group shall be called"
            type="text"
            placeholder="Enter group name"
          />
          <div className="mt-6">
            <Text className="text-gray-400">GROUP MEMBERS</Text>
            {fields.map((field, index) => (
              <div key={field.id} className="md:flex gap-2 space-y-2">
                <select
                  onChange={(e) => handleSelectUser(e, index)}
                  className=" p-2 rounded-sm bg-background text-foreground border "
                >
                  <option value="">-- Select a user --</option>
                  {users.map((user) => (
                    <option key={user.uid} value={user.uid}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <input
                  type="hidden"
                  {...register(`groupMembers.${index}.uid`)}
                />
                <Input
                  {...register(`groupMembers.${index}.name`)}
                  type="text"
                  placeholder="Name"
                  readOnly
                />
                <Input
                  {...register(`groupMembers.${index}.email`)}
                  type="email"
                  placeholder="Email address (optional)"
                  readOnly
                />
                <button
                  className="text-red-600 cursor-pointer"
                  onClick={() => remove(index)}
                >
                  X
                </button>
              </div>
            ))}

            <button
              type="button"
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => append({ uid: "", name: "", email: "" })}
            >
              +Add a person
            </button>
          </div>
          <div>
            <Text className="text-gray-400 mb-2">GROUP TYPE</Text>
            <select
              {...register("groupType")}
              className="border bg-background px-3 py-1 rounded-sm"
            >
              <option>Home</option>
              <option>Trip</option>
              <option>Couple</option>
              <option>Other</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-400 text-2xl text-white px-3 py-1 rounded-sm cursor-pointer mt-12"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default GroupPage;
