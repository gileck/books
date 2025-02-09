import { useEffect } from "react";

export default function Logout() {
    useEffect(() => {
        fetch('/api/logout').
            then((res) => {
                if (res.ok) {
                    window.location = '/login';
                }
            });
    })
    return (
        <div>
        </div>
    );
}
// Compare this snippet from src/pages/login.js: