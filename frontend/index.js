// const API_URL = "http://localhost:8081/memes";
const API_URL = "https://xmeme-backend-tushar.herokuapp.com/memes";

// On loading the window , memes are rendered , the id is reset and the form is hidden. The form here refers to the edit meme form
window.onload = () => {
  renderMemes();
  resetId();
  hideForm();
};

// Function to capture inputs and send post request to the backend
function submitMeme() {
  // Capturing form inputs entered by the user
  const name = document.getElementById("owner-name").value;
  const caption = document.getElementById("meme-caption").value;
  const url = document.getElementById("meme-url").value;

  // Creating an object to send to the backend
  let data = {
    name: name,
    caption: caption,
    url: url,
  };

  // Send a post request to the backend
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(() => {
      console.log("Added in DB");
    });
}

// id of the button that triggered edit meme.
let id = "";

// Set id as the parameter i
function setId(i) {
  id = i;
}

// Reset the id
function resetId() {
  id = "";
}

// Show the edit meme form to the user
function showForm() {
  document.getElementById("editform").style.display = "block";
}

// Hide the edit meme form from the user
function hideForm() {
  document.getElementById("editform").style.display = "none";
}

// Handling click of the edit button
function handleClick(event) {
  // Set the id variable
  setId(event.target.value);
  // Show the edit meme form to the user
  showForm();
}

function editMeme() {
  // Capturing form inputs entered by the user
  const url = document.getElementById("edit-meme-url").value;
  const caption = document.getElementById("edit-meme-caption").value;

  // Creating an object to send to the backend.
  let data = {
    url: url,
    caption: caption,
  };

  // url or caption may be empty.
  // Therefore we need to remove the empty entries from the object
  const removeEmptyOrNull = (obj) => {
    Object.keys(obj).forEach(
      (k) =>
        (obj[k] && typeof obj[k] === "object" && removeEmptyOrNull(obj[k])) ||
        (!obj[k] && obj[k] !== undefined && delete obj[k])
    );
    return obj;
  };

  // Calling the above defined function
  data = removeEmptyOrNull(data);

  // Sending a patch request to the backend
  fetch(`https://xmeme-backend-tushar.herokuapp.com/memes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(() => {
      console.log(`Updated meme with id ${id}`);
    })
    .catch(() => {
      // Error handling
      console.log(`${id} id does not exist!`);
    });
}

// Fetching memes from the backend and rendering them in index.html using Document Object Model (DOM)
function renderMemes() {
  fetch(API_URL)
    .then((res) => {
      return res.json();
    })
    .then((memes) => {
      let data = "";
      // Looping through the memes returned by the backend
      memes.forEach((meme) => {
        data += ` <div class="meme">
        <div class="content">
          <div class="name">${meme.name}</div>
          <div class="caption">${meme.caption}</div>
        </div>
       <img src=${meme.url} alt="meme" />
       <button class="edit btn btn-primary" value=${meme.id}  onclick="handleClick(event)">Edit</button>
      </div>`;
      });

      // Rendering memes in index.html using DOM
      document.getElementById("meme-container").innerHTML = data;
    });
}
