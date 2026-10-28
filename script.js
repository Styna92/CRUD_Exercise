
//evento che attende che il DOM sia completamente caricato prima di eseguire il codice 
document.addEventListener (('DOMContentLoaded'), () => {

    const API_URL = 'http://localhost:3000/todos'; //dichiarare la variabile che sarà il nostro endpoint 

    //1° step recupero tutti gli id dell'html
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task');


    function fetchTasks(){

    fetch(API_URL)  //metodo fetch che ci permette di convertire la risposta in json e mostrare i dati in console.log

        .then( res => res.json())  //converte i dati in json 
        .then(data => {   //una volta ottenuti i dati 

            // console.log(data);
            //svuotare la tabella
            taskList.innerHTML = "";

            //serve un ciclo per iterare gli elementi del json 


            //ogni riga avrà con sè i propri bottoni di edit e delete


            //ogni task ricevuto dall'endpoint devo creare un <li> dentro all <ul>
            //CHIAMATA GET IMPLICITA -> RECUPERA I DATI DEI TASK
            data.forEach(task => {
                //creo un nuovo elemento <li>
                const li = document.createElement('li');
                const span = document.createElement('span');
                //aggiungo il titolo task allo span
                span.textContent = task.title


                //bottone di completed
                const checkBtn = document.createElement('button');
                checkBtn.classList.add('toggle');
                checkBtn.textContent = task.completed ? '✔️' : '❌';  //richiamare la funzione editCheckTask TO DO
                span.classList.toggle('completed', task.completed);
                checkBtn.onclick = () => editCheckTask(task);



                //bottone di edit
                const editBtn = document.createElement('button');
                editBtn.classList.add('toggle');
                editBtn.textContent = '🪄';
                editBtn.onclick = () => editTask(task);

                //bottone di elimina   
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('toggle');
                deleteBtn.textContent ='🗑️';
                deleteBtn.onclick = () => deleteTask(task.id);

                //btnGroup
                const btnGroup = document.createElement('div');
                btnGroup.append(editBtn, checkBtn, deleteBtn);
                


                //appendo all'html il titolo del task
                li.append(span, btnGroup); //singolo
                taskList.appendChild(li); //figli di una ul



            });
        



        })
    }


    //ASSOCIARE AL CLIC dell'id  add task alla creazione 
    addTaskBtn.addEventListener('click',() => {
        //prende il valore dall'input, il trim() toglie gli spazi 
        const title = newTaskInput.value.trim();

        if (title){

            fetch(API_URL, {

                method: 'POST',  //Metodo che crea il titolo
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title, completed:false}) //crea il task

            }).then(() =>{
                
                newTaskInput.value = '';
                fetchTasks();
            })

        }

    })


    //FUNZIONE DI UPDATE PER MODIFICARE IL TITLE DEL TASK
    function editTask(task){
        //chiedo il nuovo titolo all'utente tramite prompt
        const nuovoTitolo = prompt('Modifica il titolo del task: ' , task.title);

        if(nuovoTitolo !== null && nuovoTitolo !== ''){

            fetch(`${API_URL}/${task.id}`, {

                method: 'PUT',  //Metodo che MODIFICA il titolo
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...task, title : nuovoTitolo}) //modifica il titolo del task
                //{...task} SPREAD OPERATOR 
            }).then(() =>{
                
                newTaskInput.value = '';
                fetchTasks();
            })

        }

    }


    ////////////////////////////////////////////////////////////
    //FUNZIONE DI UPDATE PER MODIFICARE IL CHECK DEL TASK  TO DO 
    function editCheckTask(task){

            fetch(`${API_URL}/${task.id}`, {
                
                method: 'PUT',  //Metodo che MODIFICA il check
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...task, completed : !task.completed}) //modifica il titolo del task
                
            }).then(() =>{
                
                fetchTasks();
            })

        }

/////////////////////////////////////////////////////////////////////


    //FUNZIONE DI DELETE PER MODIFICARE IL TITLE DEL TASK
    function deleteTask(id){

        fetch(`${API_URL}/${id}`, {

                method: 'DELETE',  //Metodo che ELIMINA il titolo
            }).then(() =>{
                //ricarico i task con il nuovo task aggiornato
                fetchTasks();
            })


        }





    fetchTasks();

});

