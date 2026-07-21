import { useEffect, useState } from "react";
import { getAuth } from "../utils/auth";
import "../assets/css/components/sessionTimer.css";
// import { HiOutlineClock } from "react-icons/hi2";
import { FaRegClock } from "react-icons/fa";

export default function SessionTimer() {
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        const auth = getAuth();

        if (!auth?.token) return;

        try {
            const payload = JSON.parse(atob(auth.token.split(".")[1]));

            const expiry = payload.exp * 1000;

            const timer = setInterval(() => {
                const remaining = Math.max(
                    0,
                    Math.floor((expiry - Date.now()) / 1000)
                );

                setSecondsLeft(remaining);

                if (remaining <= 0) {
                    clearInterval(timer);
                }
            }, 1000);

            return () => clearInterval(timer);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    const format = (v) => String(v).padStart(2, "0");

    let timerClass = "timer-green";

    if (secondsLeft <= 300) {
        timerClass = "timer-orange";
    }

    if (secondsLeft <= 60) {
        timerClass = "timer-red";
    }

    return (
        <div className={`session-timer ${timerClass}`}>
            {/* ⏳ {format(hours)}:{format(minutes)}:{format(seconds)} */}
            <FaRegClock />
            <span>
                {format(hours)}:{format(minutes)}:{format(seconds)}
            </span>
        </div>
    );
}