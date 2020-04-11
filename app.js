// variables
const form = document.getElementById('movie-form');
const list = document.getElementById('movie-list');


//Movie class
class Movie {

	constructor(title,director,year){
		this.title = title;
		this.director = director;
		this.year = year;
	}

}


// UI class
class UI{

	static renderMovies(){
		list.innerHTML = "";
		let storedMovies = Store.getMovies();
		storedMovies.forEach( (movie, index) => UI.addMovieToList( movie, index ) );
	}


	static addMovieToList( movie, index ){

		let row = document.createElement('li');
		row.classList.add('collection-item', 'avatar');
		row.setAttribute('index', index );

		row.innerHTML = `
			<i class="material-icons circle blue grey grey darken-1">movie</i>
			<span class="title">${movie.title}</span>
			<p class="director">${movie.director}</p>
			<p class="year">${movie.year}</p>
			<a href="#" class="secondary-content"><i class="material-icons delete">delete</i></a>
		`; 

		list.appendChild(row);

	}


	static deleteMovie(el){
		if( el.classList.contains('delete') ){
			let index = el.parentElement.parentElement.getAttribute('index');
			Store.deleteMovie(index);
			UI.renderMovies();
		}

	}


	static clearFields(){
		for ( let field of form.getElementsByTagName('input') ) {
			field.value = "";
		}
	}

}


// Storage class (local storage)
class Store {
	
	static getMovies(){
		let movies;
		if( !localStorage.getItem( 'moviesList' ) ){
			movies = [];
		} else {
			movies = JSON.parse( localStorage.getItem( 'moviesList' ) );
		}
	
		return movies;
	}

	static addMovie( movie ){
		let movies = Store.getMovies();
		movies.push(movie);
		localStorage.setItem( 'moviesList', JSON.stringify( movies ) );
	}

	static deleteMovie(index){
		let movies = Store.getMovies();
		movies.splice( parseInt(index), 1);
		localStorage.setItem( 'moviesList', JSON.stringify( movies ) );
	}

}



// Event: display books
document.addEventListener('DOMContentLoaded', UI.renderMovies() );

// Event: add book
form.addEventListener('submit', (e) => {
	e.preventDefault();

	// validation control
	let valid = true;

	// get values
	let fields = [
		title = document.getElementById('title'),
		director = document.getElementById('director'),
		year = document.getElementById('year')
	];

	// validate
	fields.forEach( field => {
		if( field.value.length == 0 ){
			field.classList.add('invalid');
			valid = false;
		} else{
			field.classList.remove('invalid');
			valid = true;
		}
	});

	// if valid, add new movie
	if(valid){
		let fieldValues = fields.map(field => field.value);
		let movie = new Movie(...fieldValues);

		// add to local storage
		Store.addMovie(movie);

		// re-render movies
		UI.renderMovies();

		// clear fields
		UI.clearFields();
	}

});

// Event: delete book
list.addEventListener('click', (e) => {
	e.preventDefault();
	UI.deleteMovie(e.target);
});