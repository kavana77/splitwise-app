import { Mail } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";
import Text from "./ui/text";
import {
  onAuthStateChanged,
  sendEmailVerification,
  type User,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { Verified } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCountDown } from "@/hooks/useCountDown";

const VerifyEmail = () => {
  const { count, setCount, formatTime } = useCountDown();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [verified, setVerified] = useState(user?.emailVerified ?? false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setVerified(currentUser?.emailVerified ?? false);
    });
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setVerified(true);
          clearInterval(interval);
        }
      }
    }, 3000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (verified) {
      const timeout = setTimeout(() => {
        localStorage.setItem("showLoginToast", "true");
        window.location.href = "/";
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [verified]);
  const handleResend = async () => {
    if (user) {
      await sendEmailVerification(user);
      toast.info("Verification email sent again");
    }
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Card className="text-center w-150 flex shadow-lg shadow-emerald-700/50">
        <CardContent>
          {!verified ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="text-center flex justify-center items-center flex-col gap-4"
            >
              <div className="w-14 h-14 rounded-full opacity-45 flex items-center justify-center text-white bg-emerald-500 shadow-md shadow-emerald-400">
                <Mail />
              </div>
              <Text variant="heading">Verify your email address</Text>
              <h3>We have sent a verification link </h3>
              <h3>
                Click on the link to complete the verification process. <br />
                You might need to{" "}
                <span className="text-black font-bold">
                  check your spam folder.
                </span>
              </h3>
              <p>{formatTime()}</p>
              <button
                className={`bg-black/60 text-white/80 py-2 px-4 hover:underline rounded-md  ${
                  count > 0
                    ? "opacity-20 cursor-not-allowed"
                    : "opacity-100 cursor-pointer"
                }`}
                onClick={() => {
                  handleResend();
                  setCount(60);
                }}
              >
                Resend email
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="flex flex-col gap-4 items-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -290, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 5 }}
                className="w-14 h-14 rounded-full opacity-45 flex items-center justify-center text-white bg-emerald-500 shadow-md shadow-emerald-500"
              >
                <Verified className="w-10 h-10" />
              </motion.div>
              <Text variant="heading" className="text-green-600">
                Verified successfully
              </Text>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
