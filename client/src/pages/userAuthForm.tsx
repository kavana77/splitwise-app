import InputBox from "../component/InputBox";
import { Card, CardContent, CardTitle } from "../component/ui/card";
import GoogleIcon from "../assets/google.png";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  type User,
} from "firebase/auth";
import {ref,set} from"firebase/database"
import { auth, googleProvider,db } from "../firebaseConfig";
import { useForm, type FieldValues } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { GroupMember } from "@/utils/http";

interface UserAuthFormProps {
  type: string;
}

const UserAuthForm = ({ type }: UserAuthFormProps) => {
  const isLogin = type === "log-in";
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const saveUserToDB = async (user: User | null) => {
    try {
      if (!user || !user.uid) {
        console.warn("saveUserToDB: invalid user", user);
        return;
      }

      const userData: GroupMember = {
        uid: user.uid,
        name: user.displayName ?? null,
        email: user.email ?? null,
      };

      console.log("Saving user to Realtime DB:", userData);
      await set(ref(db, `users/${user.uid}`), userData);
      console.log("Saved user to DB:", user.uid);
    } catch (err) {
      console.error("Failed to save user to DB:", err);
      throw err; // rethrow so caller can handle/log
    }
  };
  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;
                await saveUserToDB(user)

        localStorage.setItem("user", user.displayName || "");
        alert("User logged in successfully");
        navigate("/dashboard");
      } else {
        const result = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = result.user;
        await updateProfile(user, {
          displayName: data.name,
        });
                await saveUserToDB(user)

        localStorage.setItem("user", data.name);

        navigate("/dashboard");
      }
      reset();
    } catch (error) {
      console.log(error);
      alert("User created failed");
    }
  };
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      await saveUserToDB(user)
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
      alert("google sign in failed")
    }
  };
  return (
    <section className="relative w-full py-16">
      <div className="absolute top-5 left-7 hover:opacity-20">
        <Link to="/">
          <ArrowLeft />
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-center"
      >
        <Card className="w-100">
          <CardTitle className="pl-6 text-2xl text-gray-400">
            {isLogin ? "Log in" : "INTRODUCE YOURSELF"}
          </CardTitle>
          <CardContent>
            {!isLogin && (
              <>
                <InputBox
                  {...register("name")}
                  label="My name is"
                  type="text"
                  placeholder="Enter your name"
                />
              </>
            )}
            <InputBox
              {...register("email")}
              label="Email address"
              type="email"
              placeholder="Enter your email address"
            />
            <InputBox
              {...register("password")}
              label="Password"
              type="password"
              placeholder="Enter the password"
            />
            <button
              className="w-full flex justify-center bg-emerald-500 text-white rounded-md p-2 mt-12 cursor-pointer text-xl"
              type="submit"
            >
              {type.replace("-", " ")}
            </button>
            <div className="relative w-full flex items-center gap-2 my-8 opacity-18 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>or</p>
              <hr className="w-1/2 border-black" />
            </div>
            <button
              onClick={handleGoogle}
              className="flex gap-4 items-center border border-gray-300 rounded-md p-2 w-full justify-center cursor-pointer"
            >
              <img src={GoogleIcon} className="w-8 h-8" />
              continue with google
            </button>
            {isLogin ? (
              <p className="text-center mt-2">
                don't have an account?{" "}
                <Link to="/signup" className="underline text-blue-500">
                  signup
                </Link>
              </p>
            ) : (
              <p className="text-center mt-2">
                Already a user?{" "}
                <Link to="/login" className="underline text-blue-500">
                  Login
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </section>
  );
};

export default UserAuthForm;
