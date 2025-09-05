// utils/salaryUtils.js
import Attendance from "../Models/Attendance.js";

export async function calculateMonthlySalary(userId, month, year, dailySalary) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const records = await Attendance.find({
    user: userId,
    date: { $gte: start, $lte: end }
  });

  let fullDays = 0, halfDays = 0, absents = 0;

  records.forEach((rec) => {
    if (rec.status === "full-day") fullDays++;
    else if (rec.status === "half-day") halfDays++;
    else absents++;
  });

  const salary = fullDays * dailySalary + halfDays * (dailySalary / 2);

  return { fullDays, halfDays, absents, salary };
}
