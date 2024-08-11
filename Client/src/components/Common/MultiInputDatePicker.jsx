import { Label } from "../ProfileManager/AddPost";
import InputBoxProfileManager from "../ProfileManager/InputBoxProfileManager";
import { useState, useEffect } from "react";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function MultiInputDatePicker({ label }) {
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState("January");
    const [year, setYear] = useState(2024);

    return (
        <div className="relative flex w-full flex-col">
            <Label>{label}</Label>
            <div className="flex space-x-4">
                <SelectBox
                    value={day}
                    setValue={setDay}
                    options={Array.from({ length: 31 }, (_, i) => i + 1)}
                />
                <SelectBox value={month} setValue={setMonth} options={months} />
                <SelectBox
                    value={year}
                    setValue={setYear}
                    options={Array.from({ length: 100 }, (_, i) => i + 1900)}
                />
            </div>
        </div>
    );
}

const SelectBox = ({ value, setValue, options }) => {
    useEffect(() => {
        console.log(value);
    }, []);
    return (
        <select
            value={value}
            // onChange={(e) => setValue(e.target.value)}
            className="rounded-md border bg-white p-2"
        >
            {options.map((option) => (
                <option key={option}>{option}</option>
            ))}
        </select>
    );
};
