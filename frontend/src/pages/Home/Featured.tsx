import { useState } from "react";

interface Book {
  title: string;
  description: string;
  year: string;
  author: string;
  coverImage: string;
}

const books: Book[] = [
  {
    title:
      "Variety Guide to the Silver and Copper Coinage of the Mexico City Mint 1732-1771",
    description:
      "Comprehensive guide to the history and varieties of all denominations of pillar-type Spanish Colonial coins from the Mexico City Mint",
    year: "2021",
    author: "Brad Yonaka",
    coverImage:
      "https://i.etsystatic.com/28351339/r/il/257044/3284464904/il_fullxfull.3284464904_s5o4.jpg",
  },
];

export const Featured = () => {
  const [currentBook, setCurrentBook] = useState(books[0]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Featured Book</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <img
            src={currentBook.coverImage}
            alt={currentBook.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">{currentBook.title}</h3>
            <p className="text-gray-600 mb-2">{currentBook.description}</p>
            <p className="text-gray-500 mb-2">
              {currentBook.year} - {currentBook.author}
            </p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
