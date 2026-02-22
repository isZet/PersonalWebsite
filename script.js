/* 
   script.js
   This file is for your custom JavaScript code.
*/

document.addEventListener('DOMContentLoaded', function() {
    // =========================================
    // 1. CONFIGURATION & SELECTORS
    // =========================================
    const githubUsername = 'isZet-True'; // REPLACE with your GitHub username
    const githubToken = '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'; // REPLACE with your GitHub personal access token (get from https://github.com/settings/tokens/new)
    const devToUsername = 'iszet';      // REPLACE with your Dev.to username
    const projectsContainer = document.getElementById('projects-container');
    const blogContainer = document.getElementById('blog-container');
    const galleryContainer = document.getElementById('gallery-container');

    // Map projects to their technologies (optional - use if you want to customize tech display)
    // Key should match the GitHub repo name
    const projectTechnologies = {
        // Example: 'repo-name': ['JavaScript', 'React', 'Node.js'],
        // Add your projects here if you want to display specific technologies
    };

    // Local projects (mockups) for projects that are not hosted on GitHub yet.
    // You can replace these placeholders with real screenshots, descriptions and links later.
    const localProjects = [
        {
            id: 'local-1',
            title: 'Local Project — Alpha',
            description: 'Placeholder description for a project not yet on GitHub. Replace with real content.',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            screenshot: 'https://placehold.co/600x350?text=Local+Project+1',
            link: '#'
        },
        {
            id: 'local-2',
            title: 'Local Project — Beta',
            description: 'Another placeholder entry. Add screenshot/title/description when ready.',
            technologies: ['Python', 'Flask'],
            screenshot: 'https://placehold.co/600x350?text=Local+Project+2',
            link: '#'
        },
        {
            id: 'local-3',
            title: 'Local Project — Gamma',
            description: 'A mockup project card for projects outside GitHub.',
            technologies: ['React', 'Node.js'],
            screenshot: 'https://placehold.co/600x350?text=Local+Project+3',
            link: '#'
        }
    ];

    // Render local (mock) projects into the projects container
    function renderLocalProjects() {
        if (!projectsContainer) return;
        localProjects.forEach(proj => {
            const techBadges = proj.technologies.map(t => `<span class="badge bg-secondary me-2 mb-2">${t}</span>`).join('');
            const cardHTML = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm project-card local-project-card">
                    <img src="${proj.screenshot}" class="card-img-top" alt="${proj.title} screenshot" onerror="this.src='https://placehold.co/600x350?text=Image+Not+Found'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${proj.title}</h5>
                        <p class="card-text flex-grow-1">${proj.description}</p>
                        <div class="mb-3">
                            <small class="text-muted d-block mb-2">Technologies:</small>
                            <div>${techBadges || '<span class="text-muted">Not specified</span>'}</div>
                        </div>
                        <a href="${proj.link}" class="btn btn-outline-primary mt-auto" data-local-id="${proj.id}">View Details</a>
                    </div>
                </div>
            </div>
            `;
            projectsContainer.innerHTML += cardHTML;
        });
    }

    // Function to fetch projects from GitHub API
    function fetchProjects() {
        // 1. What fetch() does:
        // fetch() makes a network request to the URL provided.
        // It returns a "Promise" that resolves when the response is available.
        const headers = githubToken && githubToken !== 'ghp_' 
            ? { 'Authorization': `token ${githubToken}` }
            : {};
        
        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`, { headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // 2. What JSON response is:
                // The API returns data in JSON format (text representation of data).
                // .json() parses this text into a JavaScript array of objects we can use.
                return response.json();
            })
            .then(data => {
                // Clear the loading spinner
                projectsContainer.innerHTML = '';
                // Render GitHub projects
                displayProjects(data);
            })
            .catch(error => {
                // Handle errors (e.g., user not found or network issues)
                projectsContainer.innerHTML = `
                    <div class="col-12 text-center text-danger">
                        <p>Error loading projects: ${error.message}</p>
                    </div>`;
            });
    }

    function displayProjects(repos) {
        if (repos.length === 0) {
            projectsContainer.innerHTML = '<div class="col-12 text-center"><p>No public repositories found.</p></div>';
            return;
        }

 repos.forEach(repo => {
            // Check if custom technologies are defined
            if (projectTechnologies[repo.name]) {
                displayProjectCard(repo, projectTechnologies[repo.name]);
            } else {
                const headers = githubToken && githubToken !== 'ghp_' 
                    ? { 'Authorization': `token ${githubToken}` }
                    : {};
                
                // Fetch languages for this repo from GitHub API
                fetch(`https://api.github.com/repos/${githubUsername}/${repo.name}/languages`, { headers })
                    .then(response => response.json())
                    .then(languages => {
                        const techs = Object.keys(languages).length > 0 
                            ? Object.keys(languages) 
                            : (repo.language ? [repo.language] : []);
                        displayProjectCard(repo, techs);
                    })
                    .catch(() => {
                        // Fallback to primary language if API fails
                        const techs = repo.language ? [repo.language] : [];
                        displayProjectCard(repo, techs);
                    });
            }
        });
    }

    function displayProjectCard(repo, technologies) {
        // Create technology badges
        const techBadges = technologies
            .map(tech => `<span class="badge bg-primary me-2 mb-2">${tech}</span>`)
            .join('');
        
        // Create HTML for each project card
        const cardHTML = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm project-card">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${repo.name}</h5>
                        <p class="card-text flex-grow-1">${repo.description || 'No description available.'}</p>
                        <div class="mb-3">
                            <small class="text-muted d-block mb-2">Technologies:</small>
                            <div>${techBadges || '<span class="text-muted">Not specified</span>'}</div>
                        </div>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary mt-auto">View on GitHub</a>
                    </div>
                </div>
            </div>
        `;
        projectsContainer.innerHTML += cardHTML;
    }

    // Function to fetch blog posts from Dev.to API
    function fetchBlogPosts() {
        // 1. Fetch data from Dev.to
        fetch(`https://dev.to/api/articles?username=${devToUsername}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Clear loading spinner
                blogContainer.innerHTML = '';

                // Limit to 3 latest posts
                const posts = data.slice(0, 3);

                displayBlogPosts(posts);
            })
            .catch(error => {
                blogContainer.innerHTML = `
                    <div class="col-12 text-center text-danger">
                        <p>Error loading blog posts: ${error.message}</p>
                    </div>`;
            });
    }

    function displayBlogPosts(posts) {
        if (posts.length === 0) {
            blogContainer.innerHTML = '<div class="col-12 text-center"><p>No blog posts found.</p></div>';
            return;
        }

        posts.forEach(post => {
            const postHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm blog-card border-0">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text text-muted">${post.description || 'No description available.'}</p>
                            <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm stretched-link">Read Article</a>
                        </div>
                    </div>
                </div>
            `;
            blogContainer.innerHTML += postHTML;
        });
    }

    // Call the function to load projects
    fetchProjects();
    fetchBlogPosts();
    // Render local mock projects (non-GitHub)
    renderLocalProjects();

    // =========================================
    // GALLERY LOGIC
    // =========================================
    // CONFIGURATION: List your project folders and images here.
    // The script assumes images are located at: img/[folder]/[image_file]
    const galleryProjects = [
        {
            name: "Alerto Cam Norte",
            folder: "gallery/alertocamnorte",
            images: ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png", "img6.png", "img7.png", "img8.png", "img9.png", "img10.png"]
        },
        {
            name: "Cabreras Inventory",
            folder: "gallery/cabrerasinventory",
            images: ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png", "img6.png", "img7.png"]
        },
        {
            name: "Chimp or Champ Console",
            folder: "gallery/chimporchampconsole",
            images: ["img1.png", "img2.png", "img3.png", "img4.png"]
        },
        {
            name: "Fxdcord",
            folder: "gallery/fxdcord",
            images: ["img1.png", "img2.png", "img3.png"]
        },
        {
            name: "Meet Me at the Faculty Console",
            folder: "gallery/meetmeatthefacultyconsole",
            images: ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png", "img6.png"]
        }
    ];

    function renderGallery() {
        galleryContainer.innerHTML = '';

        if (galleryProjects.length === 0) {
            galleryContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted">Gallery is empty.</p></div>';
            return;
        }

        galleryProjects.forEach((project, index) => {
            // Use the first image as the album cover
            const folderPart = project.folder ? `${project.folder}/` : '';
            const coverImage = project.images.length > 0 ? `img/${folderPart}${project.images[0]}` : 'https://placehold.co/600x400?text=No+Image';
            const imageCount = project.images.length;

            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6';
            
            // We use onclick to trigger the modal function
            col.innerHTML = `
                <div class="card h-100 border-0 shadow-sm album-card" onclick="openGalleryModal(${index})">
                    <div class="position-relative overflow-hidden rounded">
                        <img src="${coverImage}" class="card-img-top album-cover" alt="${project.name} Cover" onerror="this.src='https://placehold.co/600x400?text=Image+Not+Found'">
                        <div class="album-overlay">
                            <h5 class="card-title mb-0 text-white">${project.name}</h5>
                            <small class="text-white-50">${imageCount} Photos</small>
                        </div>
                    </div>
                </div>
            `;
            galleryContainer.appendChild(col);
        });
    }

    // Function to open the modal with the specific project's images
    window.openGalleryModal = function(index) {
        const project = galleryProjects[index];
        const modalTitle = document.getElementById('galleryModalLabel');
        const modalBody = document.getElementById('galleryModalBody');
        
        modalTitle.textContent = project.name;
        
        // Build Carousel HTML for the modal
        const carouselId = 'modalCarousel';
        const folderPart = project.folder ? `${project.folder}/` : '';
        
        const indicators = project.images.map((_, i) => 
            `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" class="${i === 0 ? 'active' : ''}" aria-current="${i === 0 ? 'true' : 'false'}"></button>`
        ).join('');

        const slides = project.images.map((img, i) => `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                <img src="img/${folderPart}${img}" class="d-block w-100 modal-carousel-img" alt="Slide ${i+1}" onerror="this.src='https://placehold.co/800x450?text=Image+Not+Found'">
            </div>
        `).join('');

        modalBody.innerHTML = `
            <div id="${carouselId}" class="carousel slide carousel-fade" data-bs-ride="carousel">
                <div class="carousel-indicators">${indicators}</div>
                <div class="carousel-inner">${slides}</div>
                <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button>
                <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>
            </div>
        `;

        // Show Modal using Bootstrap API
        const galleryModal = new bootstrap.Modal(document.getElementById('galleryModal'));
        galleryModal.show();
    };

    // Render the gallery
    renderGallery();

    // =========================================
    // CONTACT FORM LOGIC (EMAILJS)
    // =========================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');

    // 1. EmailJS Initialization:
    // This line initializes the EmailJS SDK with your public key.
    // You get this from your EmailJS account under Account > API Keys.
    emailjs.init({ publicKey: 'OCVYJEnpGyPtz_dqN' }); // <-- IMPORTANT: Replace with your Public Key

    // Helper function to set error state
    const setError = (input, message) => {
        input.classList.add('is-invalid');
        // If we wanted to update the text dynamically:
        // input.nextElementSibling.textContent = message;
    };

    // Helper function to clear error state
    const clearError = (input) => {
        input.classList.remove('is-invalid');
    };

    function validateForm() {
        let isValid = true;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Clear previous errors before re-validating
        [nameInput, emailInput, messageInput].forEach(clearError);

        // 2. Validation Logic:
        // We check each field to ensure it's not empty and that the email is in a valid format.
        if (nameInput.value.trim() === '') {
            setError(nameInput, 'Please enter your name.');
            isValid = false;
        }

        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Block disposable emails and check for common typos
        const disposableDomains = ['tempmail.com', '10minutemail.com', 'mailinator.com', 'yopmail.com', 'guerrillamail.com'];
        const domainTypos = { 'gmil.com': 'gmail.com', 'gmal.com': 'gmail.com', 'yaho.com': 'yahoo.com', 'hotmal.com': 'hotmail.com' };

        if (emailValue === '') {
            setError(emailInput, 'Please enter your email address.');
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            setError(emailInput, 'Please enter a valid email address.');
            isValid = false;
        } else {
            const domain = emailValue.split('@')[1].toLowerCase();
            if (disposableDomains.includes(domain)) {
                setError(emailInput, 'Please use a permanent email address.');
                isValid = false;
            } else if (domainTypos[domain]) {
                setError(emailInput, `Did you mean ${domainTypos[domain]}?`);
                isValid = false;
            }
        }

        if (messageInput.value.trim() === '') {
            setError(messageInput, 'Please enter a message.');
            isValid = false;
        }

        return isValid;
    }

    // 3. Event Listener:
    // We listen for the 'submit' event on the form.
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents the default page reload on submission.

        if (!validateForm()) return; // If validation fails, stop execution.

        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...`;
        formStatus.innerHTML = '';

        // 4. EmailJS Process:
        // emailjs.sendForm() sends the form data.
        // - 'YOUR_SERVICE_ID': From EmailJS > Email Services.
        // - 'YOUR_TEMPLATE_ID': From EmailJS > Email Templates.
        // - this: Refers to the form element (<form id="contact-form">).
        emailjs.sendForm('service_3e7zwnq', 'template_qa1wazu', this)
            .then(() => {
                formStatus.innerHTML = `<div class="alert alert-success" role="alert">Message sent successfully! I'll get back to you soon.</div>`;
                contactForm.reset();
            }, (error) => {
                formStatus.innerHTML = `<div class="alert alert-danger" role="alert">Failed to send message. Error: ${error.text}. Please try again.</div>`;
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
    });

    // =========================================
    // DONATION SIMULATION (LocalStorage)
    // =========================================
    const donationForm = document.getElementById('donation-form');
    const totalDonationsDisplay = document.getElementById('total-donations');
    const donationStatus = document.getElementById('donation-status');

    // Function to update the total display from localStorage
    function updateTotalDonations() {
        // 1. What is localStorage?
        // localStorage is a web API that allows JavaScript sites to store key/value pairs in the browser.
        // - Data persists even after the browser window is closed or the page is refreshed.
        // - It stores data as strings, so we use JSON.stringify() to save and JSON.parse() to retrieve objects.
        
        // Retrieve existing donations or default to an empty array if none exist
        const donations = JSON.parse(localStorage.getItem('portfolio_donations')) || [];
        
        // Calculate total
        const total = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
        
        // Update DOM (show Philippine Peso)
        totalDonationsDisplay.textContent = `₱${total.toFixed(2)}`;
    }

    // Initialize display on page load
    updateTotalDonations();

    function validateDonationForm() {
        let isValid = true;
        const nameInput = document.getElementById('donor-name');
        const amountInput = document.getElementById('donation-amount');
        const methodInput = document.getElementById('payment-method');

        [nameInput, amountInput, methodInput].forEach(clearError);

        if (nameInput.value.trim() === '') {
            setError(nameInput);
            isValid = false;
        }

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            setError(amountInput);
            isValid = false;
        }

        if (methodInput.value === '') {
            setError(methodInput);
            isValid = false;
        }

        return isValid;
    }

    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateDonationForm()) return;

        const name = document.getElementById('donor-name').value.trim();
        const amount = parseFloat(document.getElementById('donation-amount').value);
        const method = document.getElementById('payment-method').value;

        // 3. Save to localStorage
        const newDonation = {
            name: name,
            amount: amount,
            method: method,
            date: new Date().toISOString()
        };

        // Get current list, add new item, and save back
        const donations = JSON.parse(localStorage.getItem('portfolio_donations')) || [];
        donations.push(newDonation);
        localStorage.setItem('portfolio_donations', JSON.stringify(donations));

        // 4. Success Feedback
        donationStatus.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">Thank you, <strong>${name}</strong>! Your donation of $${amount.toFixed(2)} has been simulated.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
        donationForm.reset();
        updateTotalDonations();
    });
});