export const formatDateAndSetToIST = (date: Date) => {
  const istDate = date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return istDate;
};
