import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FourSquare } from "react-loading-indicators";
import { toast } from "react-toastify";
import axios from "axios";
import { CheckCircle2, XCircle } from "lucide-react";

const ConfirmHiring = () => {
  const { applicationId, token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const confirmHiring = async () => {
      try {
        // ✅ Backend API
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/candidate/${applicationId}/confirm-hiring/${token}`
        );

        setStatus({ success: true, message: res.data.message });
        toast.success("Application confirmed ✅");
      } catch (error) {
        setStatus({
          success: false,
          message:
            error.response?.data?.message ||
            "Something went wrong, please try again.",
        });
        toast.error("Error confirming application ❌");
      } finally {
        setIsLoading(false);
      }
    };

    confirmHiring();
  }, [applicationId, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FourSquare
          color="#acadac"
          size="medium"
          text="Confirming..."
          textColor="#e76d6d"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="relative bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 sm:p-10 w-full max-w-md text-center">
        {/* Status Icon & Title */}
        {status?.success ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Hiring Confirmed 🎉
            </h1>
            <p className="text-gray-700 dark:text-gray-300">{status.message}</p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Confirmation Failed
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              {status?.message}
            </p>
          </>
        )}

        {/* Back Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmHiring;
