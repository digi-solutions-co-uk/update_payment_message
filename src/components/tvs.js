import { useEffect, useState } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue, update, get } from "firebase/database";
import { useParams } from "react-router-dom";

const TVs = () => {
    const { id } = useParams();
    const [filteredTvs, setFilteredTvs] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(id)
    useEffect(() => {
        const fetchTVsByStoreId = async () => {
            try {
                const tvRef = ref(database, `tvs`);
                const snapshot = await get(tvRef);
                if (snapshot.exists()) {
                    const allTVs = snapshot.val();
                    const filteredTVs = Object.entries(allTVs)
                        .filter(([key, tv]) => tv.storeId == id)
                        .map(([key, tv]) => ({ ...tv }));

                    console.log('Filtered TVs:', filteredTVs);
                    setLoading(false)
                    setFilteredTvs(filteredTVs);
                    return filteredTVs
                } else {
                    setFilteredTvs([]);
                }
            } catch (error) {
                console.error('Error fetching TVs:', error);
            }
        };
        fetchTVsByStoreId()
        // setFilteredTvs(tvs);

    }, [id]);

    const handleRestart = async (tvId) => {
        try {
            await update(ref(database, `tvs/${tvId}/commands`), {
                restart: true,
            });
        } catch (error) {
            console.error("Error sending restart command:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h1 className="text-2xl font-bold text-center mb-6">TV Control</h1>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : Object.entries(filteredTvs).length === 0 ? (
                    <p className="text-center text-red-500">TV with ID <strong>{id}</strong> not found.</p>
                ) : (
                    filteredTvs.map((tv, index) => (
                        <div
                            key={tv.id || index}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition-all mb-6"
                        >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-semibold text-gray-800">{tv.name || tv.id || `TV #${index + 1}`}</h2>
                                <p className="text-gray-600">
                                    Status: <strong className={tv.restart ? "text-yellow-600" : "text-green-600"}>
                                        {tv?.commands?.restart ? "Restarting..." : "Idle"}
                                    </strong>
                                </p>
                            </div>

                            <button
                                onClick={() => handleRestart(tv.id)}
                                disabled={tv?.commands?.restart}
                                className={`mt-4 w-full py-2 rounded-lg text-white text-lg font-medium transition-all ${tv.restart
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {tv?.commands?.restart ? "Restarting..." : "Restart"}
                            </button>
                        </div>
                    ))

                )}
            </div>
        </div>
    );
};

export default TVs;
