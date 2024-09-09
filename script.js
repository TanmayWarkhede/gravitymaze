// Basic setup with Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('gameContainer').appendChild(renderer.domElement);

// Create a spaceship
const spaceshipGeometry = new THREE.BoxGeometry(1, 1, 3);
const spaceshipMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
spaceship.position.set(0, 0, 0);
scene.add(spaceship);

// Create obstacles
const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const obstacles = [];
for (let i = 0; i < 8; i++) {
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
    );
    scene.add(obstacle);
    obstacles.push(obstacle);
}

// Create power-ups
const powerUpGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const powerUpMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const powerUps = [];
for (let i = 0; i < 5; i++) {
    const powerUp = new THREE.Mesh(powerUpGeometry, powerUpMaterial);
    powerUp.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
    );
    scene.add(powerUp);
    powerUps.push(powerUp);
}

// Camera position
camera.position.z = 15;

// Score
let score = 0;
document.getElementById('score').innerText = `Score: ${score}`;

// Load sound effects
const backgroundMusic = new Audio('assets/background.mp3');
const collectSound = new Audio('assets/collect.mp3');
const collideSound = new Audio('assets/collide.mp3');
backgroundMusic.loop = true;
backgroundMusic.play();

// Handle keyboard input
const keyboard = {};
window.addEventListener('keydown', (event) => {
    keyboard[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keyboard[event.code] = false;
});

// Check collisions
function checkCollisions() {
    powerUps.forEach((powerUp, index) => {
        const distance = spaceship.position.distanceTo(powerUp.position);
        if (distance < 1) {
            scene.remove(powerUp);
            powerUps.splice(index, 1);
            score += 10;
            document.getElementById('score').innerText = `Score: ${score}`;
            collectSound.play();
        }
    });

    obstacles.forEach((obstacle) => {
        const distance = spaceship.position.distanceTo(obstacle.position);
        if (distance < 1) {
            collideSound.play();
            alert('Game Over!');
            document.location.reload();
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Movement controls
    if (keyboard['ArrowUp']) spaceship.position.z -= 0.1;
    if (keyboard['ArrowDown']) spaceship.position.z += 0.1;
    if (keyboard['ArrowLeft']) spaceship.position.x -= 0.1;
    if (keyboard['ArrowRight']) spaceship.position.x += 0.1;

    // Rotate obstacles
    obstacles.forEach(obstacle => {
        obstacle.rotation.x += 0.01;
        obstacle.rotation.y += 0.01;
    });

    // Check for collisions
    checkCollisions();

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
