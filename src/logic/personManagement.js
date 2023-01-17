import familyTreeData from "../stores/familyTreeData";

export const setActivePerson = (person) => {
    familyTreeData.update((currentValue) => {
      return {
        ...currentValue,
        activePerson: person
        }
    })
  }

export const findPersonByName = (name, bAddIfNotFound) => {

	let matchingPerson = {};

	familyTreeData.subscribe((currentValue) => {
		currentValue.people.forEach(person => {
			if (name == person.name)
			{
				matchingPerson = person;
			}
		})
	
		if (matchingPerson == undefined && bAddIfNotFound)
		{
			matchingPerson = currentValue.defaultPerson
			matchingPerson.name = name
			addPersonToKnownPeople(matchingPerson)
		}
	

	  })

	  return matchingPerson;
}

export const addPersonToKnownPeople = (person) => {
	familyTreeData.update((currentValue) => {
        return {
          ...currentValue,
          people: [...currentValue.people, person]
        }
	})
}

const tryAddSibling = (person, siblingToAdd) => {

    let bIsAlreadySibling = false;

    person.siblings.forEach(person => {
      if (person.name == siblingToAdd.name) {
        bIsAlreadySibling = true;
      }
    })

    if (!bIsAlreadySibling) {
        familyTreeData.update((currentValue) => {
        return {
          ...currentValue,
          people: [...currentValue.people, person]
        }
      })
    }
  }