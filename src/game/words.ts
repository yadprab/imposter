export interface WordPack {
  category: string;
  words: string[];
}

export const WORD_PACKS: WordPack[] = [
  {
    category: 'Animals',
    words: ['Elephant', 'Penguin', 'Octopus', 'Kangaroo', 'Giraffe', 'Dolphin', 'Tiger', 'Koala', 'Crocodile', 'Hedgehog']
  },
  {
    category: 'Food',
    words: ['Pizza', 'Sushi', 'Biryani', 'Ramen', 'Tacos', 'Pancakes', 'Dosa', 'Burger', 'Pasta', 'Ice cream']
  },
  {
    category: 'Movies',
    words: ['Inception', 'Titanic', 'Avengers', 'Interstellar', 'Joker', 'Frozen', 'Avatar', 'Gladiator', 'Parasite', 'Up']
  },
  {
    category: 'Kollywood movies',
    words: ['Vikram', 'Jailer', 'Master', 'Kaithi', 'Asuran', '96', 'Vada Chennai', 'Sarpatta Parambarai', 'Karnan', 'Petta']
  },
  {
    category: 'Places',
    words: ['Paris', 'Tokyo', 'New York', 'Goa', 'Dubai', 'Iceland', 'Bali', 'London', 'Venice', 'Singapore']
  },
  {
    category: 'Sports',
    words: ['Cricket', 'Football', 'Tennis', 'Swimming', 'Boxing', 'Cycling', 'Hockey', 'Skiing', 'Surfing', 'Golf']
  },
  {
    category: 'Jobs',
    words: ['Doctor', 'Pilot', 'Chef', 'Teacher', 'Astronaut', 'Firefighter', 'Detective', 'Farmer', 'Dentist', 'Lawyer']
  },
  {
    category: 'Tech',
    words: ['iPhone', 'Laptop', 'Headphones', 'Drone', 'Smartwatch', 'Keyboard', 'Tablet', 'Router', 'Console', 'Camera']
  },
  {
    category: 'Household',
    words: ['Pillow', 'Toaster', 'Mirror', 'Fridge', 'Curtain', 'Soap', 'Broom', 'Kettle', 'Carpet', 'Blanket']
  }
];

export function pickRandomWord(): { category: string; word: string } {
  const pack = WORD_PACKS[Math.floor(Math.random() * WORD_PACKS.length)];
  const word = pack.words[Math.floor(Math.random() * pack.words.length)];
  return { category: pack.category, word };
}
