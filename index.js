const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");




/// Funcion Run ///
function AgsinarRoles(usuario) {

// Elimina todos los roles
var role1= usuario.member.roles.cache;
usuario.member.roles.remove(role1);


// Validar si esta verificado en unplayer
fetch("https://unplayer.com/api/1.0/user?type=discord&user_id="+usuario.user.id)
.then(res => res.json())
.then(json =>  {


if (json.ids.discord != false){
var idgamgtav=json.ids.gtav;
var idgamsamp=json.ids.samp;




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
return response.json();
})
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



// Crear canal con ciertos permisos
if(buscaRolOrgGTAV!=undefined){                        
usuario.member.roles.add(buscaRolOrgGTAV);



if(!buscarCanalGTAV){

usuario.guild.channels.create(datorg.name, {
type: 'voice',
permissionOverwrites: [
{
id: "745831292222046341",
deny: ['VIEW_CHANNEL'],
},
{
id: buscaRolOrgGTAV.id,
allow: ['VIEW_CHANNEL'],
},
],
});

}


}else{ 


usuario.guild.roles.create({
data:{
name:rango,
color:"#1567a8",
},
reason:"OrgGtav",
})
.then(asignaorg =>  {
usuario.member.roles.add(asignaorg)


if(!buscarCanalGTAV){

usuario.guild.channels.create(datorg.name, {
type: 'voice',
permissionOverwrites: [
{
  id: "745831292222046341",
  deny: ['VIEW_CHANNEL'],
},
{
  id: asignaorg.id,
  allow: ['VIEW_CHANNEL'],
},
],
});


}


})
}



});



}

});


}else{

// SI EL USUARIO NO TIENE GTAV

}



}


} );



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


//Si una faccion existe de lo contrario la crea    
if(buscaRolFacSamp!=undefined){
usuario.member.roles.add(buscaRolFacSamp);


if(!buscarCanalFacSamp){

usuario.guild.channels.create(SampDatFaction.name, {
type: 'voice',
permissionOverwrites: [
{
id: "745831292222046341",
deny: ['VIEW_CHANNEL'],
},
{
id: buscaRolFacSamp.id,
allow: ['VIEW_CHANNEL'],
},
],
});


}


}else{
usuario.guild.roles.create({
data:{
name:sampFacName,
color:"#783a0f",
},
reason:"FacSamp",
})
.then(asignaorg =>  {
usuario.member.roles.add(asignaorg)



if(!buscarCanalFacSamp){

usuario.guild.channels.create(SampDatFaction.name, {
type: 'voice',
permissionOverwrites: [
{
id: "745831292222046341",
deny: ['VIEW_CHANNEL'],
},
{
id: asignaorg.id,
allow: ['VIEW_CHANNEL'],
},
],
});


}


})
}






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



/// Si Exites la org de lo contrario la crear

if(buscaRolOrgSamp!=undefined){
usuario.member.roles.add(buscaRolOrgSamp);

if(!buscarCanal){

usuario.guild.channels.create(datSampOrg.name, {
type: 'voice',
permissionOverwrites: [
{
id: "745831292222046341",
deny: ['VIEW_CHANNEL'],
},
{
id: buscaRolOrgSamp.id,
allow: ['VIEW_CHANNEL'],
},
],
});


}


}else{

usuario.guild.roles.create({
data:{
name:SampOrgName,
color:"#f49351",
},
reason:"OrgSamp",
})
.then(asignaorg =>  {
usuario.member.roles.add(asignaorg)

if(!buscarCanal){

usuario.guild.channels.create(datSampOrg.name, {
type: 'voice',
permissionOverwrites: [
{
id: "745831292222046341",
deny: ['VIEW_CHANNEL'],
},
{
id: asignaorg.id,
allow: ['VIEW_CHANNEL'],
},
],
});

//////////////////////////
}else{

}


})
}


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





