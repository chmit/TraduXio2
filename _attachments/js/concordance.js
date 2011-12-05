/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



function recherche_termes(termes,parametre){
    const WORD_CUTTER = /[\s\.;:\-,\!\?\)\(\]\[\{\}\'\`\‘\’\"\″\“\”\«\»\\\/]/g;     
    termes=termes.replace(WORD_CUTTER," ");
    //Pour le nom de la vu ce n'est pas évident : nom doc design/nom_vue (sans compter le "_design/")
    
    
    
    $.couch.db("traduxio3").view("traduxio3/search", {
                                    
        key:termes,
        success:function(data){
            parametre(data);

        }
                                         
    });
    
}

function affichage_resultats(donnees){
    $('#content').remove();
    $('body').append('<div id="content">');
    $('#content').append('<table>');
    var label_bloc;
    var id = 0;
    
    for(label_bloc in donnees.rows){
        id++;
        var bloc = donnees.rows[label_bloc].value;
        
        var bloc_a_traduire = {};
        var bloc_traduit = {};
        
        if(bloc.sens == "original_traduction"){
            bloc_a_traduire['titre'] = bloc.infos_texte.titre;
            bloc_a_traduire['auteur'] = bloc.infos_texte.auteur;
            bloc_a_traduire['langue'] = bloc.infos_texte.langue_originale;
            bloc_a_traduire['contenu'] = bloc.contenu_bloc_original;
                
            bloc_traduit['titre'] = bloc.infos_traduction.titre;
            bloc_traduit['auteur']= bloc.infos_traduction.traducteur;
            bloc_traduit['langue']= bloc.infos_traduction.langue;
            bloc_traduit['contenu']= bloc.contenu_bloc_traduit;
                    
        } else if(bloc.sens == "traduction_original"){
                
            bloc_a_traduire['titre'] = bloc.infos_traduction.titre;
            bloc_a_traduire['auteur']= bloc.infos_traduction.traducteur;
            bloc_a_traduire['langue']= bloc.infos_traduction.langue;
            bloc_a_traduire['contenu']= bloc.contenu_bloc_traduit;
                    
            bloc_traduit['titre'] = bloc.infos_texte.titre;
            bloc_traduit['auteur'] = bloc.infos_texte.auteur;
            bloc_traduit['langue'] = bloc.infos_texte.langue_originale;
            bloc_traduit['contenu'] = bloc.contenu_bloc_original;
        }
                
                
        $('#content table').append('<tr id="'+id+bloc.sens+'">');
        $('#content table tr#'+id+bloc.sens).append('<td class="info-bloc-a-traduire">'+bloc_a_traduire.titre+'<br>'+bloc_a_traduire.langue+'<br>'+bloc_a_traduire.auteur);
        $('#content table tr#'+id+bloc.sens).append('<td class="bloc-a-traduire">'+bloc_a_traduire.contenu);
        $('#content table tr#'+id+bloc.sens).append('<td class = "bloc-traduit">'+bloc_traduit.contenu);
        $('#content table tr#'+id+bloc.sens).append('<td class="info-bloc-traduit">'+bloc_traduit.titre+'<br>'+bloc_traduit.langue+'<br>'+bloc_traduit.auteur);
    }
                
    
}

//Sépare les mots pour les surligner
function highlight_termes(objet_jquery,termes){
    var liste_termes = termes.split(" ");
    var terme;
    for(terme in liste_termes){
        var reg=new RegExp('\\*', "gi");
        var terme_replace = liste_termes[terme].replace(reg,"");
        liste_termes[terme].replace(reg,"");
        reg=new RegExp('\\?', "gi");
        terme_replace = terme_replace.replace(reg,"");
        reg=new RegExp('\\(', "gi");
        terme_replace = terme_replace.replace(reg,"");
        reg=new RegExp('\\)', "gi");
        terme_replace = terme_replace.replace(reg,"");
        reg=new RegExp('\\"', "gi");
        terme_replace = terme_replace.replace(reg,"");
        objet_jquery.highlight(terme_replace);
       
    }
    
    return termes;
}

//Evenement du click sur le bouton de recherche
$("#form_recherche #form_recherche_submit").click(
    function(){
        recherche_termes($("#form_recherche #form_recherche_field_recherche").val(),
            function(donnees){
                affichage_resultats(donnees);
                
                highlight_termes($('#content'), $("#form_recherche #form_recherche_field_recherche").val());
            }
            );
        
    }

    );
    


