const MediumModal = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-96">
      <h2 className=" text-sm font-bold mb-4">Writing on BlogSpot</h2>
      <ul className="space-y-4">
        <li className="text-gray-800">New writer FAQ</li>
        <li className="text-gray-800">Expert writing advice</li>
        <li className="text-gray-800">Grow your readership</li>
      </ul>
      <button className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Start writing
      </button>
    </div>
  );
};

export default MediumModal;
