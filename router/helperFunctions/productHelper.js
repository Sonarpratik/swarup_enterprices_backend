
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

module.exports = {

    getProduct,
};
