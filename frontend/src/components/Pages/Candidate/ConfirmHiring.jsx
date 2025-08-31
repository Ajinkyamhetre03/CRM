import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FourSquare } from "react-loading-indicators";
import { toast } from "react-toastify";
import axios from "axios";
import { CheckCircle2, XCircle } from "lucide-react";

const ConfirmHiring = () => {
  const { applicationId, token } = useParams();
  const navigate = useNavigate();
  const base_Url = import.meta.env.VITE_BASE_URL;

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'idle', 'success', 'error'
  const [data, setData] = useState(null);

  // Handle confirm hiring POST only (no GET for validation)
  const confirmHiring = async () => {
    setIsLoading(true);
    setStatus(null);
    try {
      const response = await axios.post(
        `${base_Url}/api/candidate/applications/${applicationId}/confirm-hiring/${token}`
      );
      setData(response.data);
      setStatus("success");
      toast.success("Hiring confirmed successfully!");
    } catch (error) {
      console.error("❌ POST Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to confirm hiring.");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Cool UI styling with modern, clean look and smooth transitions
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-600 via-purple-700 to-pink-700 p-6">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <FourSquare color="#fff" size="medium" text="Processing..." textColor="#ddd" />
        </div>
      ) : status === "success" ? (
        <div className="bg-white/20 backdrop-blur-md rounded-3xl max-w-md w-full p-8 text-center text-white shadow-lg border border-white/30">
          <CheckCircle2 className="mx-auto w-14 h-14 mb-6 text-green-400 animate-bounce" />
          <h2 className="text-2xl font-semibold mb-2">Hiring Confirmed!</h2>
          <p className="mb-6 text-gray-200">Thank you for confirming your intent to join our organization.</p>
          <button
            onClick={() => navigate("/")}
            className="inline-block bg-green-500 hover:bg-green-600 transition rounded-lg px-6 py-3 font-semibold"
          >
            Go to Home
          </button>
        </div>
      ) : status === "error" ? (
        <div className="bg-white/20 backdrop-blur-md rounded-3xl max-w-md w-full p-8 text-center text-white shadow-lg border border-white/30">
          <XCircle className="mx-auto w-14 h-14 mb-6 text-red-400 animate-shake" />
          <h2 className="text-2xl font-semibold mb-2">Link Invalid or Expired</h2>
          <p className="mb-6 text-gray-300">The confirmation link is not valid or has expired.</p>
          <button
            onClick={() => navigate("/")}
            className="inline-block bg-red-500 hover:bg-red-600 transition rounded-lg px-6 py-3 font-semibold"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <div className="bg-white/20 backdrop-blur-md rounded-3xl max-w-md w-full p-8 text-center text-white shadow-lg border border-white/30">
          <h1 className="text-3xl font-bold mb-4">Confirm Your Hiring</h1>
          <p className="mb-6 text-gray-200">Click the button below to confirm you want to work with us.</p>
          <button
            onClick={confirmHiring}
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition rounded-lg px-8 py-3 text-white font-semibold text-lg"
          >
            Confirm Hiring
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmHiring;
