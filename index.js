const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment')
const http = require('https')
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');

app.get('/', (req, res) => {
    res.send("We are liveee")
})

app.post('/', express.json(), (req, res) => {

    const agent = new dfff.WebhookClient({
        request: req,
        response: res
    });

    function demo(agent) {

        var arr = ['Bombaa', 'WOOO']
        random = Math.floor(Math.random() * 2);
        agent.add(arr[random])

    }

    var res = ''
    var set;
    async function getSetosInfo(agent) {
        res = ''
        var seto = agent.parameters.Setos
        if (seto.length < 1){
            agent.add('No hemos encontrado ningún seto con ese nombre. Puedo sugerirte que me preguntes por los siguientes: ' )
        }
        
        getSeto(seto)
        await new Promise(resolve => setTimeout(resolve, 1000));

   
        if(res.length == 0){
            agent.add("No hemos encontrado ningún Thrip o Seto con ese nombre. Por favor, revisa que estás escribiendo bien el.")
            
        }else{
            agent.add('Esto es lo que te podemos decir sobre ' + seto)
            agent.add(new Card({
               title: seto,
               imageUrl: '',
               text: '',
             })
            );
            agent.add(res)
        } 
    }
    async function getThripInfo(agent){

        res = '';
        var thrip = agent.parameters.Thrips

        getThrip(thrip)
        await new Promise(resolve => setTimeout(resolve, 1000));
        if(res.length == 0){
            agent.add("No hemos encontrado ningún Thrip o Seto con ese nombre. Por favor, revisa que estás escribiendo bien el.")
            
        }else{
            agent.add("Esto te puedo contar sobre los " + thrip)
            agent.add(new Card({
               title: thrip,
               imageUrl: '',
               text: '',
             })
            );
            agent.add(res)
        }

        

    }

    function getSeto(comun){
        var seto;
        axios.get(`https://iciatools.herokuapp.com/api/setos`).then(response => {
            for(let i = 0; i < response.data.length; i++){
                
                if(comun === response.data[i].comun){
                    seto = response.data[i];
                    this.set = seto;       
                }
            }

            if(seto == undefined){
                res = ''
            }else{
                var mesesFloracion = getFloracion(seto.floracion) 
                var eenn = getEENN(seto.eenn)
                res = comun + ', también conocido científicamente como ' +  seto.cientifico + ', es un seto capaz de crecer hasta los ' + seto.porte + ' metros de altura. ' +  'Estos setos se pueden encontrar a unas alturas de entre ' + seto.altitud[0] + ' metros hasta ' + seto.altitud[1] + ' metros y tienen un color ' + seto.color + '. Su época de floración comprendería desde ' + mesesFloracion[0] + ' hasta ' + mesesFloracion[mesesFloracion.length-1] + '. Estos son los siguientes enemigos naturales a los que atrae: ' + eenn + '.';
                 
            }
               
          })
          .catch(error => {
            console.log(error);
        });
    }


    function getSetosList(){
        var setos = ''
        axios.get(`https://iciatools.herokuapp.com/api/setos`).then(response => {
             
            for(let i = 0; i < response.data.length; i++){
                setos += response.data[i].comun + ' ';         
                      
            }
         
          })
          
          .catch(error => {
            console.log(error);
        });
        return setos;
    }

    function getFloracion(floration){
        var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var res = []
        for(let i = 0; i< floration.length; i++){
            if(floration[i]==1){
                res.push(months[i])
                
            }
        }
        return res;

    }

    function getEENN(enemigos){

        var eenn = ['Orius', 'Anthocoris', 'Miridos', 'Nábidos', 'Macrococcinélidos', 'Micrococcinélidos', 'Crisopas', 'Amblyseius', 'Sírfidos', 'Cecidómidos', 'Franklinothrips', 'Aelothrips', 'Tijeretas']
        var res = [];

        for(let i = 0; i< enemigos.length; i++){
            if(enemigos[i]==1){
                res.push(' ' + eenn[i])
                
            }
        }
        return res;
    }

    function getThrip(thrip){
        var res = ''
        var trip = ''
        axios.get(`https://iciatools.herokuapp.com/api/thrips`).then(thrips => {
              
            for(let i = 0; i < thrips.data.length; i++){
                console.log(thrip[14], thrips.data[i].comun[14])
                if(thrip[14] = thrips.data[i].comun[14]){
                    trip = thrips.data[i].comun
                    console.log(thrip.comun + 'jej')
                    res = 'Los ' + thrip + ' o ' + thrips.data[i].cientifico + ' son ' + thrips.data[i].características + '. ' + thrips.data[i].comportamiento + '. Las plantas que habitan son ' + + thrips.data[i].hospedadoras + ' y ' + thrips.data[i].daños + '.'  
                }        
                      
            }
         
          })
          
          .catch(error => {
            console.log(error);
        });

        if(trip.length ==0 ){
            res = ''
        }
        

    }
    

    var intentMap = new Map();
    intentMap.set('getThripInfo', getThripInfo)
    intentMap.set('demo', demo);
    intentMap.set('getSetosInfo', getSetosInfo);
    agent.handleRequest(intentMap);

});

app.listen(3333, () => {
    console.log("Server is live on port 3333")
})