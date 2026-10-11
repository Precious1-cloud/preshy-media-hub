

// PROTECT WEBSITE PAGES

const protectedPages = [
    "home.html",
    "movies.html",
    "audio.html",
    "books.html",
    "favorites.html",
    "cart.html",
    "profile.html",
    "watch.html"
];



const currentPage = location.pathname.split("/").pop();

if (
    protectedPages.includes(currentPage) &&
    localStorage.getItem("loggedIn") !== "true"
) {
    window.location.href = "login.html";
}




//MOVIES SECTION//

const API_KEY = "c350852023dc0f581d1a81353fa8126d";
const moviesContainer = document.getElementById("moviesContainer");

const searchInput = document.getElementById("movieSearch");
const searchButton = document.getElementById("searchMovieBtn");


// ADD MOVIE CARD


function createMovieCard(movie) {

    if (!movie.poster_path) return;

    const card = document.createElement("div");

    card.className = "media-card";

    const poster =
        "https://image.tmdb.org/t/p/w500" + movie.poster_path;

    card.innerHTML = `
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " official trailer")}" target="_blank">

            <img src="${poster}" alt="${movie.title}">

            <h3>${movie.title}</h3>

        </a>

        <button class="three-dot-btn">⋮</button>

        <div class="card-menu">

            <button class="favorite-btn">
                ❤️ Add to Favorites
            </button>

            <button class="cart-btn">
                🛒 Add to Cart
            </button>

            <button class="download-btn">
                ⬇️ Download
            </button>

        </div>
    `;


    // THREE DOT BUTTON

    const threeDotBtn =
        card.querySelector(".three-dot-btn");

    const menu =
        card.querySelector(".card-menu");

    threeDotBtn.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();

        menu.classList.toggle("show");

    });


   
    // FAVORITES
    card.querySelector(".favorite-btn")
        .addEventListener("click", function(event) {

            event.preventDefault();

            let favorites =
                JSON.parse(localStorage.getItem("favorites")) || [];

            const item = {
                type: "movie",
                title: movie.title,
                image: poster
            };

            const alreadyAdded = favorites.some(fav =>
                fav.type === item.type &&
                fav.title === item.title
            );

            if (alreadyAdded) {
                alert("This movie is already in your Favorites! ❤️");
                return;
            }

            favorites.push(item);

            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites)
            );

            alert("Added to Favorites successfully! ❤️");
        });


    // CART
    card.querySelector(".cart-btn")
        .addEventListener("click", function(event) {

            event.preventDefault();

            let cart =
                JSON.parse(localStorage.getItem("cart")) || [];

            const item = {
                type: "movie",
                title: movie.title,
                image: poster
            };

            const alreadyAdded = cart.some(cartItem =>
                cartItem.type === item.type &&
                cartItem.title === item.title
            );

            if (alreadyAdded) {
                alert("This movie is already in your Cart! 🛒");
                return;
            }

            cart.push(item);

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            alert("Added to Cart successfully! 🛒");
        });

    // DOWNLOAD

    card.querySelector(".download-btn")
        .addEventListener("click", function(event) {

            event.preventDefault();

            const link =
                document.createElement("a");

            link.href = poster;

            link.download = movie.title + ".jpg";

            link.target = "_blank";

            link.click();

        });


    moviesContainer.appendChild(card);

}


// LOAD 100+ MOVIES


const moviePages = [1, 2, 3, 4, 5, 6];

Promise.all(

    moviePages.map(function(page) {

        return fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key="
            + API_KEY
            + "&language=en-US&page="
            + page
        )
        .then(response => response.json());

    })

)
.then(function(results) {

    moviesContainer.innerHTML = "";

    results.forEach(function(data) {

        data.results.forEach(function(movie) {

            createMovieCard(movie);

        });

    });

});



// SEARCH MOVIES


if (searchButton) {

    searchButton.addEventListener("click", function() {

        const searchText =
            searchInput.value.trim();


        if (searchText === "") {

            location.reload();

            return;

        }


        fetch(
            "https://api.themoviedb.org/3/search/movie?api_key="
            + API_KEY
            + "&language=en-US&query="
            + encodeURIComponent(searchText)
        )
        .then(response => response.json())

        .then(function(data) {

            moviesContainer.innerHTML = "";


            if (data.results.length > 0) {

                data.results.forEach(function(movie) {

                    if (movie.poster_path) {

                        createMovieCard(movie);

                    }

                });

            }

            else {

                const card =
                    document.createElement("div");

                card.className = "media-card";

                card.innerHTML = `
                    <img
                        src="https://via.placeholder.com/160x230?text=Search+Movie"
                        alt="${searchText}"
                    >

                    <h3>${searchText}</h3>

                    <button class="three-dot-btn">⋮</button>

                    <div class="card-menu">

                        <button>
                            ❤️ Add to Favorites
                        </button>

                        <button>
                            🛒 Add to Cart
                        </button>

                        <button>
                            ⬇️ Download
                        </button>

                    </div>
                `;

                moviesContainer.appendChild(card);

            }

        });

    });

}







 // AUDIO

const audioContainer = document.getElementById("audioContainer");
const audioSearch = document.getElementById("audioSearch");
const searchAudioBtn = document.getElementById("searchAudioBtn");

function loadAudio(searchTerm = "music") {
    fetch("https://itunes.apple.com/search?term="
        + encodeURIComponent(searchTerm)
        + "&media=music&entity=song&limit=1000")
    .then(response => response.json())
    .then(function(data) {
        audioContainer.innerHTML = "";

        data.results.forEach(function(song) {
            if (!song.artworkUrl100) return;

            const card = document.createElement("div");
            card.className = "media-card";

            card.innerHTML = `
                <img src="${song.artworkUrl100}" alt="${song.trackName}">
                <h3>${song.trackName}</h3>
                <p>${song.artistName}</p>
                <audio controls src="${song.previewUrl || ""}"></audio>

                <button class="three-dot-btn">⋮</button>
                <div class="card-menu">
                    <button class="audio-fav">❤️ Add to Favorites</button>
                    <button class="audio-cart">🛒 Add to Cart</button>
                    <button class="audio-download">⬇️ Download</button>
                </div>
            `;

            const item = {
                type: "audio",
                title: song.trackName,
                image: song.artworkUrl100
            };

            card.querySelector(".three-dot-btn")
                .addEventListener("click", function(event) {
                    event.stopPropagation();
                    card.querySelector(".card-menu").classList.toggle("show");
                });
// AUDIO FAVORITES
card.querySelector(".audio-fav").addEventListener("click", function() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    let exists = favorites.some(function(saved) {
        return saved.type === item.type && saved.title === item.title;
    });

    if (exists) {
        alert("Already in Favorites ❤️");
    } else {
        favorites.push(item);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Added to Favorites ❤️");
    }
});

// AUDIO CART
card.querySelector(".audio-cart").addEventListener("click", function() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let exists = cart.some(function(saved) {
        return saved.type === item.type && saved.title === item.title;
    });

    if (exists) {
        alert("Already in Cart 🛒");
    } else {
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to Cart 🛒");
    }
});
          
            audioContainer.appendChild(card);
        });
    })
    .catch(function() {
        audioContainer.innerHTML = "<p>Audio could not load. Check your internet.</p>";
    });
}

if (audioContainer) {
    loadAudio();
}

if (searchAudioBtn) {
    searchAudioBtn.addEventListener("click", function() {
        loadAudio(audioSearch.value.trim() || "music");
    });
}





 // BOOKS

const booksContainer = document.getElementById("booksContainer");
const bookSearch = document.getElementById("bookSearch");
const searchBookBtn = document.getElementById("searchBookBtn");

function loadBooks(searchTerm = "popular") {
    fetch(
        "https://openlibrary.org/search.json?q="
        + encodeURIComponent(searchTerm)
        + "&limit=1000"
    )
    .then(response => response.json())
    .then(function(data) {
        booksContainer.innerHTML = "";
        let count = 0;

        data.docs.forEach(function(book) {
            if (!book.cover_i) return;

            const cover =
                "https://covers.openlibrary.org/b/id/"
                + book.cover_i + "-M.jpg";

            const author = book.author_name
                ? book.author_name[0]
                : "Unknown Author";

            const item = {
                type: "book",
                title: book.title,
                image: cover
            };

            const card = document.createElement("div");
            card.className = "media-card";

            card.innerHTML = `
                <a class="book-link"
                   href="https://openlibrary.org${book.key}"
                   target="_blank">
                    <img src="${cover}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>${author}</p>
                </a>

                <button class="three-dot-btn">⋮</button>

                <div class="card-menu">
                    <button class="book-fav">
                        ❤️ Add to Favorites
                    </button>

                    <button class="book-cart">
                        🛒 Add to Cart
                    </button>

                    <button class="book-download">
                        ⬇️ Download
                    </button>
                </div>
            `;

            // THREE-DOT MENU
            card.querySelector(".three-dot-btn")
                .addEventListener("click", function(event) {
                    event.stopPropagation();
                    card.querySelector(".card-menu")
                        .classList.toggle("show");
                });

            // ADD TO FAVORITES
            card.querySelector(".book-fav")
                .addEventListener("click", function() {
                    let favorites =
                        JSON.parse(localStorage.getItem("favorites")) || [];

                    const exists = favorites.some(function(saved) {
                        return saved.type === item.type &&
                               saved.title === item.title;
                    });

                    if (!exists) {
                        favorites.push(item);
                        localStorage.setItem(
                            "favorites",
                            JSON.stringify(favorites)
                        );
                    }

                    alert(exists
                        ? "Already in Favorites ❤️"
                        : "Added to Favorites ❤️");
                });

            // ADD TO CART
            card.querySelector(".book-cart")
                .addEventListener("click", function() {
                    let cart =
                        JSON.parse(localStorage.getItem("cart")) || [];

                    const exists = cart.some(function(saved) {
                        return saved.type === item.type &&
                               saved.title === item.title;
                    });

                    if (!exists) {
                        cart.push(item);
                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );
                    }

                    alert(exists
                        ? "Already in Cart 🛒"
                        : "Added to Cart 🛒");
                });

            // DOWNLOAD BOOK COVER
            card.querySelector(".book-download")
                .addEventListener("click", function() {
                    const link = document.createElement("a");
                    link.href = cover;
                    link.download = book.title + "-cover.jpg";
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                });

            booksContainer.appendChild(card);
            count++;
        });

        if (count === 0) {
            booksContainer.innerHTML =
                "<p>No books found. Try another search.</p>";
        }
    })
    .catch(function(error) {
        console.log(error);
        booksContainer.innerHTML =
            "<p>Books could not load. Check your internet connection.</p>";
    });
}

// LOAD BOOKS
if (booksContainer) {
    loadBooks();
}

// SEARCH BOOKS
if (searchBookBtn) {
    searchBookBtn.addEventListener("click", function() {
        const searchText = bookSearch.value.trim();
        loadBooks(searchText || "popular");
    });
}






/* LOGIN, SIGN UP & FORGOT PASSWORD */

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotForm = document.getElementById("forgotForm");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const forgotPassword = document.getElementById("forgotPassword");
const backToLogin = document.getElementById("backToLogin");

function getPreshyUsers() {
    let users = JSON.parse(localStorage.getItem("preshyUsers") || "[]");

    // Keep any account saved by the older version.
    const oldUser = JSON.parse(localStorage.getItem("preshyUser") || "null");

    if (oldUser && oldUser.email &&
        !users.some(user => user.email.toLowerCase() === oldUser.email.toLowerCase())) {
        users.push(oldUser);
        localStorage.setItem("preshyUsers", JSON.stringify(users));
    }

    return users;
}

function showAuthForm(formToShow) {
    [loginForm, signupForm, forgotForm].forEach(form => {
        if (form) form.style.display = form === formToShow ? "block" : "none";
    });
}

if (showSignup) {
    showSignup.addEventListener("click", function(event) {
        event.preventDefault();
        showAuthForm(signupForm);
    });
}

if (showLogin) {
    showLogin.addEventListener("click", function(event) {
        event.preventDefault();
        showAuthForm(loginForm);
    });
}

if (forgotPassword) {
    forgotPassword.addEventListener("click", function(event) {
        event.preventDefault();
        showAuthForm(forgotForm);
    });
}

if (backToLogin) {
    backToLogin.addEventListener("click", function(event) {
        event.preventDefault();
        showAuthForm(loginForm);
    });
}

// SIGN UP
if (signupBtn) {
    signupBtn.addEventListener("click", function() {
        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value;
        const message = document.getElementById("signupMessage");

        if (!name || !email || !password) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "#f87171";
            return;
        }

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordPattern.test(password)) {
            message.textContent =
                "Use 8+ characters with uppercase, lowercase, a number and a special character.";
            message.style.color = "#f87171";
            return;
        }

        const users = getPreshyUsers();

        if (users.some(user => user.email.toLowerCase() === email)) {
            message.textContent = "This email already has an account. Please login.";
            message.style.color = "#f87171";
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem("preshyUsers", JSON.stringify(users));

        message.textContent = "Account created successfully. Please login.";
        message.style.color = "#4ade80";
    });
}

// LOGIN
if (loginBtn) {
    loginBtn.addEventListener("click", function() {
        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        const user = getPreshyUsers().find(
            account => account.email.toLowerCase() === email &&
                       account.password === password
        );

        if (!user) {
            message.textContent = "Incorrect email or password.";
            message.style.color = "#f87171";
            return;
        }

        localStorage.setItem("preshyCurrentUser", JSON.stringify(user));
        localStorage.setItem("loggedIn", "true");
        window.location.href = "home.html";
    });
}

// FORGOT PASSWORD
if (resetPasswordBtn) {
    resetPasswordBtn.addEventListener("click", function() {
        const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
        const newPassword = document.getElementById("newPassword").value;
        const message = document.getElementById("forgotMessage");

        const users = getPreshyUsers();
        const index = users.findIndex(
            user => user.email.toLowerCase() === email
        );

        if (index === -1) {
            message.textContent = "This email is not registered.";
            message.style.color = "#f87171";
            return;
        }

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordPattern.test(newPassword)) {
            message.textContent =
                "Use 8+ characters with uppercase, lowercase, a number and a special character.";
            message.style.color = "#f87171";
            return;
        }

        users[index].password = newPassword;
        localStorage.setItem("preshyUsers", JSON.stringify(users));

        const currentUser = JSON.parse(
            localStorage.getItem("preshyCurrentUser") || "null"
        );

        if (currentUser && currentUser.email.toLowerCase() === email) {
            currentUser.password = newPassword;
            localStorage.setItem("preshyCurrentUser", JSON.stringify(currentUser));
        }

        message.textContent = "Password reset successfully. You can now login.";
        message.style.color = "#4ade80";
    });
}


//SHOW FAVORITES//

const favoritesContainer = document.getElementById("favoritesContainer");

if (favoritesContainer) {
    function displayFavorites() {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        favoritesContainer.innerHTML = "";

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = "<p>You have no favorites yet ❤️</p>";
            return;
        }

        favorites.forEach(function(item, index) {
            const card = document.createElement("div");
            card.className = "media-card";

            card.innerHTML = `
                <img src="${item.image || ""}" alt="${item.title || "Media item"}">
                <h3>${item.title || "Untitled"}</h3>
                <p>${item.type || ""}</p>

                ${item.type === "audio" && item.audioUrl
                    ? `<audio controls preload="none" src="${item.audioUrl}"></audio>`
                    : ""}

                <button class="three-dot-btn">⋮</button>
                <div class="favorite-menu">
                    <button class="remove-favorite-btn">🗑️ Remove</button>
                </div>
            `;

            const menu = card.querySelector(".favorite-menu");

            card.querySelector(".three-dot-btn").addEventListener("click", function(event) {
                event.stopPropagation();
                menu.classList.toggle("show");
            });

            card.querySelector(".remove-favorite-btn").addEventListener("click", function() {
                let savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
                savedFavorites.splice(index, 1);
                localStorage.setItem("favorites", JSON.stringify(savedFavorites));
                displayFavorites();
            });

            favoritesContainer.appendChild(card);
        });
    }

    displayFavorites();
}







// SHOW CART


const cartContainer = document.getElementById("cartContainer");

if (cartContainer) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {

        cartContainer.innerHTML =
            "<p>Your cart is empty 🛒</p>";

    } else {

        cartContainer.innerHTML = "";

        cart.forEach(function(item, index) {

            const card = document.createElement("div");

            card.className = "media-card";

            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">

                <h3>${item.title}</h3>

                <p>${item.type}</p>

                <button class="three-dot-btn">⋮</button>

                <div class="cart-menu">

                    <button class="remove-cart-btn">
                        🗑️ Remove
                    </button>

                </div>
            `;

            const dotButton =
                card.querySelector(".three-dot-btn");

            const cartMenu =
                card.querySelector(".cart-menu");

            dotButton.addEventListener("click", function(event) {

                event.stopPropagation();

                cartMenu.classList.toggle("show");

            });

            card.querySelector(".remove-cart-btn")
                .addEventListener("click", function() {

                    cart.splice(index, 1);

                    localStorage.setItem(
                        "cart",
                        JSON.stringify(cart)
                    );

                    location.reload();

                });

            cartContainer.appendChild(card);

        });
    }
}





/* PROFILE */

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const logoutBtn = document.getElementById("logoutBtn");

const currentProfileUser = JSON.parse(
    localStorage.getItem("preshyCurrentUser") || "null"
);

if (profileName) {
    profileName.textContent = currentProfileUser
        ? currentProfileUser.name
        : "My Account";
}

if (profileEmail) {
    profileEmail.textContent = currentProfileUser
        ? currentProfileUser.email
        : "No email found";
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("preshyCurrentUser");
        window.location.replace("login.html");
    });
}




/* CHECKOUT PAGE */

const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const paymentMessage = document.getElementById("paymentMessage");

if (checkoutItems && checkoutTotal) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        checkoutItems.textContent = "Your cart is empty.";
        checkoutTotal.textContent = "₦0.00";
    } else {
        checkoutItems.innerHTML = "";

        cart.forEach(function(item) {
            const row = document.createElement("p");
            row.textContent = item.title;
            checkoutItems.appendChild(row);
        });

        checkoutTotal.textContent =
            "₦" + (cart.length * 1000).toLocaleString("en-NG") + ".00";
    }
}

if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            paymentMessage.textContent = "Your cart is empty. Add items first.";
            return;
        }

        if (document.getElementById("paymentMethod").value === "demo") {
            paymentMessage.textContent =
                "Demo checkout successful! No real payment was made.";
        }
    });
}