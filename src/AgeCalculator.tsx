import React, { useState, useEffect } from "react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
}

interface NextBirthday {
  date: Date;
  daysRemaining: number;
}

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>("");
  const [age, setAge] = useState<AgeResult | null>(null);
  const [nextBirthday, setNextBirthday] = useState<NextBirthday | null>(null);

  // Set today as default target date
  useEffect(() => {
    const today = new Date();
    const formattedDate = formatDateForInput(today);
    setTargetDate(formattedDate);
  }, []);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateAge = (): void => {
    if (!birthDate) {
      alert("Please enter your birth date");
      return;
    }

    const birth = new Date(birthDate);
    const target = targetDate ? new Date(targetDate) : new Date();

    // Validate dates
    if (isNaN(birth.getTime())) {
      alert("Please enter a valid birth date");
      return;
    }

    if (isNaN(target.getTime())) {
      alert("Please enter a valid target date");
      return;
    }

    if (birth > target) {
      alert("Birth date cannot be in the future of the target date");
      return;
    }

    // Calculate age
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    // Adjust for negative days
    if (days < 0) {
      const lastMonthDate = new Date(
        target.getFullYear(),
        target.getMonth(),
        0
      );
      days += lastMonthDate.getDate();
      months--;
    }

    // Adjust for negative months
    if (months < 0) {
      months += 12;
      years--;
    }

    // Calculate total days and months
    const totalDays = Math.floor(
      (target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalMonths = years * 12 + months;

    setAge({
      years,
      months,
      days,
      totalDays,
      totalMonths,
    });

    // Calculate next birthday
    const today = new Date();
    const currentYear = today.getFullYear();
    let nextBirthdayDate = new Date(
      currentYear,
      birth.getMonth(),
      birth.getDate()
    );

    if (nextBirthdayDate < today) {
      nextBirthdayDate = new Date(
        currentYear + 1,
        birth.getMonth(),
        birth.getDate()
      );
    }

    const daysUntilBirthday = Math.ceil(
      (nextBirthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    setNextBirthday({
      date: nextBirthdayDate,
      daysRemaining: daysUntilBirthday,
    });
  };

  const resetCalculator = (): void => {
    setBirthDate("");
    setTargetDate(formatDateForInput(new Date()));
    setAge(null);
    setNextBirthday(null);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">
        Age Calculator
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birth Date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Date (default: today)
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={calculateAge}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Calculate Age
          </button>

          <button
            onClick={resetCalculator}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
          >
            Reset
          </button>
        </div>

        {age && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">
              Age Result
            </h2>
            <p className="text-gray-700">
              <span className="font-bold text-blue-600 text-xl">
                {age.years} years, {age.months} months, {age.days} days
              </span>
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-sm text-gray-500">Total Months</p>
                <p className="font-bold text-lg">{age.totalMonths}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-sm text-gray-500">Total Days</p>
                <p className="font-bold text-lg">
                  {age.totalDays.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {nextBirthday && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-green-800">
              Next Birthday
            </h2>
            <p className="text-gray-700">
              {nextBirthday.date.toDateString()} ({nextBirthday.daysRemaining}{" "}
              days remaining)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;
