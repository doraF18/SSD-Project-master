import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Card from './Card'; // Assuming Card is defined in a separate file
import image1 from './hai.jpg';

export default function HomePage({searchValue}) {
  const [searchQuery, setSearchQuery] = useState(''); // Not used here, but can be for future search input
  const [searchParams] = useSearchParams(); 

  const [cards, setCards] = useState([]); // Empty array to store cards
  const [displayedCards, setDisplayedCards] = useState([]); // Empty array to store cards

  useEffect(() =>{

    if(searchValue==="")
      setDisplayedCards(cards);
    else setDisplayedCards(cards.filter((c)=>c.title.toLowerCase().includes(searchValue.toLowerCase())||(c.description.toLowerCase().includes(searchValue.toLowerCase()))));
  },[searchValue]);

  useEffect(() => {
    const fetchCards = async()=> {
        try {
          const response = await axios.get('https://apex.oracle.com/pls/apex/laluna/show/get'); // Replace with your actual API endpoint
          const fetchedCards = response.data.items.map((item) => ({
            image: item.image, // Assuming you have an 'image' property or provide a default image
            title: item.name || 'No Title Available', // Set a default title if missing
            description: item.details.trim() || 'No Description Available', // Set a default description if missing
          }));
          setCards(fetchedCards);
          setDisplayedCards(fetchedCards);
      }catch(error)
      {
        console.error('Error fetching cards', error);
      }
      };
    fetchCards();
  },[]);

  return (
    <div className="container">
        {displayedCards.map((card, index) => (
          <div className="col-md-3 card" key={index}>
            <Card {...card} /> 
          </div>
        ))}
    </div>
  );
}