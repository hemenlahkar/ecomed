"use client"
import React, { useState } from "react";
import MedicineCard from "../../components/MedicineCard";

const App = () => {
  const [medicines, setMedicines] = useState([
    // Add enough medicines to test the grid
    ...Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Medicine ${i + 1}`,
      price: Math.floor(Math.random() * 50) + 10,
      discount: Math.random() > 0.5 ? 10 : 0,
      image:
        "https://media.gettyimages.com/id/185061828/photo/vitamin.jpg?s=612x612&w=0&k=20&c=BOilPcMJXNsdHnLdglh_GDtCV9jHbcZfOdG4l1k7g94=",
      addedToCart: false,
    })),
  ]);
  const [cartCount, setCartCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    price: "",
    discount: "0",
    image: "",
  });
  const [errors, setErrors] = useState({});

  const isFormEmpty =
    !newMedicine.name &&
    !newMedicine.price &&
    newMedicine.discount === "0" &&
    !newMedicine.image;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && isFormEmpty) {
      setShowAddForm(false);
    }
  };

  const addToCart = (id) => {
    setMedicines((meds) =>
      meds.map((med) =>
        med.id === id ? { ...med, addedToCart: !med.addedToCart } : med
      )
    );
    setCartCount(
      (prev) => prev + (medicines.find((m) => m.id === id).addedToCart ? -1 : 1)
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newMedicine.name.trim()) newErrors.name = "Name is required";
    if (!newMedicine.price || isNaN(newMedicine.price))
      newErrors.price = "Valid price is required";
    if (isNaN(newMedicine.discount))
      newErrors.discount = "Discount must be a number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const medicine = {
      id: medicines.length + 1,
      name: newMedicine.name,
      price: parseFloat(newMedicine.price),
      discount: parseFloat(newMedicine.discount),
      image: newMedicine.image || "https://via.placeholder.com/300x200",
      addedToCart: false,
    };

    setMedicines([...medicines, medicine]);
    setShowAddForm(false);
    setNewMedicine({ name: "", price: "", discount: "0", image: "" });
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-4">
      <h1 className="text-3xl font-bold text-emerald-800 mb-6 text-center">
        Pharmacy Store
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mx-auto max-w-screen-2xl">
        {medicines.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
            addToCart={addToCart}
          />
        ))}
      </div>

      {showAddForm && (
        <div 
        onClick={handleOverlayClick}
        className="fixed inset-0 bg-gray-800 backdrop-blur-sm flex items-center justify-center p-4"
      >
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">
              Add New Medicine
            </h2>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, name: e.target.value })
                  }
                  className={`w-full p-2 border text-black rounded ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMedicine.price}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, price: e.target.value })
                    }
                    className={`w-full p-2 border text-black rounded ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={newMedicine.discount}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        discount: e.target.value,
                      })
                    }
                    className={`w-full p-2 border text-black rounded ${
                      errors.discount ? "border-red-500" : "border-gray-300"
                    }`}
                    min="0"
                    max="100"
                  />
                  {errors.discount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.discount}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newMedicine.image}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, image: e.target.value })
                  }
                  className="w-full p-2 border text-black border-gray-300 rounded"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Add Medicine
                </button>
              </div>
            </form>

            {!isFormEmpty && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Click outside to cancel (only when form is empty)
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-8 right-8 bg-emerald-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center text-2xl"
      >
        +
      </button>

      {/* ... existing cart counter ... */}
    </div>
  );
};

export default App;
