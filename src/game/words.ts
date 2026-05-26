export interface WordPack {
  category: string;
  words: string[];
}

export const WORD_PACKS: WordPack[] = [
  {
    category: 'Animals',
    words: ['Dog', 'Cat', 'Cow', 'Elephant', 'Tiger', 'Lion', 'Monkey', 'Horse', 'Rabbit', 'Snake']
  },
  {
    category: 'Fruits',
    words: ['Apple', 'Banana', 'Mango', 'Grapes', 'Watermelon', 'Pineapple', 'Strawberry', 'Orange', 'Papaya', 'Guava']
  },
  {
    category: 'Vegetables',
    words: ['Potato', 'Tomato', 'Onion', 'Carrot', 'Garlic', 'Ginger', 'Cabbage', 'Beans', 'Chili', 'Brinjal']
  },
  {
    category: 'Food',
    words: ['Pizza', 'Dosa', 'Biryani', 'Burger', 'Pasta', 'Noodles', 'Sandwich', 'Idli', 'Cake', 'Ice cream']
  },
  {
    category: 'Drinks',
    words: ['Coffee', 'Tea', 'Milk', 'Water', 'Juice', 'Lassi', 'Coke', 'Beer', 'Wine', 'Smoothie']
  },
  {
    category: 'Places',
    words: ['Paris', 'Tokyo', 'Mumbai', 'Chennai', 'Goa', 'Dubai', 'New York', 'London', 'Bangkok', 'Singapore']
  },
  {
    category: 'Sports',
    words: ['Cricket', 'Football', 'Tennis', 'Swimming', 'Basketball', 'Badminton', 'Hockey', 'Boxing', 'Cycling', 'Running']
  },
  {
    category: 'Movies',
    words: ['Titanic', 'Avatar', 'Avengers', 'Inception', 'Jurassic Park', 'Frozen', 'Joker', 'Interstellar', 'Lion King', 'Iron Man']
  },
  {
    category: 'Kollywood movies',
    words: ['Vikram', 'Jailer', 'Master', 'Kaithi', 'Asuran', '96', 'Vada Chennai', 'Sarpatta Parambarai', 'Karnan', 'Petta']
  },
  {
    category: 'Jobs',
    words: ['Doctor', 'Teacher', 'Police', 'Driver', 'Cook', 'Singer', 'Engineer', 'Pilot', 'Farmer', 'Actor']
  },
  {
    category: 'Body parts',
    words: ['Hand', 'Eye', 'Ear', 'Nose', 'Hair', 'Mouth', 'Leg', 'Foot', 'Finger', 'Tooth']
  },
  {
    category: 'Colors',
    words: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Black', 'White', 'Orange', 'Brown']
  },
  {
    category: 'Household',
    words: ['Bed', 'Chair', 'Table', 'Pillow', 'Mirror', 'Fan', 'Lamp', 'Sofa', 'Blanket', 'Curtain']
  },
  {
    category: 'Clothes',
    words: ['Shirt', 'Pants', 'Saree', 'Dress', 'Shoes', 'Socks', 'Hat', 'Belt', 'Jacket', 'Watch']
  }
];

export function pickRandomWord(): { category: string; word: string } {
  const pack = WORD_PACKS[Math.floor(Math.random() * WORD_PACKS.length)];
  const word = pack.words[Math.floor(Math.random() * pack.words.length)];
  return { category: pack.category, word };
}
