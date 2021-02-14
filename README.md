This is an Xmeme application. It allows users to enter their name , caption of the meme and URL of the meme. The meme is then stored in the database and the latest 100 memes are rendered with the latest one being shown on the top.

The frontend has been built using HTML,CSS,Vanilla JS and bootstrap.

The backend has been buit using node and express.
MongoDB has been used as the database.

Some features :

1. You cannot post a meme with any or all the fields empty.
2. You cannot post a meme if the url is an invalid image url.
3. You cannot post duplicate memes (same name,caption and url i.e combination of all the three cannot be same).
4. Your name will be stored in a specific format. Eg aJAY mEhTA will be stored as Ajay Mehta
