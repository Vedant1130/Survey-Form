import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const options = ["G-35 Soaps"];

const ComparisonTable = () => {
  const location = useLocation();
  const { selectedSurveyIds, survey } = location.state || {};
  const [selected, setSelected] = useState([]);
  const [updatedSurvey, setUpdatedSurvey] = useState(survey);

  if (!selectedSurveyIds || !survey) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <p className="text-gray-500 text-lg text-center">
          No survey data available.
        </p>
      </div>
    );
  }

  const toggleCheckbox = (option) => {
    setSelected((prev) => {
      const newSelected = prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option];

      const newSurvey = survey.map((s) => ({
        ...s,
        products: s.products.map((product) => {
          if (product.productName === "Soap") {
            return {
              ...product,
              mrp: newSelected.includes(option) ? 54 : product.mrp,
              dp: newSelected.includes(option) ? 39 : product.dp,
            };
          }
          return product;
        }),
      }));

      setUpdatedSurvey(newSurvey);
      return newSelected;
    });
  };

  let grandTotalPrice = 0;
  let grandTotalMRP = 0;
  let grandTotalDP = 0;

  updatedSurvey.forEach((s) => {
    s.products.forEach((product) => {
      grandTotalPrice += product.price * product.quantity;
      grandTotalMRP += product.mrp * product.quantity;
      grandTotalDP += product.dp * product.quantity;
    });
  });

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start w-full min-h-screen p-4 md:p-8 space-y-6 lg:space-y-0 lg:space-x-6">
      {/* Table Section */}
      <div className="w-full lg:w-3/5 overflow-x-auto">
        <div className="rounded-lg p-4 md:p-6 mt-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            🛍️ Compare Surveys
          </h2>
          <div className="rounded-lg overflow-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200 text-xs md:text-sm lg:text-base">
                <tr>
                  <th className="border border-gray-300 px-2 md:px-4 py-2 text-left">
                    Product
                  </th>
                  <th className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                    Quantity
                  </th>
                  <th className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                    Price
                  </th>
                  <th className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                    MRP
                  </th>
                  <th className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                    DP
                  </th>
                </tr>
              </thead>
              <tbody>
                {updatedSurvey.length > 0 ? (
                  updatedSurvey.map((s, surveyIndex) =>
                    s.products.map((product, index) => (
                      <tr
                        key={`${surveyIndex}-${index}`}
                        className={`border border-gray-300 hover:bg-gray-100 transition-all ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="border border-gray-300 px-2 py-2 text-left text-xs md:text-sm">
                          {product.productName}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs md:text-sm">
                          {product.quantity}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs md:text-sm">
                          ₹{product.price * product.quantity}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs md:text-sm">
                          ₹{product.mrp * product.quantity}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs md:text-sm">
                          ₹{product.dp * product.quantity}
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-gray-500 text-center">
                      No products listed.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="w-full lg:w-2/5 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <p className="text-base font-medium">
          Grand Total Price: ₹{grandTotalPrice}
        </p>
        <p className="text-base font-medium">
          Grand Total MRP: ₹{grandTotalMRP}
        </p>
        <p className="text-base font-medium">Grand Total DP: ₹{grandTotalDP}</p>
        <hr className="my-4" />
        <p className="text-lg font-bold text-red-600">
          Savings (MRP - Total Price): ₹{grandTotalMRP - grandTotalPrice}
        </p>
        <p className="text-lg font-bold text-red-600">
          Savings (DP - Total Price): ₹{grandTotalDP - grandTotalPrice}
        </p>
        <div className="mt-4 p-3 bg-gray-200 rounded-md">
          <h4 className="text-lg font-semibold mb-2">Filters</h4>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition ${
                  selected.includes(option) ? "bg-gray-300" : "bg-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleCheckbox(option)}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 flex items-center justify-center border rounded ${
                    selected.includes(option)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-500"
                  }`}
                >
                  {selected.includes(option) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
