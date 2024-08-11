import React from "react";
import { Label } from "../ProfileManager/AddPost";
export default function TimeRangePicker({ label }) {
    return (
        <div className="flex flex-col space-y-2">
            <Label>{label}</Label>
            <div className="flex space-x-4">
                <Label>From:</Label>
                <input type="time" className="input-box" />
                <Label>To:</Label>
                <input type="time" className="input-box" />
            </div>
        </div>
    );
}
