// In-memory storage for pets and users
let pets = [
    { id: 1, name: 'Bella', breed: 'Labrador', age: 3 },
    { id: 2, name: 'Charlie', breed: 'Poodle', age: 4 },
    { id: 3, name: 'Max', breed: 'Bulldog', age: 2 },
    { id: 4, name: 'Lucy', breed: 'Beagle', age: 5 },
    { id: 5, name: 'Daisy', breed: 'Chihuahua', age: 1 },
    { id: 6, name: 'Rocky', breed: 'Boxer', age: 4 },
    { id: 7, name: 'Milo', breed: 'Dachshund', age: 2 },
    { id: 8, name: 'Luna', breed: 'Golden Retriever', age: 3 },
    { id: 9, name: 'Zoe', breed: 'Husky', age: 6 },
    { id: 10, name: 'Buddy', breed: 'German Shepherd', age: 3 }
];
pets.forEach(pet => pet.count = Math.floor(Math.random() * 10) + 1);  // Random count between 1 and 10

let users = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
updateUI();

// Register user
function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (users.some(user => user.email === email)) {
        alert('Email already registered.');
        return;
    }

    const newUser = { id: users.length + 1, name, email, password, adoptedPets: [] };
    users.push(newUser);
    alert('Registration successful! Please log in.');
    showSection('login');
}

// Login user
function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        alert('Invalid credentials.');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Login successful!');
    updateUI();
    showSection('home');
}

// Logout user
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    showSection('login');
}

// Update UI based on login status
function updateUI() {
    if (currentUser) {
        document.getElementById('auth-links').style.display = 'none';
        document.getElementById('logout-button').style.display = 'inline';
        document.getElementById('user-profile').innerHTML = `
            <p>Name: ${currentUser.name}</p>
            <p>Email: ${currentUser.email}</p>
            <p>Adopted Pets: ${currentUser.adoptedPets.map(pet => pet.name).join(', ') || 'None'}</p>
        `;
    } else {
        document.getElementById('auth-links').style.display = 'inline';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('user-profile').innerHTML = '<p>Please log in to view your profile.</p>';
    }

    displayPets();
}

// Display pets in the "Pets" section
function displayPets() {
    const petList = document.getElementById('pet-list');
    petList.innerHTML = '';
    pets.forEach(pet => {
        const petDiv = document.createElement('div');
        petDiv.classList.add('pet');
        petDiv.innerHTML = `
            <h3>${pet.name} (${pet.breed})</h3>
            <p>Age: ${pet.age} years</p>
            <p>Available: ${pet.count}</p>
            <button onclick="adoptPet(${pet.id})" ${pet.count <= 0 ? 'disabled' : ''}>Adopt</button>
        `;
        petList.appendChild(petDiv);
    });
}

// Adopt a pet
function adoptPet(petId) {
    if (!currentUser) {
        alert('Please log in to adopt a pet.');
        showSection('login');
        return;
    }

    const pet = pets.find(p => p.id === petId);
    if (pet && pet.count > 0) {
        pet.count -= 1;
        currentUser.adoptedPets.push(pet);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert(`You adopted ${pet.name}!`);
        updateUI();
    } else {
        alert('This pet is not available for adoption.');
    }
}

// Switch sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Check if there's a user logged in when the page loads
if (currentUser) {
    updateUI();
    showSection('home');
} else {
    showSection('login');
}
