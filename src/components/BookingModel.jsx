import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const calculatePrice = (startDate, endDate, dailyRate) => {
    if (!startDate || !endDate || !dailyRate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if start is strictly after end
    if (start > end) return 0;

    // Calculate difference in time and convert to days
    const diffTime = end.getTime() - start.getTime();

    // If dates are the same (diffTime is 0), it's 1 day. Otherwise, calculate days and round up.
    let diffDays = 0;
    if (diffTime === 0) {
        diffDays = 1;
    } else {
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    if (diffDays <= 0) return 0;

    return diffDays * parseFloat(dailyRate);
};

const normalizeClosedDates = (closedDates) => {
    if (!closedDates || !closedDates.length) return [];

    let parsed = closedDates;
    while (typeof parsed === "string") {
        try {
            parsed = JSON.parse(parsed);
        } catch {
            break;
        }
    }
    if (Array.isArray(parsed) && typeof parsed[0] === "string") {
        try {
            parsed = JSON.parse(parsed[0]);
        } catch { }
    }
    return Array.isArray(parsed) ? parsed : [];
};


const BookingModal = ({ isOpen, onClose, trailer, translations, onSubmit }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const price = useMemo(() => {
        return calculatePrice(startDate, endDate, trailer?.dailyRate);
    }, [startDate, endDate, trailer?.dailyRate]);

    const dailyRate = trailer?.dailyRate || 0;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    let numberOfDays = 0;
    if (start && end) {
        const diffTime = end.getTime() - start.getTime();
        if (diffTime === 0) {
            numberOfDays = 1;
        } else if (diffTime > 0) {
            numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
    }

    const isDateRangeOverlappingClosedDates = (
        startDate,
        endDate,
        closedDates
    ) => {
        if (!startDate || !endDate) return false;

        const start = new Date(startDate);
        const end = new Date(endDate);

        return closedDates.some((dateStr) => {
            const closed = new Date(dateStr);
            return closed >= start && closed <= end;
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!startDate || !endDate || numberOfDays <= 0 || price <= 0) {
            toast.error(translations.selectValidDates);
            return;
        }
        const closedDates = normalizeClosedDates(trailer?.closedDates);
        const hasConflict = isDateRangeOverlappingClosedDates(
            startDate,
            endDate,
            closedDates
        );

        if (hasConflict) {
            toast.error(
                translations.trailerUnavailable ||
                "Selected dates include unavailable days"
            );
            return;
        }

        onSubmit({
            trailerId: trailer._id,
            startDate,
            endDate,
            price,
        });
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-3xl font-extrabold  mb-6 border-b pb-3">
                    {translations.bookTrailer}
                </h2>
                <p className="text-lg font-medium text-gray-700 mb-6">
                    {trailer?.title}
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="startDate">
                                {translations.startDate}
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="endDate">
                                {translations.endDate}
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || new Date().toISOString().split('T')[0]}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>
                    </div>

                    <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-xl font-bold text-blue-800 mb-3">{translations.totalPrice}</h3>
                        <div className="flex justify-between items-center text-gray-700">
                            <span className="font-semibold">{translations.dailyRate}:</span>
                            <span>${parseFloat(dailyRate).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-700 border-b border-dashed pb-2 mb-2">
                            <span className="font-semibold">{translations.rentalDays}:</span>
                            <span>{numberOfDays}</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
                            <span>{translations.totalCost}:</span>
                            <span>${price.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
                        >
                            {translations.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={price <= 0}
                            className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200 ${price > 0 ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {translations.confirmBooking}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal