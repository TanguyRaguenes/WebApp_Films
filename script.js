const  titreFilm = document.querySelector('#titreFilm');
const btn_rechercher = document.getElementById('btn_rechercher');
const btn_acteurs_suivants = document.getElementById('btn_acteurs_suivants');
const btn_acteurs_precedents = document.getElementById('btn_acteurs_precedents');

const btn_retour = document.getElementById('btn_retour');
const btn_films_precedents = document.getElementById('btn_films_precedents');
const btn_films_suivants = document.getElementById('btn_films_suivants');



const photoActeurs = document.querySelectorAll('.photoActeurs');
const photoFilmographie = document.querySelectorAll('.photoFilmographie');

const ctner_détails_acteur = document.getElementById('ctner_détails_acteur');

const input_recherche = document.getElementById('input_recherche');

let casting=[];
let filmographieActeur=[];

let idCasting = 0;
let idFilmographie = 0;

let idFilm = 157336;

let titresFilms =[];


input_recherche.addEventListener('click',()=>{
    input_recherche.value="";
})


// FILMOGRAPHIE'______________________________________________________________________________________________________'


btn_films_suivants.addEventListener("click", ()=>{

    idFilmographie+=5
    ctrlIdFilmographie()
    afficherFilmographie();
    
});

btn_films_precedents.addEventListener("click", ()=>{

    idFilmographie-=5
    ctrlIdFilmographie()
    afficherFilmographie();
    
});

function ctrlIdFilmographie(){
    if(idFilmographie+5>filmographieActeur.length){
        idFilmographie=filmographieActeur.length-6;
    }else if(idFilmographie<0){
        idFilmographie=0;
    }
}


photoActeurs.forEach((e)=>{
    e.addEventListener('click', ()=>{
        const idActeur = Number(e.id.substring(e.id.length-1))+idCasting;
        requeterInfosActeur(casting[idActeur].id);
    })
})

function requeterInfosActeur(id){
    idFilmographie=0;
    fetch('https://api.themoviedb.org/3/person/' + id + '/movie_credits?api_key=b642a2df5b6d3048d4f07cd2a377518c&language=en-US')
    .then((response)=>{
        response.json()
        .then((json)=>{

            filmographieActeur=json.cast;
            filmographieActeur.sort(function trie(a,b){

                if (a.release_date ==""){
                    date1="1000-01-01"
                }else{
                    date1 = new Date(a.release_date)
                }

                if (b.release_date == ""){
                    date2="1000-01-01"
                }else{
                    date2 = new Date(b.release_date)
                }

                return date2 - date1;
            });

            afficherFilmographie();
        });
    });
};



function afficherFilmographie(){

    console.log(filmographieActeur);
    console.log(filmographieActeur.length);

    for (let i=0 ;i<=photoFilmographie.length-1 ;i++){

        document.getElementById('photoFilmographie'+i).src ="no_img_found_2.png"
        document.getElementById('titreFilmographie'+i).textContent = "_";
        

        try{
            const adresseImage = 'https://image.tmdb.org/t/p/w500/' + filmographieActeur[idFilmographie+i].backdrop_path;
            const titreFilm = filmographieActeur[idFilmographie+i].original_title + "_" + filmographieActeur[idFilmographie+i].release_date;
        

            document.getElementById('photoFilmographie'+i).src = adresseImage;
            document.getElementById('titreFilmographie'+i).textContent = titreFilm;
        }
        catch(e){
            console.log("Erreur_afficherFilmographie : " + e)
        }

    }

    ctner_détails_acteur.classList.remove('slide-out');
    ctner_détails_acteur.classList.add('slide-in');
    
}

btn_retour.addEventListener('click',()=>{
    ctner_détails_acteur.classList.remove('slide-in');
    ctner_détails_acteur.classList.add('slide-out');
});



// ALIMENTER RECHERCHE '______________________________________________________________________________________________________'

fetch('https://api.themoviedb.org/3/movie/popular?api_key=b642a2df5b6d3048d4f07cd2a377518c&language=en-US&page=1')
.then((response)=>{
    response.json()
    .then((json)=>{

    })
});



// RECHERCHE FILM'______________________________________________________________________________________________________'


btn_rechercher.addEventListener('click', ()=>{
    const filmRecherche = document.getElementById('input_recherche').value;
    requetebtn_rechercher(filmRecherche);
});

function requetebtn_rechercher(filmRecherche){
    console.log ('Film recherché : ' + filmRecherche)
    fetch('https://api.themoviedb.org/3/search/movie?api_key=b642a2df5b6d3048d4f07cd2a377518c&query=' + filmRecherche + '&include_adult=false&language=en-US&page=1')
    .then ((response)=>{
        response.json()
        .then((json)=>{
            idFilm = json.results[0].id;
            console.log(idFilm);
            appelerRequetes();
        })
    })


};


// ACTEURS'______________________________________________________________________________________________________'

btn_acteurs_suivants.addEventListener('click',()=>{
    idCasting+=5;
    
    ctrlIdCasting()
    afficherActeur(idCasting);
});

btn_acteurs_precedents.addEventListener('click',()=>{
    idCasting-=5;

    ctrlIdCasting()
    afficherActeur(idCasting);

});

function ctrlIdCasting(){
    if(idCasting+5>casting.length){
        idCasting=casting.length-6;
    }else if(idCasting<0){
        idCasting=0;
    }
}

function afficherActeur(x){

    for (let i=x;i<=x+photoActeurs.length-1;i++){
        try{
            document.getElementById('photoActeur' +(i-x)).src = 'https://image.tmdb.org/t/p/w500/' + casting[i].profile_path;
            document.getElementById('nomActeur' + (i-x)).textContent = casting[i].name;
        }
        catch(e){
            console.log("Erreur_afficherActeur : " + e)
        }

    };

};

function requeterInfosCasting(){

    fetch('https://api.themoviedb.org/3/movie/' + idFilm + '/credits?api_key=b642a2df5b6d3048d4f07cd2a377518c')
    .then((response)=>{
     
            response.json()

            .then((json)=>{

                casting=json.cast;
                idCasting=0;
                afficherActeur(idCasting);
                
            });

    })
};

// FILM'______________________________________________________________________________________________________'


function requeterInfosFilm(){

    fetch('https://api.themoviedb.org/3/movie/' + idFilm + '?api_key=b642a2df5b6d3048d4f07cd2a377518c')
    .then ((response)=>{

        if (response.status ==200){

            response.json()
            .then ((json)=>{

                titreFilm.textContent=json.original_title;

                const adresseImage1 = 'https://image.tmdb.org/t/p/w500/' + json.poster_path;
                document.getElementById('img_film_avant').src = adresseImage1;

                const adresseImage2 = 'https://image.tmdb.org/t/p/w500/' + json.backdrop_path;
                document.getElementById('img_film_arriere').src = adresseImage2;

                document.getElementById('slogan').innerText= json.tagline;
                document.getElementById('synopsis').innerText=json.overview;
                document.getElementById('budget').innerText=json.budget.toLocaleString() + "€";
                document.getElementById('gains').innerText=json.revenue.toLocaleString() + "€";
                document.getElementById('popularite').innerText=json.popularity;
                document.getElementById('note').innerText=Math.round(json.vote_average*100)/100 +"/10";
                document.getElementById('nombreVotes').innerText=json.vote_count.toLocaleString();
                const dateBonFormat = json.release_date.substring(8,10)+"/"+ json.release_date.substring(5,7)+"/"+ json.release_date.substring(0,4)
                document.getElementById('dateSortie').innerText=dateBonFormat ;
                document.getElementById('duree').innerText=json.runtime + " minutes";
                document.getElementById('siteOfficiel').innerText=json.homepage;
                
                const tableauGenres = json.genres;
                liste_genres.innerHTML=``;

                tableauGenres.forEach(element => {
                    genresFilm =document.querySelector("#liste_genres");
                    let li = document.createElement('li');
                    li.innerHTML = element.name;
                    genresFilm.append(li);
    
                    
                });
            });

        }else{
            idFilm++;
            appelerRequetes();
        }
        
    });
};


function appelerRequetes(){

    requeterInfosFilm();
    requeterInfosCasting();
    
};

(()=>appelerRequetes())();

// http://files.tmdb.org/p/exports/movie_ids_03_06_2024.json.gz
// la date est importante car tout l'historique n'est pas conservé
// elle est au format MM-JJ-AAAA








