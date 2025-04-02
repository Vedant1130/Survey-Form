import { Link, useParams } from "react-router-dom";
import { getSurveyById } from "../../api";
import { useEffect, useState } from "react";
import ComparisonTable from "./ComparisonTable";

const ViewForm = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        const response = await getSurveyById(surveyId);

        if (response?.success && response?.data) {
          setSurvey(response.data);
        } else {
          console.error("Survey not found or API error:", response);
          setError("Survey not found!");
        }
      } catch (err) {
        console.error("Error fetching survey details:", err);
        setError("Something went wrong! Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) {
      fetchSurveyDetails();
    } else {
      setError("Invalid survey ID!");
      setLoading(false);
    }
  }, [surveyId]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 max-w-3xl w-full">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800 mb-4">
          📝 Survey Details
        </h2>

        {/* User Details */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm sm:text-base">
          <p className="border p-3 rounded-md">
            <strong>Name:</strong>
             {survey.name}
          </p>
          <p className="border p-3 rounded-md">
            <strong>Mobile:</strong>
            {survey.mobile}
          </p>
          <p className="border p-3 rounded-md sm:col-span-2">
            <strong>Address:</strong>
            {survey.address}
          </p>
          <p className="border p-3 rounded-md sm:col-span-2">
            <strong>Family Members:</strong>
            {survey.familyMembers}
          </p>
        </div>

        {/* Product Survey */}
        <div className="mt-6">
          <h3 className="text-md sm:text-lg font-semibold text-gray-700 mb-3">
            🛍️ Products Used
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border text-center rounded-md text-xs sm:text-sm">
              <thead className="bg-gray-200 border-b border-gray-400">
                <tr>
                  <th className="p-2 border-r border-gray-400">Product</th>
                  <th className="p-2 border-r border-gray-400">Brand</th>
                  <th className="p-2 border-r border-gray-400">Qty</th>
                  <th className="p-2 border-r border-gray-400">Price</th>
                  <th className="p-2 border-r border-gray-400">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {survey.products && survey.products.length > 0 ? (
                  survey.products.map((product, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300">
                        {product.productName}
                      </td>
                      <td className="p-2 border-r border-gray-300">
                        {product.brand}
                      </td>
                      <td className="p-2 border-r">{product.quantity}</td>
                      <td className="p-2 border-r">{product.price}</td>
                      <td className="p-2 border-r">
                        ₹{product.price * product.quantity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-2 text-gray-500 text-center">
                      No products listed
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compare Button */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/compare-table"
            state={{ selectedSurveyIds: [surveyId], survey: [survey] }}
          >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
              Compare Survey
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
