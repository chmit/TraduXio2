/* 
 * Permet pour l'instant de gérer le "OU" et les expressions entre guillemets
 */


function(doc) {
    
    const WORD_CUTTER = /[\s\.;:\-,\!\?\)\(\]\[\{\}\'\`\‘\’\"\″\“\”\«\»\\\/]/g;
    
    /**
                On essaye de générer chaque expression suivant le mot :
                par exemple pour "bonjour de suis william" on a dans cet ordre
                ["bonjour"]
                 ["bonjour je"]
                ["bonjour je suis"]
                ["bonjour je suis william"]
                ["je"]
                ["je suis"]
               ["je suis william"]
    
    content est une chaîne de caractères servant à fabriquer les clés
    value est un objet à afficher dans emit
 */
 
 
    function index_content(content,value){
        //On remplace tous les caractères que l'on ne veut pas chercher par des espaces
        //pour que les mots soient séparés.
        var words = content.replace(WORD_CUTTER, " ").split(" ");
        for(var word_id=0; word_id <words.length;word_id++){
            var txt= words[word_id].replace(WORD_CUTTER, "");
            //emit du mot
            emit(txt,value);
        
            //Ajout de la possibilité d'utiliser *

            // * Après la chaine
            var caracters_add = "";
            for(var caracter_id=0;caracter_id<txt.length -1;caracter_id++){
                caracters_add = caracters_add + txt[caracter_id];
                emit(caracters_add+"*",value);
                

            }
        
            //* Avant la chaîne
            caracters_add = "";
            for(caracter_id = txt.length -1 ;caracter_id > 0 ; caracter_id--){
                caracters_add =txt[caracter_id]+caracters_add ;
                emit("*"+caracters_add,value);
                
            }
        
            
            var strings_add = txt;
       
            for (var i =word_id+1;i<words.length;i++){
                strings_add = strings_add + " " +  words[i];
                
                //emit de tous les morceaux de phrase suivant le mot
                emit(strings_add,value);
 
            }
        }
    
    }

    if(doc.type == "texte"){
       
        
        
        for(var traduction_id in doc.traductions){
            
            
            //Indexation des blocs des traductions (sens traduction_original)
            for( var bloc_id in doc.traductions[traduction_id].blocs){
                var bloc = doc.traductions[traduction_id].blocs[bloc_id];
               
                //Indexation des blocs traduits
                var  value_traduction_original={
                    "sens" : "traduction_original",
                    "contenu_bloc_traduit":bloc.contenu,
                    "contenu_bloc_original":doc.contenu.substring(bloc.debut,bloc.fin),
                    "infos_texte":{
                        "annee":doc.annee,
                        "auteur":doc.auteur,
                        "langue_originale":doc.langue_originale,
                        "titre":doc.titre
                       
                    },
                    "infos_traduction":{
                        "langue":doc.traductions[traduction_id].langue,
                        "traducteur":doc.traductions[traduction_id].traducteur,
                        "titre":doc.traductions[traduction_id].titre
                       
                    }
                   
                   
                };
                index_content(bloc.contenu,value_traduction_original);
                
                //Indexation des blocs du contenu original (sens original_traduction)
                
                var  value_original_traduction={
                    "sens" : "original_traduction",
                    "contenu_bloc_traduit":bloc.contenu,
                    "contenu_bloc_original":doc.contenu.substring(bloc.debut,bloc.fin),
                    "infos_texte":{
                        "annee":doc.annee,
                        "auteur":doc.auteur,
                        "langue_originale":doc.langue_originale,
                        "titre":doc.titre
                       
                    },
                    "infos_traduction":{
                        "langue":doc.traductions[traduction_id].langue,
                        "traducteur":doc.traductions[traduction_id].traducteur,
                        "titre":doc.traductions[traduction_id].titre
                       
                    }
                   
                   
                };
                
               
                index_content(doc.contenu.substring(bloc.debut,bloc.fin),value_original_traduction);
                
            }
        }
       
        
    }
    
}
