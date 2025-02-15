import React, { useState, useEffect, createContext } from 'react';
import { localStorageAPI } from './localStorageAPI';
import { AppContext } from './AppContext';
import { useFetch } from '../useFetch';
import { useBookmarks } from './hooks/useBookmarks';

function useQuestionBox() {
    const [isQuestionBoxOpen, setIsQuestionBoxOpen] = useState(false)
    const [questionBoxMessage, setQuestionBoxMessage] = useState('')
    const [questionBoxCallback, setQuestionBoxCallback] = useState(null)

    return {
        isQuestionBoxOpen,
        questionBoxMessage,
        setIsQuestionBoxOpen,
        openQuestionBox: (message, cb) => {

            setQuestionBoxMessage(message)
            setIsQuestionBoxOpen(true)
            setQuestionBoxCallback({ cb })
        },
        onQuestionBoxAnswer: (answer) => {
            if (questionBoxCallback?.cb) {
                questionBoxCallback.cb(answer)
            }
            setIsQuestionBoxOpen(false)
        }
    }
}
function useAlert() {
    const [isAlertOpen, setIsAlertOpen] = React.useState(false)
    const [isErrorAlertOpen, setIsErrorAlertOpen] = React.useState(false)

    const [alertMessage, setAlertMessage] = React.useState('')
    return {
        isAlertOpen,
        setIsAlertOpen,
        alertMessage,
        setAlertMessage,
        isErrorAlertOpen,
        setIsErrorAlertOpen
    }
}

export function AppProvider({ children, setRoute, params, user }) {
    const alert = useAlert();
    const questionBox = useQuestionBox();
    const bookmarks = useBookmarks();

    const contextValue = {
        params,
        setRoute,
        questionBox,
        setIsAlertOpen: alert.setIsAlertOpen,
        openAlert: (message) => {
            alert.setAlertMessage(message);
            alert.setIsAlertOpen(true);
        },
        openErrorAlert: (message) => {
            alert.setAlertMessage(message);
            alert.setIsErrorAlertOpen(true);
        },
        isErrorAlertOpen: alert.isErrorAlertOpen,
        closeAlert: () => {
            alert.setIsAlertOpen(false);
            alert.setIsErrorAlertOpen(false);
        },
        bookmarks
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}