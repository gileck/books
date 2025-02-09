import { useEffect, useState } from "react";
import { localStorageAPI } from "./app/localStorageAPI";

const { getData, saveData } = localStorageAPI()
const STALE_TIME = 1000 * 60 * 60; // 1 hour
const UPDATE_TIME = 1000 * 60 // 1 minute

const fetchCache = {}
const fetchPromiseCache = {}
const cache = getData('fetchCache') || {};
const getFromCache = (url) => cache[url];
const saveToCache = (url, data) => {
    const dataClone = JSON.parse(JSON.stringify(data));
    if (dataClone?.data?.apiPrice) {
        dataClone.data.apiPrice = null
    }
    cache[url] = dataClone;
    saveData('fetchCache', cache);
}

function getDataFromCache(url, overrideStaleTime) {
    const data = getFromCache(url);
    if (data) {
        const { timestamp, data: dataFromCache } = data;
        const now = new Date().getTime();
        const diff = now - timestamp;
        if (diff < overrideStaleTime || STALE_TIME) {
            return dataFromCache;
        }
    }
    return null;
}

function saveDataToCache(url, data) {
    saveToCache(url, { timestamp: new Date().getTime(), data });
}

function updateCache(url) {
}

function updateCacheInBackground(url) {
    if (fetchCache[url]) {
        return fetchCache[url]
    }
    fetchCache[url] = fetch(url)
        .then((res) => res.json())
        .then((data) => {
            saveDataToCache(url, data);
        }).catch((e) => {
            console.error('Error fetching data', e.message);
        }).finally(() => {
            delete fetchCache[url]
        })
    return fetchCache[url]
}

function shouldFetchInBackground(url) {
    const data = getFromCache(url);
    if (data) {
        const { timestamp } = data;
        const now = new Date().getTime();
        const diff = now - timestamp;
        return diff > UPDATE_TIME;
    }
    return true;
}

export function useFetch(_url, options = {}) {
    // console.log({ options });

    // console.log('useFetch', _url, options);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { url, body, query, method } = getCacheParams(_url, options);
    useEffect(() => {
        // console.log('useEffect', _url);
        setLoading(true);
        fetchWithCache(_url, options)
            .then((data) => {
                setData(data);
            }).catch((e) => {
                console.error('Error fetching data', e.message);
                setError(e);
            }).finally(() => {
                setLoading(false);
            })
    }, [url, body, query, method]);
    return { data, loading, error, setData };
}

async function hashString(str) {
    // Convert the string to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    // Hash the data using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    // Convert ArrayBuffer to Array of bytes
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert bytes to hexadecimal string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function getCacheParams(url, options) {
    const body = options.body ? "_" + JSON.stringify(options.body) : '';
    const query = options.query ? '?' + new URLSearchParams(options.query).toString() : '';
    const method = options.method ? "_" + options.method : '';
    return { url, body, query, method }
}

function getCacheKey(url, options) {
    const { body, query } = getCacheParams(url, options);
    return hashString(url + body + query);
}

export async function fetchWithCache(_url, options) {
    // console.log('fetchWithCache', _url, options);
    const cacheKey = await getCacheKey(_url, options);
    const query = options.query ? '?' + new URLSearchParams(options.query).toString() : '';
    const url = _url + query;
    const shouldUsecache = options.shouldUsecache !== false;

    const overrideStaleTime = options.overrideStaleTime;
    const disableFetchInBackground = options.disableFetchInBackground === true;
    const dataFromCache = shouldUsecache ? getDataFromCache(cacheKey, overrideStaleTime) : null;
    if (dataFromCache) {
        if (!disableFetchInBackground && shouldFetchInBackground(url)) {
            updateCacheInBackground(url)
        }
        return Promise.resolve(dataFromCache)
    }

    // console.log({ url, options });

    fetchPromiseCache[cacheKey] = fetchPromiseCache[cacheKey] || fetch(url, options)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Error fetching data');
            } else {
                return res.json()
            }
        })
        .then((data) => {
            if (options.shouldUsecache !== false) {
                saveDataToCache(cacheKey, data);
            }
            if (options.onSuccess) {
                options.onSuccess(data);
            }
            return data;
        }).finally(() => {
            delete fetchPromiseCache[cacheKey]
        })
    return fetchPromiseCache[cacheKey]
}