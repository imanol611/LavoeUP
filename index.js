const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");




/// Funcion Run ///
function AgsinarRoles(usuario) {


  // Validar si esta verificado en unplayer
  fetch("https://unplayer.com/api/1.0/user?type=discord&user_id="+usuario.user.id)
  .then(res => res.json())
  .then(json =>  {



  try {
  // Elimina todos los roles viejos
    var role1= usuario.member.roles.cache;
    usuario.member.roles.remove(role1);
  }
  catch(err) {
  }




  if (json.ids.discord != false){

    var idgamgtav=json.ids.gtav;
    var idgamsamp=json.ids.samp;


    // Funcion para crear o add permisos 
    function addRangosCanal(rol, canal,orgrangos) {
                
      if(orgrangos== 0){
          
        canal.createOverwrite(rol, {
          VIEW_CHANNEL: true,
          MOVE_MEMBERS: true,
          PRIORITY_SPEAKER: true,
          MUTE_MEMBERS: true,
          DEAFEN_MEMBERS:true

        })
    
      }else if(orgrangos== 1){

        canal.createOverwrite(rol, {
          VIEW_CHANNEL: true,
          MOVE_MEMBERS: true,
          DEAFEN_MEMBERS:true
        })
    
        
      }else{

        canal.createOverwrite(rol, {
          VIEW_CHANNEL: true
        })
      } 

    }
    
    function verificarorg(rol,canal,datos,rangos,rangoscomplet,color){
      if(rol!=undefined){
        usuario.member.roles.add(rol);


        if(!canal){
         usuario.guild.channels.create(datos.name, {
          type: 'voice',
          permissionOverwrites: [
            {
              id: usuario.guild.id,
              deny: ['VIEW_CHANNEL'],
            },
          ],})
          .then(crearCanal =>{

            /// Añadir o crear rangos
            addRangosCanal(rol, crearCanal,rangos);


          })
          

        }else if(canal.name==datos.name){

         /// Añadir o crear rangos
         addRangosCanal(rol, canal,rangos);


        }

      }else{

        usuario.guild.roles.create({
        data:{
        name:rangoscomplet,
        color:color,
        },
        reason:"FacSamp",
        })
        .then(asignaorg =>  {
        usuario.member.roles.add(asignaorg)

        if(!canal){
        usuario.guild.channels.create(datos.name, {
           type: 'voice',
           permissionOverwrites: [
             {
               id: usuario.guild.id,
               deny: ['VIEW_CHANNEL'],
             },
           ],})
           .then(crearCanal =>{

          /// Añadir o crear rangos
          addRangosCanal(asignaorg, crearCanal,rangos);


           })
           

         }else if(canal.name==datos.name){

         /// Añadir o crear rangos
          addRangosCanal(asignaorg, canal,rangos);

         }


        })
      }
    }
    




    // GTAV ORGS
    fetch("https://unplayer.com/api/1.0/gtav/user/"+idgamgtav)
    .then(res => res.json())
    .then(json =>  {


    // Validar si el usuario tiene GTAV
    if (json.name != false){

      var nombre = json.name;
      var nivel = json.level;
      var org = json.orgs;
      var orglen = json.orgs.length;


      // Cuanta org tiene el usuarios
      if(orglen > 0){

        // Para no repectir el proceso con dos misma org en un usuario
        var NotTwoOrg = []
        /////////////////////////////////////////////////
        json.orgs.forEach(orgsGtavUser => {

        // Para no repectir el proceso con dos misma org en un usuario
        if(NotTwoOrg.includes(orgsGtavUser.org_id)==false){

          NotTwoOrg.push(orgsGtavUser.org_id);

          /////////////////////////////////////////////////

          var orgrangos = orgsGtavUser.idx;

          // Verificar el nombre de la org GTAV
          fetch('https://unplayer.com/api/1.0/gtav/org/'+orgsGtavUser.org_id)
          .then(function(response) {
          return response.json()})
          .then(datorg =>  {


          // Si es lider o sub de la org      
          if(orgrangos == 0){
            var rango =datorg.name+"(Lider)";

          }else if(orgrangos == 1){
            var rango =datorg.name+"(Sub-Lider)";
          }else{
            var rango =datorg.name;
          }



          // Buscar si ya existe su rango
          var buscaRolOrgGTAV=usuario.guild.roles.cache.find(role => role.name == rango);

          // Buscar si ya existe el canal para la org
          var buscarCanalGTAV=usuario.guild.channels.cache.find(channel => channel.name == datorg.name);

          var colorORgGtav ="#4285f4";

          verificarorg(buscaRolOrgGTAV,buscarCanalGTAV,datorg,orgrangos,rango,colorORgGtav);

          // Crear canal con ciertos permisos




          });

        }

        });

      }

    }});



    // Samp Faccion verificar si tiene samp
    if (idgamsamp != false){

      fetch('https://unplayer.com/api/1.0/samp/user/'+idgamsamp)
      .then(res => res.json())
      .then(datSamp => {

      var sampfaction =datSamp.faction_id
      var samporglen =datSamp.orgs.length


      /// Si el usuario tiene Samp Facion
      if(sampfaction != false){
        var sampFacRangos = datSamp.faction_rank_idx;


        fetch('https://unplayer.com/api/1.0/samp/faction/'+sampfaction)
        .then(res => res.json())
        .then(SampDatFaction => {

        // Si es lider o sub  
        if(sampFacRangos== 1){
          var sampFacName =SampDatFaction.name+"(Sub-Lider)";

        }else if(sampFacRangos== 0){
          var sampFacName =SampDatFaction.name+"(Lider)";
        }else{
          var sampFacName =SampDatFaction.name;
        }


        // Buscar el rol de su rango
        var buscaRolFacSamp=usuario.guild.roles.cache.find(role => role.name == sampFacName);

        // Buscar el canal de su org
        var buscarCanalFacSamp=usuario.guild.channels.cache.find(channel => channel.name ==  SampDatFaction.name);

        var colorFacSamp ="#34a853";


        //Si una faccion existe de lo contrario la crea    

         verificarorg(buscaRolFacSamp,buscarCanalFacSamp,SampDatFaction,sampFacRangos,sampFacName,colorFacSamp);

        });


      }



      /// Samp Org verificar la cantidades de org que tiene el usuario
      if(samporglen > 0){

        // Para no repetir el proceso con la misma org
        var NotTwoOrgSamp = []
        //////////////////////////

        datSamp.orgs.forEach(orgsSampUser =>  { 


        // Para no repetir el proceso con la misma org
        if(NotTwoOrgSamp.includes(orgsSampUser.org_id)==false){

          NotTwoOrgSamp.push(orgsSampUser.org_id);
          //////////////////////////

          var sampOrgRangos = orgsSampUser.idx;
          var sampOrgId = orgsSampUser.org_id;

          // Buscar el nombre de la orgs del usuario
          fetch('https://unplayer.com/api/1.0/samp/org/'+sampOrgId)
          .then(res => res.json())
          .then(datSampOrg => {

          /// Si es lide o sub
          if(sampOrgRangos== 1){
            var SampOrgName =datSampOrg.name+"(Sub-Lider)";
          }else if(sampOrgRangos== 0){
            var SampOrgName =datSampOrg.name+"(Lider)";
          }else{
            var SampOrgName =datSampOrg.name;
          }

          // Verificar si el ranngos del usuario existe
          var buscaRolOrgSamp=usuario.guild.roles.cache.find(role => role.name == SampOrgName);

          // Verificar si el canal de la org existe
          var buscarCanal=usuario.guild.channels.cache.find(channel => channel.name == datSampOrg.name);

          var colorOrgSamp ="#ea4335";


          /// Si Exites la org de lo contrario la crear

           verificarorg(buscaRolOrgSamp,buscarCanal,datSampOrg,sampOrgRangos,SampOrgName,colorOrgSamp);


          });
        }

        });

      }


      });


      }else{
      // Si el usuario no tiene samp
      }


    }


  } );



}




// Recargar rangos cada vez que usuario conecte
client.on('presenceUpdate', (oldPresence, newPresence) => {

  if(newPresence.status == 'online') {  
    AgsinarRoles(newPresence);

  }
});






client.login('TOKEN');





