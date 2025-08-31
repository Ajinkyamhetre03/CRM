import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FourSquare } from "react-loading-indicators";
import { toast } from "react-toastify";
import axios from "axios";
import { CheckCircle2, XCircle, CreditCard } from "lucide-react";

const PaymentConfirmation = () => {
  const { applicationId, token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [form, setForm] = useState({
    transactionId: "",
    paymentMethod: "UPI",
    paymentDate: new Date().toISOString().slice(0, 10),
  });
  const [formErrors, setFormErrors] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/candidate/applications/${applicationId}/payment-details/${token}`
      );
      setDetails(res.data.application);
      toast.success(res.data.message || "Payment details loaded.");
    } catch (error) {
      console.error("❌ Failed to fetch payment details:", error);
      toast.error("Failed to load payment details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!form.transactionId.trim()) {
      errors.transactionId = "Transaction ID is required.";
    } else if (form.transactionId.length < 6) {
      errors.transactionId = "Transaction ID must be at least 6 characters.";
    }

    if (!form.paymentMethod) {
      errors.paymentMethod = "Please select a payment method.";
    }

    if (!form.paymentDate) {
      errors.paymentDate = "Payment date is required.";
    } else {
      const selectedDate = new Date(form.paymentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.paymentDate = "Payment date cannot be in the future.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setIsPaying(true);
      const res = await axios.post(
        `${baseUrl}/api/candidate/applications/${applicationId}/payment/${token}`,
        form
      );
      toast.success(res.data.message || "Payment successful!");
      navigate(`/`); // redirect after success
    } catch (error) {
      console.error("❌ Payment failed:", error);
      toast.error(error.response?.data?.message || "Payment failed!");
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FourSquare
          color="#6366f1"
          size="medium"
          text="Loading..."
          textColor="#4b5563"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-600 via-purple-700 to-pink-700 px-4 py-8">
      <div className="bg-white/20 backdrop-blur-md rounded-3xl max-w-md w-full p-6 shadow-lg border border-white/30 text-white">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CreditCard className="w-6 h-6" /> Payment Confirmation
        </h1>

        {details ? (
          <>
            {/* Candidate Details */}
            <div className="space-y-2 text-white/80 text-sm mb-6">
              <p>
                <strong>Candidate:</strong> {details.fullName}
              </p>
              <p>
                <strong>Email:</strong> {details.email}
              </p>
              <p>
                <strong>Phone:</strong> {details.phone}
              </p>
              <p>
                <strong>Job Dept:</strong> {details.jobDetails?.department}
              </p>
              <p>
                <strong>Expected Salary:</strong> ₹{details.expectedSalary}
              </p>
              <p>
                <strong>Payment Amount:</strong> ₹{details.paymentAmount}
              </p>
              <p className="flex items-center gap-1">
                <strong>Status:</strong>{" "}
                {details.status === "Paid" ? (
                  <CheckCircle2 className="text-green-400 w-5 h-5" />
                ) : (
                  <XCircle className="text-red-400 w-5 h-5" />
                )}
                {details.status}
              </p>
            </div>

            {/* Payment Form */}
            {details.status !== "Paid" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4 text-white/90">
                  Complete Payment
                </h2>

                <div>
                  <input
                    type="text"
                    placeholder="Transaction ID"
                    value={form.transactionId}
                    onChange={(e) =>
                      setForm({ ...form, transactionId: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.transactionId
                        ? "border-red-500 ring-red-500"
                        : "border-transparent ring-indigo-400"
                    }`}
                  />
                  {formErrors.transactionId && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.transactionId}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.paymentMethod
                        ? "border-red-500 ring-red-500"
                        : "border-transparent ring-indigo-400"
                    }`}
                  >
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Card">Card</option>
                  </select>
                  {formErrors.paymentMethod && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.paymentMethod}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="date"
                    value={form.paymentDate}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setForm({ ...form, paymentDate: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.paymentDate
                        ? "border-red-500 ring-red-500"
                        : "border-transparent ring-indigo-400"
                    }`}
                  />
                  {formErrors.paymentDate && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.paymentDate}
                    </p>
                  )}
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isPaying}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {isPaying ? "Processing..." : "Pay Now"}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-red-300 text-center">No payment details available.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;
