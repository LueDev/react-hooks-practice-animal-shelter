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

    configObj = {"Configuration-type" : "application/json"}
    setPets(pets.map(pet => {
      return pet.id === petId ? { ...pet, isAdopted: !pet.isAdopted } : pet;
    }));
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