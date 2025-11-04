import { database, dbStore } from "../firebaseConfig";
import { ref, set } from "firebase/database";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

export const addClientDataForParing = async (id, tvData) => {
    try {
        // Set the new TV object in the `pairing` collection with serial number as the key
        await set(ref(database, `pairing/${id}`), tvData);
        // await set(ref(digiDatabase, `pairing/${id}`), tvData);

        console.log(`TV added successfully with ID`);
        return tvData;
    } catch (error) {
        console.error("Error adding TV:", error);
        throw error;
    }
};

export const getCustomPaymentPlan = async (store_id) => {
    try {
        const docRef = doc(dbStore, "customPlans", store_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const item = { ...docSnap.data(), id: store_id };
            // console.log("Fetched document:", item);
            return item; // wrap in array
        } else {
            // console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        throw error;
    }
};

export const setCustomPaymentPlan = async (store_id, amount) => {
    try {
        const docRef = doc(dbStore, "customPlans", store_id);
        await setDoc(docRef, { amountPerWeek: amount }, { merge: true });
        console.log(`Custom plan set successfully for store ${store_id}`);
        return { store_id, amount };
    } catch (error) {
        console.error("Error setting custom plan:", error);
        throw error;
    }
};

export const getAllCustomPaymentPlans = async () => {
    try {
        // Query the customPlans collection
        const plansRef = collection(dbStore, "customPlans");
        const snapshot = await getDocs(plansRef);
        
        const plans = {};
        snapshot.forEach((doc) => {
            plans[doc.id] = { ...doc.data(), id: doc.id };
        });
        
        return plans;
    } catch (error) {
        console.error("Error fetching all custom plans:", error);
        throw error;
    }
};

