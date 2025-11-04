import { useState } from "react";
import PaymentWarnings from "./PaymentWarnings";
import AddTV from "./AddTV";
import CustomPlans from "./CustomPlans";

const Home = () => {
    const [activeTab, setActiveTab] = useState("payment-warnings");

    const tabs = [
        { id: "payment-warnings", label: "Payment Warnings" },
        { id: "add-tv", label: "Add TV" },
        { id: "custom-plans", label: "Custom Plans" }
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans">
            <div className="bg-white border border-gray-300 rounded-xl shadow-sm">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-300">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                                activeTab === tab.id
                                    ? "bg-blue-500 text-white border-b-2 border-blue-500"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === "payment-warnings" && <PaymentWarnings />}
                    {activeTab === "add-tv" && <AddTV />}
                    {activeTab === "custom-plans" && <CustomPlans />}
                </div>
            </div>
        </div>
    );
};

export default Home;
