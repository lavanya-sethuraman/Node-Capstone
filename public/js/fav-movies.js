$(function () {
    $('.js-search-results').hide();
    getFavMovieCount();
    getFavMovieDetails();

    var viewportWidth = $(window).width();
if (viewportWidth <= 500) {
  console.log('width is changing');
  $('.full-menu').css('display', 'none');
}
    //Sidebar Toggle
    $('.ui.fixed.button').click(function (e) {
        e.preventDefault();
        $('.ui.sidebar').sidebar('toggle');
    });


    //User Log-out    
    $('.log-out').click(function () {
        $.getJSON('/users/logout', function () {
            console.log('user logged out');
        });
    });
});//End of JQuery Line


//Display number of favorite movies
function getFavMovieCount() {
    $.getJSON('/users/favorites', function (data) {
        favoriteMovies = data;
        $('.fav-movies').html(data.length);
    });
}

//Get favorite Movie details
function getFavMovieDetails() {
    $.getJSON('/movies/fav-movies', function (data) {
        for (var i = 0; i < favoriteMovies.length; i++) {
            if (favoriteMovies[i].movieId === data[i].MovieId) {
                data[i].dateAdded = favoriteMovies[i].dateAdded;
                data[i].comment = favoriteMovies[i].comment;
            }
        }
        displaySearchData(data);
    });
}

//Display details of the favorite Movies
function displaySearchData(dataJson) {
    $('.js-search-results').html('');
    var html = "";
    html += '<div class="ui small images">';
    dataJson.forEach(function (movie) {
        console.log(movie.comment)
        var genreElement = " ";
        var castElement = " ";
        movie.Genre.forEach(function (genre) {
            genreElement += '<div class="ui tag red label">' + genre.name + '</div>';
        });
        if (movie.CastInfo !== undefined) {
            movie.CastInfo.forEach(function (cast) {
                castElement += '<div class="item"><div class="header">' + cast.castName + '</div> As ' + cast.characterName + '</div>';
            });
        }
        html += '<div class="ui small spaced image"><div class="ui black ribbon label"><i class="plus icon"></i>' + movie.dateAdded + '</div>' +
            '<a class="modal-show" id="' + movie.MovieId + '"><img src="https://image.tmdb.org/t/p/w500' + movie.Poster + '"></a></div>' +
            '<div class="ui modal ' + movie.MovieId + '"><i class="close icon"></i><div class="header">' + movie.Title +
            '</div><div class="image content"><div class="ui image"><img src="https://image.tmdb.org/t/p/w500' + movie.Poster + '">' +
            '</div><div class="description"><div class="ui header">' + movie.Overview +'<p>Your Comment</p><p>'+ movie.comment +'</p>'+
            '</div><div class="ui horizontal list"><div class="item"><div class="header">Released On:' + movie.Release_Date + '</div></div>' +
            '<div class="item"><div class="header">Run-time:' + movie.Duration + ' Minutes</div>' +
            '</div></div><div class="ui header">Rating:' + movie.Rating + '</div><p>Genre:</p>' + genreElement +
            '<p></p><p>Cast:</p><div class="ui list">' + castElement + '</div></div></div>' +
            '<div class="actions"><div class="ui negative labeled icon button">Delete from favorites!<i class="remove icon"></i>' +
            '</div></div></div>';

    });
    html += '</div>';
    $('.js-search-results').html(html);

    $('.modal-show').click(function () {
        var modalClass = '.ui.modal.' + $(this).attr('id');
        var movieId = $(this).attr('id');
        $(modalClass).modal({
            onDeny: function () {
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then(function () {
                    $.ajax({
                        url: '/movies/delete',
                        data: { movieId: movieId },
                        type: 'DELETE'
                    })
                        .done(function (data) {
                            getFavMovieCount();
                            getFavMovieDetails();
                        })
                        .fail(function (error) {
                            console.log('Error Occured.',error);
                        });
                    swal(
                        'Deleted!',
                        'Movie has been deleted from your favorite list.',
                        'success'
                    )
                })
            }
        }).modal('show');
    });
    $('.js-search-results').show();
}