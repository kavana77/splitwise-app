import { useForm ,useFieldArray} from "react-hook-form";
import InputBox from "../component/InputBox";
import { Input } from "../component/ui/input";
import Text from "../component/ui/text";
import { createGroup,  fetchUsers,  type AddGroupBody } from "@/utils/http";
import {useQuery} from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";

const GroupPage = () => {
    const navigate = useNavigate()
      const { data: users = [], isLoading } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

 const { register, handleSubmit,control,setValue } = useForm<AddGroupBody>({
    defaultValues: {
     
      groupMembers: [{ uid: "", name: "", email: "" }],
        
    }
  });
  const {fields,append,remove} =useFieldArray({control, name:"groupMembers"})

  const handleSelectUser =async (e: React.ChangeEvent<HTMLSelectElement>, index:number) => {
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
        await createGroup(data)
        console.log("Data saved successfully", data)
        navigate("/dashboard")
    } catch (error) {
      console.error("Error submitting blog data: ", error);
      alert(error);
    }
  };
    if (isLoading) return <p>Loading users...</p>;

  return (

    <section className="px-12 space-y-4 mt-12">
      <Text className="text-gray-400">START A NEW GROUP</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputBox
          {...register("groupName")}
          label="My group shall be called"
          type="text"
          placeholder="Enter group name"
        />
        <div>
          <Text className="text-gray-400">GROUP MEMBERS</Text>
          {fields.map((field,index)=>(
          <div key={field.id} className="flex gap-2">
                <select 
                onChange={(e) => handleSelectUser(e, index)}
                className="bg-gray-200 p-2 rounded-sm"
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
            <Input {...register(`groupMembers.${index}.name`)} type="text" placeholder="Name" readOnly/>
            <Input {...register(`groupMembers.${index}.email`)}type="email" placeholder="Email address (optional)" readOnly/>
            <button className="text-red-600 cursor-pointer" onClick={()=>remove(index)}>X</button>
          </div>
       
          ))}

        <button type="button" className="text-blue-500 hover:underline cursor-pointer"
        onClick={()=> append({uid:"",name: "", email: ""})}>
          +Add a person
        </button>
        </div>
        <div>
          <Text className="text-gray-400 mb-2">GROUP TYPE</Text>
          <select {...register("groupType")} className="bg-gray-200 px-3 py-1 rounded-sm">
            <option>Home</option>
            <option>Trip</option>
            <option>Couple</option>
            <option>Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-orange-400 text-2xl text-white px-3 py-1 rounded-sm cursor-pointer"
        >
          Save
        </button>
      </form>
    </section>

  );
};

export default GroupPage;
