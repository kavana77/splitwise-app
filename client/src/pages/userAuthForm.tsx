import InputBox from "../components/InputBox";
import GoogleIcon from "../assets/google.png";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  type User,
  sendEmailVerification,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, googleProvider, db } from "../firebaseConfig";
import { useForm, type FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { GroupMember } from "@/types/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCountDown } from "@/hooks/useCountDown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";

const UserAuthForm = () => {
  const navigate = useNavigate();
  const { setCount } = useCountDown();
const loginForm = useForm()
const signupForm = useForm()

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
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
      throw err;
    }
  };


  const handleSignup = async (data: FieldValues) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = result.user;
      if (user) {
        await updateProfile(user, { displayName: data.name });
        await saveUserToDB(user);
      }
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        navigate("/verify-email");
      } else {
        localStorage.setItem("user", data.name);
        toast.success("Signed up successfully");
        navigate("/dashboard");
      }
      setCount(60);
      signupForm.reset()
    } catch (error: unknown) {
      console.error(error);
      if (typeof error === "object" && error !== null && "code" in error) {
        const code = (error as { code: string }).code;

        if (code === "auth/email-already-in-use") {
          toast.error("This email is already registered.");
        } else if (code === "auth/invalid-email") {
          toast.error("Invalid email address.");
        } else if (code === "auth/weak-password") {
          toast.error("Password should be at least 6 characters.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      }
    }
  };
    const handleLogin = async (data: FieldValues) => {
      console.log("Login form submitted", data);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      console.log("Logged in user:", user)
      await saveUserToDB(user);
      localStorage.setItem("user", user.displayName || "");
      localStorage.setItem("userEmail", user.email || "");
      
      toast.success("Login successfully");
      navigate("/dashboard");
      loginForm.reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await saveUserToDB(user);
      localStorage.setItem("user", user.displayName || "");
      toast.success("google sign in success");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("google sign in failed");
    }
  };
  const handlePasswordReset = async () => {
    if (!resetEmail) return toast.error("Please enter your email");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Password reset email sent! Check your inbox.");
      setIsDialogOpen(false);
      setResetEmail("");
    } catch {
      toast.error("Failed to send reset email. Try again later.");
    }
  };

  return (
    <section className="relative w-full py-16">
      <Tabs defaultValue="signup">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login" >
          <form 
          onSubmit={loginForm.handleSubmit(handleLogin)}
          >
            <InputBox
              {...loginForm.register("email",{required: true})}
              label="Email address"
              type="email"
              placeholder="Enter your email address"
            />
            <InputBox
              {...loginForm.register("password",{required: true})}
              label="Password"
              type="password"
              placeholder="Enter the password"
            />
            <button
              className="w-full flex justify-center bg-emerald-500 text-white rounded-md p-2 mt-12 cursor-pointer text-xl"
              type="submit"
            >
              Login
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
 {/* PASSWORD RESET */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <p className="underline text-center cursor-pointer mt-4">
                  Forgot password?
                </p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Forgot your password?</DialogTitle>
                  <Text variant="muted">Enter your registered email so that we can send you password reset link</Text>
                </DialogHeader>
                <Input
                  type="email"
                  placeholder="e.g example@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePasswordReset}>Send Reset Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        
        </TabsContent>
        <TabsContent value="signup" >
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="mb-[-28px]">
            <InputBox
              {...signupForm.register("name", { required: "Please enter your name" })}
              label="My name is"
              type="text"
              placeholder="Enter your name"
            />
            <InputBox
              {...signupForm.register("email")}
              label="Email address"
              type="email"
              placeholder="Enter your email address"
            />
            <InputBox
              {...signupForm.register("password")}
              label="Password"
              type="password"
              placeholder="Enter the password"
            />
            <button
              className="w-full flex justify-center bg-emerald-500 text-white rounded-md p-2 mt-12 cursor-pointer text-xl"
              type="submit"
            >
              Signup
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
          </form>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default UserAuthForm;
