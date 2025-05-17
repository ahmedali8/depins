import axios from "axios";
import { GoogleIcon } from "@/components/icons";
import { useGoogleLogin } from "@react-oauth/google";

interface GoogleSignInButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export default function GoogleSignInButton({
  className = "",
  text = "Sign in with Google",
}: Readonly<GoogleSignInButtonProps>) {
  /** Handlers */
  const fetchGoogleUserInfo = async (accessToken: string) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Google user info:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google login success:", tokenResponse);

      const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
      console.log("Google user info:", userInfo);

      // You can now handle userInfo (e.g., store it, send to your backend, etc.)
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  return (
    <button
      type="button"
      className={`relative flex w-[300px] items-center justify-center gap-2 rounded-md border border-[#2563eb] bg-[#2563eb] px-4 py-2 text-sm font-medium text-[#ffffff] shadow-sm transition-colors hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer ${className}`}
      onClick={() => {
        login();
      }}
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
        <GoogleIcon />
      </div>
      {text}
    </button>
  );
}
