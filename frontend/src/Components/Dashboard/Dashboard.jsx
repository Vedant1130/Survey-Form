import React, { useEffect, useState } from "react";
import { FiEye, FiDownload, FiTrash } from "react-icons/fi";
import { getAllSurveys, getSurveyById, deleteSurvey } from "../../api";
import Loader from "../Loader/Loader";
import { useAuth } from "../../context/useAuth";
import { showToast } from "../ToastNotification/ToastNotification";
// import SurveyModal from "../Model/surveyForm";
import { FaTrash } from "react-icons/fa";
import DeleteSurvey from "../Model/deleteSurvey";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSurveyIds, setSelectedSurveyIds] = useState([]);
  const [selectedSurveyDetails, setSelectedSurveyDetails] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const nav = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!isAuthenticated || !user) return;

      setLoading(true);
      const response = await getAllSurveys();

      if (response.success && Array.isArray(response.surveys)) {
        const userSurveys = response.surveys.filter(
          (survey) => survey.createdBy === user._id
        );
        setSurveys(userSurveys);
      } else {
        setError(response.message);
      }

      setLoading(false);
    };

    fetchSurveys();
  }, [isAuthenticated, user]);

  const openModal = async (id) => {
    const response = await getSurveyById(id);
    if (response.success) {
      setSelectedSurvey(response.data);
      setModalIsOpen(true);
    } else {
      showToast(response.message, "error");
    }
  };

  const openDeleteModal = (id) => {
    setSelectedSurveyId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSurveyId) {
      showToast("No survey selected for deletion", "error");
      return;
    }

    try {
      const response = await deleteSurvey(selectedSurveyId);

      if (response.success !== false) {
        showToast("Survey deleted successfully", "success");
        setSurveys((prevSurveys) =>
          prevSurveys.filter((survey) => survey._id !== selectedSurveyId)
        );
        setDeleteModalOpen(false);
        setSelectedSurveyId(null);
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      console.error("Error deleting survey:", error);
      showToast("An error occurred while deleting the survey", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-24 px-6">
      {/* Enlarged Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome, {user.name}!
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Here's an overview of your completed surveys.
        </p>
      </div>

      {/* Completed Surveys Section */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Surveys You Have Filled
        </h2>

        {/* Scrollable Box */}
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="bg-white border shadow-md rounded-lg p-4 max-h-60 overflow-y-auto">
            {Array.isArray(surveys) && surveys.length > 0 ? (
              <ul className="space-y-3">
                {surveys.map((survey) => (
                  <li
                    key={survey._id}
                    className="bg-gray-200 p-3 rounded-lg shadow-sm border flex items-center justify-between hover:shadow-md transition"
                  >
                    {/* Left Section: Survey Details */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800">
                          {survey.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Address: {survey.address}
                        </p>
                      </div>
                    </div>

                    {/* Right Section: Action Buttons */}
                    <div className="flex items-center gap-3 justify-end">
                      <Link to={`/view-form/${survey._id}`}>
                        <button
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="View Survey"
                        >
                          <FiEye size={20} />
                        </button>
                      </Link>
                      <button
                        onClick={() => openDeleteModal(survey._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete Survey"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center">
                You haven't filled any surveys yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {/* <SurveyModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        survey={selectedSurvey}
      /> */}
      <DeleteSurvey
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
