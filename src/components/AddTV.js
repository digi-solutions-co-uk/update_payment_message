import { useState } from "react";
import { addClientDataForParing } from "../utils/firebaseUtils";

const AddTV = () => {
    const [storeId, setStoreId] = useState("");
    const [tvId, setTvId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate TV ID (should be not less than 5 strings)
        if (tvId.trim().length < 5) {
            setMessage("TV ID must be at least 5 characters long");
            return;
        }

        if (!storeId.trim()) {
            setMessage("Store ID is required");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const tvData = {
                storeId: storeId.trim(),
                name: `DMB-${tvId.trim()}`,
                slides_updated_at: Date.now(),
                lastActive: Date.now()
            };

            await addClientDataForParing(tvId.trim(), tvData);
            setMessage("TV added successfully!");
            setStoreId("");
            setTvId("");
        } catch (error) {
            console.error("Error adding TV:", error);
            setMessage("Error adding TV. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-2">
                        Store ID
                    </label>
                    <input
                        id="storeId"
                        type="text"
                        value={storeId}
                        onChange={(e) => setStoreId(e.target.value)}
                        placeholder="Enter Store ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="tvId" className="block text-sm font-medium text-gray-700 mb-2">
                        TV ID (minimum 5 characters)
                    </label>
                    <input
                        id="tvId"
                        type="text"
                        value={tvId}
                        onChange={(e) => {
                            setTvId(e.target.value);
                            setMessage("");
                        }}
                        placeholder="Enter TV ID (min 5 characters)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        required
                        minLength={5}
                    />
                    {tvId.length > 0 && tvId.length < 5 && (
                        <p className="text-red-500 text-sm mt-1">
                            TV ID must be at least 5 characters ({tvId.length}/5)
                        </p>
                    )}
                </div>

                {message && (
                    <div className={`p-3 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || tvId.trim().length < 5}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "Adding..." : "Add TV"}
                </button>
            </form>
        </div>
    );
};

export default AddTV;

