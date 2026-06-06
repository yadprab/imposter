export interface WordPack {
  category: string;
  words: string[];
}

export const WORD_PACKS: WordPack[] = [
  {
    category: 'Animals',
    words: ['Elephant', 'Tiger', 'Lion', 'Monkey', 'Giraffe', 'Penguin', 'Kangaroo', 'Crocodile', 'Peacock', 'Dolphin', 'Octopus', 'Camel', 'Cheetah', 'Panda']
  },
  {
    category: 'Fruits',
    words: ['Mango', 'Banana', 'Watermelon', 'Pineapple', 'Strawberry', 'Jackfruit', 'Pomegranate', 'Guava', 'Papaya', 'Custard apple', 'Grapes', 'Lychee']
  },
  {
    category: 'Tamil food',
    words: ['Parotta', 'Biryani', 'Dosa', 'Idli', 'Pongal', 'Chicken 65', 'Sambar', 'Rasam', 'Vada', 'Kothu parotta', 'Idiyappam', 'Chettinad chicken', 'Paneer butter masala', 'Gulab jamun']
  },
  {
    category: 'Drinks',
    words: ['Filter coffee', 'Tea', 'Lassi', 'Fresh lime', 'Tender coconut', 'Mango juice', 'Coke', 'Beer', 'Sugarcane juice', 'Buttermilk', 'Falooda', 'Milkshake']
  },
  {
    category: 'Sports',
    words: ['Cricket', 'Football', 'Tennis', 'Kabaddi', 'Basketball', 'Badminton', 'Hockey', 'Boxing', 'Carrom', 'Chess', 'Volleyball', 'Table tennis']
  },
  {
    category: 'Hollywood movies',
    words: ['Titanic', 'Avatar', 'Avengers', 'Inception', 'Jurassic Park', 'Frozen', 'Joker', 'Interstellar', 'Lion King', 'Iron Man', 'Harry Potter', 'Fast and Furious']
  },
  {
    category: 'Kollywood movies',
    words: ['Vikram', 'Jailer', 'Leo', 'Ghilli', 'Master', 'Mersal', 'Bigil', 'Asuran', 'Soorarai Pottru', 'Vada Chennai', 'Super Deluxe', 'Anniyan', 'Thuppakki', 'Jai Bhim']
  },
  {
    category: 'Tamil actors',
    words: ['Rajinikanth', 'Kamal Haasan', 'Vijay', 'Ajith', 'Suriya', 'Dhanush', 'Sivakarthikeyan', 'Vijay Sethupathi', 'Karthi', 'Simbu', 'Vadivelu', 'Yogi Babu', 'Santhanam', 'Vishal']
  },
  {
    category: 'Tamil actresses',
    words: ['Nayanthara', 'Trisha', 'Samantha', 'Anushka', 'Keerthy Suresh', 'Sai Pallavi', 'Jyothika', 'Aishwarya Rajesh', 'Tamannaah', 'Kajal Aggarwal', 'Nazriya', 'Shruti Haasan']
  },
  {
    category: 'Cricketers',
    words: ['Dhoni', 'Virat Kohli', 'Rohit Sharma', 'Sachin Tendulkar', 'Ashwin', 'Jadeja', 'Bumrah', 'Hardik Pandya', 'Suresh Raina', 'Sehwag', 'Rahul Dravid', 'Yuvraj Singh']
  },
  {
    category: 'Apps & brands',
    words: ['WhatsApp', 'Instagram', 'YouTube', 'Netflix', 'Swiggy', 'Zomato', 'Ola', 'Uber', 'Amazon', 'Flipkart', 'Hotstar', 'Spotify', 'Paytm', 'Google']
  },
  {
    category: 'Cartoons',
    words: ['Mickey Mouse', 'Tom and Jerry', 'Doraemon', 'Chhota Bheem', 'Shinchan', 'Spongebob', 'Pokemon', 'Motu Patlu', 'Oggy', 'Scooby Doo', 'Ben 10', 'Popeye']
  },
  {
    category: 'Superheroes',
    words: ['Spider-Man', 'Batman', 'Superman', 'Iron Man', 'Hulk', 'Thor', 'Captain America', 'Thanos', 'Wonder Woman', 'Black Panther', 'Deadpool', 'Doctor Strange']
  },
  {
    category: 'World cities',
    words: ['Paris', 'Tokyo', 'Dubai', 'New York', 'London', 'Bangkok', 'Singapore', 'Rome', 'Sydney', 'Maldives', 'Las Vegas', 'Istanbul']
  },
  {
    category: 'Tamil Nadu places',
    words: ['Chennai', 'Madurai', 'Coimbatore', 'Ooty', 'Kodaikanal', 'Rameswaram', 'Kanyakumari', 'Pondicherry', 'Thanjavur', 'Trichy', 'Mahabalipuram', 'Yercaud']
  },
  {
    category: 'Landmarks',
    words: ['Taj Mahal', 'Eiffel Tower', 'Statue of Liberty', 'Great Wall of China', 'Pyramids', 'Burj Khalifa', 'Big Ben', 'Leaning Tower of Pisa', 'Gateway of India', 'Colosseum', 'Niagara Falls', 'Marina Beach']
  },
  {
    category: 'Vehicles',
    words: ['Bullet bike', 'Auto rickshaw', 'Bus', 'Train', 'Aeroplane', 'Lorry', 'Cycle', 'Scooter', 'Boat', 'Helicopter', 'Metro', 'Ambulance']
  },
  {
    category: 'On a trip',
    words: ['Passport', 'Suitcase', 'Sunglasses', 'Camera', 'Backpack', 'Selfie', 'Charger', 'Water bottle', 'Map', 'Tent', 'Pillow', 'Boarding pass']
  },
  {
    category: 'At a wedding',
    words: ['Garland', 'Saree', 'Band', 'Buffet', 'Mehendi', 'Photographer', 'Muhurtham', 'Sweets', 'Nadaswaram', 'Reception', 'Thaali', 'Welcome drink']
  },
  {
    category: 'Jobs',
    words: ['Doctor', 'Teacher', 'Police', 'Pilot', 'Chef', 'Singer', 'Engineer', 'YouTuber', 'Farmer', 'Lawyer', 'Barber', 'Photographer']
  },
  {
    category: 'Household',
    words: ['Refrigerator', 'Ceiling fan', 'Mixer grinder', 'Pressure cooker', 'Mirror', 'Sofa', 'Washing machine', 'Television', 'Pillow', 'Broom', 'Bucket', 'Water heater']
  },
  {
    category: 'Clothes',
    words: ['Saree', 'Veshti', 'T-shirt', 'Jeans', 'Kurta', 'Sneakers', 'Lungi', 'Jacket', 'Watch', 'Sunglasses', 'Sandals', 'Cap']
  }
];

export function pickRandomWord(): { category: string; word: string } {
  const pack = WORD_PACKS[Math.floor(Math.random() * WORD_PACKS.length)];
  const word = pack.words[Math.floor(Math.random() * pack.words.length)];
  return { category: pack.category, word };
}
