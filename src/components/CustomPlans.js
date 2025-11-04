import { useEffect, useState } from "react";
import { getAllCustomPaymentPlans, setCustomPaymentPlan } from "../utils/firebaseUtils";

const CustomPlans = () => {
    const [plans, setPlans] = useState({});
    const [filteredPlans, setFilteredPlans] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [storeId, setStoreId] = useState("");
    const [amount, setAmount] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const allPlans = await getAllCustomPaymentPlans();
            setPlans(allPlans);
            setFilteredPlans(allPlans);
        } catch (error) {
            console.error("Error fetching plans:", error);
            setMessage("Error fetching plans. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredPlans(plans);
        } else {
            const filtered = Object.entries(plans).filter(([key, plan]) =>
                key.toLowerCase().includes(query.toLowerCase()) ||
                (plan.amountPerWeek && plan.amountPerWeek.toString().toLowerCase().includes(query.toLowerCase()))
            );
            setFilteredPlans(Object.fromEntries(filtered));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!storeId.trim()) {
            setMessage("Store ID is required");
            return;
        }

        if (!amount.trim()) {
            setMessage("Amount is required");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            await setCustomPaymentPlan(storeId.trim(), amount.trim());
            setMessage("Custom plan saved successfully!");
            setStoreId("");
            setAmount("");
            setEditingId(null);
            await fetchPlans();
        } catch (error) {
            console.error("Error saving plan:", error);
            setMessage("Error saving plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (planId, planData) => {
        setEditingId(planId);
        setStoreId(planId);
        setAmount(planData.amountPerWeek || "");
        setMessage("");
    };

    const handleCancel = () => {
        setEditingId(null);
        setStoreId("");
        setAmount("");
        setMessage("");
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by Store ID or Amount..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                />
            </div>

            <div className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">
                    {editingId ? `Edit Plan: ${editingId}` : "Add New Custom Plan"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="planStoreId" className="block text-sm font-medium text-gray-700 mb-2">
                            Store ID {editingId && "(cannot be changed)"}
                        </label>
                        <input
                            id="planStoreId"
                            type="text"
                            value={storeId}
                            onChange={(e) => setStoreId(e.target.value)}
                            placeholder="Enter Store ID"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                            required
                            disabled={!!editingId}
                        />
                    </div>

                    <div>
                        <label htmlFor="planAmount" className="block text-sm font-medium text-gray-700 mb-2">
                            Amount (string)
                        </label>
                        <input
                            id="planAmount"
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {message}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : editingId ? "Update" : "Add"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {loading && Object.keys(plans).length === 0 ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold mb-4">Existing Custom Plans</h3>
                    {Object.keys(filteredPlans).length === 0 ? (
                        <p className="text-center text-gray-500">No custom plans found</p>
                    ) : (
                        <div className="container">
                            {Object.entries(filteredPlans).map(([key, plan]) => (
                                <div className="item" key={key}>
                                    <div className="flex-1 flex flex-col">
                                        <span className="title2 block mb-1 text-left">Store ID: {key}</span>
                                        <br />
                                        <span className="text-gray-600 text-left">Amount: {plan.amountPerWeek || "N/A"}</span>
                                    </div>
                                    <button
                                        onClick={() => handleEdit(key, plan)}
                                        className="px-1.5 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs whitespace-nowrap flex-shrink-0"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomPlans;

