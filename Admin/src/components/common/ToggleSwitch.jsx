export default function ToggleSwitch({ checker, onClick, disabled = false }) {
    return (
        <label className="me-5 inline-flex cursor-pointer items-center">
            <input
                title="something"
                type="checkbox"
                value="something"
                className="peer sr-only"
                checked={checker}
                onClick={onClick}
                disabled={disabled}
            />
            <div className="peer relative h-7 w-12 rounded-full border border-[#c4c4c4] bg-white after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-primary after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-white rtl:peer-checked:after:-translate-x-full"></div>
        </label>
    );
}
