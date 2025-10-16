import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name)=>{
    if(!name) return "";

    const words = name.split(" ");
    let initials ="";

    for (let i =0 ;i<Math.min(words.length,2);i++){
        initials+=words[i][0];
    }
    return initials.toUpperCase(); 
};

export const addThousandsSeparator=(num)=>{
    if (num == null || isNaN(num)) return "";
    const [integerPart, fractionalPart]= num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3}) + (?!\d))/g,",");

    return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
}

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }));
  return chartData;
};



export const prepareIncomeBarChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  const monthlyData = {};

  data.forEach((item) => {
    if (!item.date || !item.amount) return;

    const month = moment(item.date).format("MMM"); // e.g., "Oct"
    monthlyData[month] = (monthlyData[month] || 0) + Number(item.amount);
  });

  // Return data with keys matching your CustomBarChart
  return Object.keys(monthlyData).map((month) => ({
    month,           // X-axis key matches CustomBarChart
    amount: monthlyData[month], // Y-axis key matches CustomBarChart
  }));
};

export const prepareExpenseLineChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  const monthlyData = {};

  data.forEach((item) => {
    if (!item.date || !item.amount) return;

    const month = moment(item.date).format("MMM"); // e.g., "Oct"
    monthlyData[month] = (monthlyData[month] || 0) + Number(item.amount);
  });

  // Convert object to array suitable for chart
  return Object.keys(monthlyData).map((month) => ({
    month,                     // X-axis label
    amount: monthlyData[month], // Y-axis value
  }));
};
