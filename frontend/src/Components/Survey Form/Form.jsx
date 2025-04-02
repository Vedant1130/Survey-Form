import { useFormik } from "formik";
import React from "react";
import { formSchema } from "../../Schema";
import { submitSurvey } from "../../api";
import { showToast } from "../ToastNotification/ToastNotification";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Form = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      address: "",
      familyMembers: "",
      products: [
        { productName: "Soap", brand: "", quantity: "", price: "" },
        { productName: "Shampoo", brand: "", quantity: "", price: "" },
        { productName: "Toothpaste", brand: "", quantity: "", price: "" },
        { productName: "Hair Oil", brand: "", quantity: "", price: "" },
        { productName: "Facewash", brand: "", quantity: "", price: "" },
        { productName: "Fairness Cream", brand: "", quantity: "", price: "" },
        { productName: "Lotion", brand: "", quantity: "", price: "" },
        { productName: "Toilet Cleaner", brand: "", quantity: "", price: "" },
        { productName: "Floor Cleaner", brand: "", quantity: "", price: "" },
        { productName: "Laundry Liquid", brand: "", quantity: "", price: "" },
        { productName: "Dishwash Bar", brand: "", quantity: "", price: "" },
        { productName: "Dishwash Liquid", brand: "", quantity: "", price: "" },
        { productName: "Handwash", brand: "", quantity: "", price: "" },
        { productName: "Green Tea", brand: "", quantity: "", price: "" },
      ],
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      const response = await submitSurvey(values);
      if (response.success) {
        showToast("Survey submitted successfully! 🎉", "success");
        navigate("/");
      } else {
        showToast(response.message || "Survey submission failed ❌", "error");
      }
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center px-4  sm:px-8 md:px-20 py-8">
      <div className="bg-white p-8 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 mt-4">
          📝 Take a Quick Survey
        </h2>
        <form onSubmit={formik.handleSubmit}>
          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="border p-3 rounded-lg w-full"
              type="text"
              name="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.touched.name && formik.errors.name && (
              <span className="text-red-500">{formik.errors.name}</span>
            )}
            <input
              className="border p-3 rounded-lg w-full"
              type="text"
              name="mobile"
              placeholder="Mobile No"
              value={formik.values.mobile}
              onChange={formik.handleChange}
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <span className="text-red-500">{formik.errors.mobile}</span>
            )}

            <input
              className="border p-3 rounded-lg w-full sm:col-span-2"
              type="text"
              name="address"
              placeholder="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
            />
            {formik.touched.address && formik.errors.address && (
              <span className="text-red-500">{formik.errors.address}</span>
            )}
            <input
              className="border p-3 rounded-lg w-full sm:col-span-2"
              type="number"
              name="familyMembers"
              placeholder="Family Members"
              value={formik.values.familyMembers}
              onChange={formik.handleChange}
            />
            {formik.touched.familyMembers && formik.errors.familyMembers && (
              <span className="text-red-500">
                {formik.errors.familyMembers}
              </span>
            )}
          </div>

          {/* Product Survey */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              🛍️ Products Used
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg text-left">
                <thead className="bg-gray-200 text-center">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {formik.values.products.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{product.productName}</td>
                      <td className="p-3">
                        <input
                          className="border p-2 rounded w-full"
                          type="text"
                          name={`products[${index}].brand`}
                          value={formik.values.products[index].brand}
                          onChange={formik.handleChange}
                        />
                        {formik.touched.products?.[index]?.brand &&
                          formik.errors.products?.[index]?.brand && (
                            <span className="text-red-500">
                              {formik.errors.products[index].brand}
                            </span>
                          )}
                      </td>
                      <td className="p-3">
                        <input
                          className="border p-2 rounded w-full"
                          type="number"
                          name={`products[${index}].quantity`}
                          min="0"
                          value={formik.values.products[index].quantity}
                          onChange={formik.handleChange}
                        />
                        {formik.touched.products?.[index]?.quantity &&
                          formik.errors.products?.[index]?.quantity && (
                            <span className="text-red-500">
                              {formik.errors.products[index].quantity}
                            </span>
                          )}
                      </td>
                      <td className="p-3">
                        <input
                          className="border p-2 rounded w-full"
                          type="number"
                          name={`products[${index}].price`}
                          min="0"
                          value={formik.values.products[index].price}
                          onChange={formik.handleChange}
                        />
                        {formik.touched.products?.[index]?.price &&
                          formik.errors.products?.[index]?.price && (
                            <span className="text-red-500">
                              {formik.errors.products[index].price}
                            </span>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-purple text-white py-3 px-6 rounded-lg text-lg"
            >
              Submit Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
