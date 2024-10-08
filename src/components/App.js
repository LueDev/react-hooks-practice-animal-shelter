import React, { useState } from "react";

import Filters from "./Filters";
import PetBrowser from "./PetBrowser";
import { getByType } from "../mocks/data";

function App() {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({ type: "all" });

  function onFindPetsClick(event) {
    event.preventDefault();
    console.log("Fetching pets");

    fetch(`http://localhost:3001/pets`)
      .then((res) => res.json())
      .then((data) => {
        const filteredPets = filters.type === "all" ? data : getByType(filters.type);
        setPets(filteredPets);
      })
      .catch((error) => {
        console.error("Error fetching pets:", error);
      });
  }

  function onChangeType(event) {
    console.log(`Changed filter type to ${event.target.value}`);
    setFilters({ ...filters, type: event.target.value });
  }

  function onAdoptPet(petId) {
    // Update the local state
    const updatedPets = pets.map(pet => {
      if (pet.id === petId) {
        const updatedPet = { ...pet, isAdopted: !pet.isAdopted };
  
        // Send the update to the server
        const configObj = {
          method: "PATCH", // Use PATCH for partial updates
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isAdopted: updatedPet.isAdopted }) // Send only the relevant data
        };
  
        fetch(`http://localhost:3001/pets/${petId}`, configObj)
          .then(response => response.json())
          .then(data => console.log("Updated pet:", data))
          .catch(error => console.error("Error:", error));
  
        return updatedPet;
      } else {
        return pet;
      }
    });
  
    // Update the state with the new pets array
    setPets(updatedPets);
  }

  return (
    <div className="ui container">
      <header>
        <h1 className="ui dividing header">React Animal Shelter</h1>
      </header>
      <div className="ui container">
        <div className="ui grid">
          <div className="four wide column">
            <Filters onChangeType={onChangeType} onFindPetsClick={onFindPetsClick}/>
          </div>
          <div className="twelve wide column">
            <PetBrowser pets={pets} onAdoptPet={onAdoptPet}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;