import getConfig from "next/config";

export function localStorageAPI() {

    if (typeof window === 'undefined') return {
        getData: () => { },
        saveData: () => { },
        cleanData: () => { },
        getConfig: () => { },
        saveConfig: () => { },
    }

    const getConfigObject = () => JSON.parse(localStorage.getItem('config') || "{}");

    return {
        getConfig: (key) => {
            const config = getConfigObject()
            return config[key];
        },
        saveConfig: (key, value) => {
            const config = getConfigObject()
            localStorage.setItem('config', JSON.stringify({ ...config, [key]: value }));

        },
        getData: (key) => {
            try {
                return JSON.parse(localStorage.getItem(key) || null);
            } catch (e) {
                console.log('Error getting data from local storage: ' + key, e.message);
                return null;
            }

        },
        saveData: (key, data) => {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.log('Error saving data to local storage: ' + key, e.message);
            }


        },
        cleanData: (key) => {
            localStorage.removeItem(key);
            console.log('cleaned');
        }
    };
}
