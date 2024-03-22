const  titreFilm = document.querySelector('#titreFilm');
const btn_rechercher = document.getElementById('btn_rechercher');
const btn_acteur_suivant = document.getElementById('btn_acteur_suivant');
const btn_acteur_precedent = document.getElementById('btn_acteur_precedent');
const boutonFilmographieSuivant = document.getElementById('boutonFilmographieSuivant');
const boutonRetour = document.getElementById('boutonRetour');
const photoActeurs = document.querySelectorAll('.photoActeurs');
const filmsActeur = document.getElementById('infosActeur');

let casting=[];
let filmographieActeur=[];

let idCasting = 0;
let idFilmographie = 0;

let idFilm = 385687;

let titresFilms =[];

// -------------------------------------------------------------------------

fetch('https://api.themoviedb.org/3/movie/popular?api_key=b642a2df5b6d3048d4f07cd2a377518c&language=en-US&page=1')
.then((response)=>{
    console.log(response);
    response.json()
    .then((json)=>{
        console.log(json);
        console.log(json.total_pages);
        const nbPages = json.total_pages;
        alimenterListeFilms ();
    })
});

function alimenterListeFilms() {
    titresFilms = [];
    console.log("________________________________________");
    une().then(deux);
}

function une() {

    console.log("_1_");

    return new Promise((resolve, reject) => {
        let tableauDePromesses = [];
        for (let i = 1; i <= 10; i++) {
            tableauDePromesses.push(fetch('https://api.themoviedb.org/3/movie/popular?api_key=b642a2df5b6d3048d4f07cd2a377518c&language=en-US&page=' + i)
                .then(response => response.json())
                .then(json => {
                    let films = json.results;
                    films.forEach(element => titresFilms.push(element.original_title));
                })
            );
        }
        // fetch créé une promesse à chaque fois que l'on stocke dans un tableau
        Promise.all(tableauDePromesses).then(resolve).catch(reject);
    });
}

function deux() {
    console.log("_2_");
    console.log(titresFilms);
    const listeFilms = document.getElementById('listeFilms');
    titresFilms.forEach(e => {
        const option = document.createElement('option');
        option.value = e;
        listeFilms.appendChild(option);
    });
}



// function alimenterListeFilms(){

//     titresFilms=[];

//     console.log("DEBUT");
//     une(deux);
    

// };


//     function une(callback){
//         for(let i=1;i<=10;i++){
//             fetch('https://api.themoviedb.org/3/movie/popular?api_key=b642a2df5b6d3048d4f07cd2a377518c&language=en-US&page=' + i)
//             .then((response)=>{
//                 response.json()
//                 .then((json)=>{
//                     // console.log(json);
//                     let films = json.results;
//                     // console.log(films);
                    
//                     films.map((element,key,array)=>{
//                         // console.log(element.original_title);
                        
//                         titresFilms.push(element.original_title);
//                         // console.log(element.original_title);
//                     })

//                     // console.log(titresFilms);
//                 });


//             });
//         };

//         setTimeout(()=>{
//             callback();
//         },500)
        
//     }

//     function deux(){

//         console.log(titresFilms[0]);

//         console.log(titresFilms);
//         console.log(titresFilms[0]);
        
//         const listeFilms = document.getElementById('listeFilms');

//         titresFilms.forEach((e)=>{
//             const option = document.createElement('option');
        
//             option.value = e;
//             listeFilms.appendChild(option);
//         });

//     }

// -------------------------------------------------------------------------

// boutonAfficher.addEventListener('click',()=>{
//     alimenterListeFilms();
//     // afficher(filmsActeur);
// });

boutonRetour.addEventListener('click',()=>{
    masquer(filmsActeur);
});

function afficher(e){

    if (e.classList.contains('slide-out')){
        e.classList.remove('slide-out');
    }

    if (e.classList.contains('slide-in')){
        e.classList.remove('animation-fade-in');
        setTimeout(()=>{
            e.classList.add('animation-fade-in');
        },0)
        
    }else{
        e.classList.add('slide-in');
    }

};

function masquer(e){

    if (e.classList.contains('slide-in')){
        e.classList.remove('slide-in');
    }
    e.classList.add('slide-out');

};


function afficherFilmographie(){

    for (let i=0 ;i<=11 ;i++){
        const adresseImage = 'https://image.tmdb.org/t/p/w500/' + filmographieActeur[idFilmographie+i].backdrop_path;
        const titreFilm = filmographieActeur[idFilmographie+i].original_title + "_" + filmographieActeur[idFilmographie+i].release_date;
    
        document.getElementById('photoFilmographie'+i).src = adresseImage;
        document.getElementById('titreFilmographie'+i).textContent = titreFilm;
    }

    afficher(filmsActeur);
    

}

boutonFilmographieSuivant.addEventListener("click", ()=>{
    if(idFilmographie+22<=filmographieActeur.length){
        const increment = 11;
        idFilmographie=idFilmographie+increment;
    }else{
        // console.log("limite");
        idFilmographie=filmographieActeur.length-12;
    }

    afficherFilmographie();
    
});

// -------------------------------------------------------------------------


btn_rechercher.addEventListener('click', ()=>{
    const filmRecherche = document.getElementById('boiteDialogueFilmRecherche').value;
    requetebtn_rechercher(filmRecherche);
});




photoActeurs.forEach((e)=>{
    e.addEventListener('click', ()=>{
        const idActeur = Number(e.id.substring(e.id.length-1))+idCasting;
        // console.log("idCasting : " + idCasting)
        // console.log("idActeur : " + idActeur)
        // console.log(e.id.substring(e.id.length-1,e.id.length));
        // attention le substring c'est de tel caractère à tel caractère
        // et non pas de tel caractère + le nombre de caractères souhaités
        // attention une chaine = tableau donc commence à 0
        // console.log(casting[idActeur].name);
        // console.log(casting[idActeur]);
        requeterInfosActeur(casting[idActeur].id);
    })
})

function requeterInfosActeur(id){
    idFilmographie=0;
    fetch('https://api.themoviedb.org/3/person/' + id + '/movie_credits?api_key=b642a2df5b6d3048d4f07cd2a377518c&language=en-US')
    .then((response)=>{
        console.log(response)
        response.json()
        .then((json)=>{
            console.log(json);
            filmographieActeur=json.cast;

            filmographieActeur.sort(function trie(a,b){
                // console.log(a.release_date);
                // console.log(b.release_date);

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

                // console.log("date1 : " + date1);
                // console.log("date2 : " + date2);

                return date2 - date1;
            });

            // console.log(filmographieActeur);
            afficherFilmographie();
        });
    });
};

'______________________________________________________________________________________________________'

btn_acteur_suivant.addEventListener('click',()=>{
    idCasting++;
    ctrlIdCasting()
    afficherActeur(idCasting);
});

btn_acteur_precedent.addEventListener('click',()=>{
    idCasting--;
    ctrlIdCasting()
    afficherActeur(idCasting);

});

function ctrlIdCasting(){

    if(idCasting>casting.length-photoActeurs.length){
        idCasting=casting.length-photoActeurs.length;
    }else if(idCasting<0){
        idCasting=0;
    }
}

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



function afficherActeur(x){

    for (let i=x;i<=x+photoActeurs.length-1;i++){
        document.getElementById('photoActeur' +(i-x + 1)).src = 'https://image.tmdb.org/t/p/w500/' + casting[i].profile_path;
        document.getElementById('nomActeur' + (i-x + 1)).textContent = casting[i].name;
    };

};

'______________________________________________________________________________________________________'

function requeterInfosFilm(){

    fetch('https://api.themoviedb.org/3/movie/' + idFilm + '?api_key=b642a2df5b6d3048d4f07cd2a377518c')
    .then ((response)=>{
        // console.log(response);

        if (response.status ==200){

            response.json()
            .then ((json)=>{
                // console.log(json);

                titreFilm.textContent=json.original_title;

                const adresseImage1 = 'https://image.tmdb.org/t/p/w500/' + json.poster_path;
                // console.log(adresseImage1);
                document.getElementById('img_film_avant').src = adresseImage1;

                const adresseImage2 = 'https://image.tmdb.org/t/p/w500/' + json.backdrop_path;
                document.getElementById('img_film_arriere').src = adresseImage2;

                document.getElementById('slogan').innerText= json.tagline;
                document.getElementById('synopsis').innerText=json.overview;
                document.getElementById('budget').innerText=json.budget.toLocaleString();
                document.getElementById('gains').innerText=json.revenue.toLocaleString();
                document.getElementById('popularite').innerText=json.popularity;
                document.getElementById('note').innerText=Math.round(json.vote_average*100)/100;
                // var nombre = 5.56845;
                // arrondi = nombre*100; → 556.845
                // arrondi = Math.round(arrondi); → 556
                // arrondi = arrondi/100; → 5.56
                document.getElementById('nombreVotes').innerText=json.vote_count.toLocaleString();
                const dateBonFormat = json.release_date.substring(8,10)+"/"+ json.release_date.substring(5,7)+"/"+ json.release_date.substring(0,4)
                document.getElementById('dateSortie').innerText=dateBonFormat ;
                document.getElementById('duree').innerText=json.runtime;
                document.getElementById('siteOfficiel').innerText=json.homepage;
                
                const tableauGenres = json.genres;
                liste_genres.innerHTML=``;

                tableauGenres.forEach(element => {
                    // console.log(element.name);
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

function requetebtn_rechercher(filmRecherche){
    // console.log ('Film recherché : ' + filmRecherche)
    fetch('https://api.themoviedb.org/3/search/movie?api_key=b642a2df5b6d3048d4f07cd2a377518c&query=' + filmRecherche + '&include_adult=false&language=en-US&page=1')
    .then ((response)=>{
        // console.log(response);
        response.json()
        .then((json)=>{
            // console.log(json);
            idFilm = json.results[0].id;
            appelerRequetes();
        })
    })


};

function appelerRequetes(){

    // console.log("_______________________________________________");
    console.log("Film ID : " + idFilm);

    requeterInfosFilm();
    requeterInfosCasting();
    
};

(()=>appelerRequetes())();

// http://files.tmdb.org/p/exports/movie_ids_03_06_2024.json.gz
// la date est importante car tout l'historique n'est pas conservé
// elle est au format MM-JJ-AAAA








