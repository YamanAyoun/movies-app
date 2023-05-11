# Movies-Library

**Author Name**: Yaman Ayoun
## WRRC
![WRRC image](./image/WRRC.png)

## Getting Started

first you should `npm install express` on terminal for project ,then all packges is abear on your project.
## Project Features
you can see movie information and you can change to favorate page ,and if you use any `wrong url` the you take 404 error , when you type `/error` after url will abear error 500.

## what is new update
now user can open another pages `/trending` for see this information
- id
- title
- release date
- poster path
- overview

 `/search` to see id and title for movies, `/genres` Displays the movie type, and you can also view famous people when you use `/popular`

 ## Add Database
 in this project now you have database for get data and send data, So when you use `/getMovies` in url, data is appeared, and when you need send a new data you should use in url `/addMovie` in thunder becouse it's have post methode for send data for database.

 ## new request to the database

now you can update the database when you use `/UPDATE/id` in `put` url and you can delete the movies from your database if use `/DELETE/id`.

if you need get the Movie you should type **`id`** for any movie and all information is getting.