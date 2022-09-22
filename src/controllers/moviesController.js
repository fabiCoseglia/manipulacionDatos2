const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;
const Genres = db.Genre;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        Genres.findAll({
            order: ['name']
            
        }).then(allGenres=>{
            return res.render('moviesAdd',{allGenres})
        }).catch(err => console.log(err))  
    },
    create: function (req, res) {
        // CREATE METHOD
        const {title, rating, awards, length, genre, release_date} = req.body;

        db.Movie.create({
            title: title.trim(),
            rating,
            length,
            awards,
            genre,
            release_date,
            genre_id : genre
        }).then(movie=>{
            console.log(movie);
            return res.redirect('/movies');
        }).catch(err => console.log(err))
    },
    edit: function(req, res) {
        // EDIT METHOD
        let Movie = Movies.findByPk(req.params.id)

        let allGenres = Genres.findAll({
            order: ['name']
        })

        Promise.all([Movie,allGenres])
        
        .then(([Movie,allGenres])=>{
            
            return res.render('moviesEdit',{Movie,allGenres})
        }).catch(err => console.log(err))
    },
    
    update: function (req,res) {
        // TODO
        const {title, rating, awards, length, genre, release_date} = req.body;

        db.Movie.update({
            title: title.trim(),
            rating,
            awards,
            length,
            genre_id: genre,
            release_date
        },{
            where:{
                id:req.params.id
            }
        }).then(Movie=>{
            console.log(Movie);
            return res.redirect('/movies');
        }).catch(err => console.log(err))
    },
    delete: function (req, res) {
        //GET DELTE
        Movies.findByPk(req.params.id)
            .then(Movie=>{
                return res.render('moviesDelete',{Movie})
            })
    },
    destroy: function (req, res) {
        // DESTROY .DELETE
        const id= req.params.id;
        Movies.destroy({
            where:{id}
        }).then(()=>{
            res.redirect('/movies')
        }).catch(err=>console.log(err))
    }

}

module.exports = moviesController;