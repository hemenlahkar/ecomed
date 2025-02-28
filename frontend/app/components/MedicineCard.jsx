import React from 'react';

const MedicineCard = ({ medicine, addToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg h-[40vh] min-h-[300px] max-h-[400px] flex flex-col">
      <div className="relative flex-1 max-h-[60%]">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-full object-cover"
        />
        {medicine.discount > 0 && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs">
            {medicine.discount}% OFF
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col justify-between h-[40%]">
        <div>
          <h3 className="text-base font-semibold text-emerald-800 mb-2">
            {medicine.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-emerald-600">
              ₹{(medicine.price * (1 - medicine.discount/100)).toFixed(2)}
            </span>
            {medicine.discount > 0 && (
              <span className="text-gray-500 line-through text-sm">
                ₹{medicine.price}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => addToCart(medicine.id)}
          className={`w-full py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
            medicine.addedToCart
              ? 'bg-emerald-800 text-white'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          {medicine.addedToCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;