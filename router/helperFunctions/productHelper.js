
const getProduct =  (data, products) => {
  try {
  

    const groupedByColor = products.filter((item)=>item.active===true).map(item => ({
        _id: item._id,
        color: item.color
      }));
      
      
      // Transforming main object's color property into an array of objects
      const result = {
        ...data._doc,
        color:groupedByColor
      };
      
    return result;
  } catch (err) {
    return null;
  }
};
const extractNumbers = (range) => {
  // Split the range string based on '-'
  const parts = range.split('-');

  // Extract the numbers from the parts
  let min = 0;
  let max = null;

  // If range is "Over Rs.3000", set min to 3000
  if (parts[0].includes('Over')) {
    min = 3000;
  } else if (parts[0].includes('Under')) {
    // If range is "Under Rs.1000", set max to 1000
    max = 1000;
  } else {
    // Extract the numbers from the range string
    min = parts[0].match(/\d+/) ? parseInt(parts[0].match(/\d+/)[0]) : 0;
    if (parts[1]) {
      max = parseInt(parts[1].match(/\d+/)[0]);
    }
  }

  return { min, max };
};


module.exports = {
  extractNumbers,
    getProduct,
};
