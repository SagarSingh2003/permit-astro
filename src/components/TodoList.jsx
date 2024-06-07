import {useState , useEffect} from 'react';
import { createClient } from '@supabase/supabase-js';
import { useStore } from '@nanostores/react';
import {session} from '../store/sessionStore.js';
import {userData} from "../store/userData.js";
import {todoList} from "../store/todoList.js";
import { jwtDecode } from "jwt-decode";

export default function TodoList(){

    const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_KEY);
    const $todoList = useStore(todoList);
    const $session = useStore(session);
    const $userData = useStore(userData);
    const [creatingState , setCreatingState] = useState(false);
    const [updatingState , setUpdatingState] = useState({});
    
    
        


    useEffect(() => {
    
      getTodoData();
    
      console.log("getting session value ...");

      const sessionValue = localStorage.getItem("session");

      if(sessionValue) {
          session.set(sessionValue)
          console.log(sessionValue);
          const decoded = jwtDecode(sessionValue);  
          userData.set({id : decoded.sub , email: decoded.email});
      };
     
    } , []);

    async function logout(){
    
        const { error } = await supabase.auth.signOut()
        console.log(error);
    
        localStorage.removeItem("session");
        session.set(null);
    
    }



    async function getTodoData(){
            
                
        let { data: TODOS, error } = await supabase
        .from('TODOS')
        .select('*')

        
        todoList.set(TODOS);

        console.log(error);
        console.log(TODOS);
        return ;              
    }


    async function createTodo(todo){


        if(todo.trim() !== ""){

        const res = await fetch(`http://localhost:4321/api/getPermissions.json?id=${$userData.id}&operation=create`)
        
        const response = await res.json();

        if(response.status === "permitted"){
            setCreatingState(true);
            const inputElement = document.getElementById("input");
            inputElement.value = "creating...";
            
            const { error } = await supabase
            .from('TODOS')
            .insert({ todo : todo})

            console.log(error);
            if(!error){
            inputElement.value = "";
            setCreatingState(false);
            getTodoData();
            }
        }
    
        }

    }
    

    async function markAsDone(todo_id){
        
        const res = await fetch(`http://localhost:4321/api/getPermissions.json?id=${$userData.id}&operation=update`)
        
        const response = await res.json();
        if(response.status === "permitted"){
        
        const { error } = await supabase
        .from('TODOS')
        .update({ isdone: true })
        .eq('id', todo_id);


        console.log(error);
        if(!error){
          getTodoData();
        }
        }
    }

    async function editTodo(todo_id){
        
        const res = await fetch(`http://localhost:4321/api/getPermissions.json?id=${$userData.id}&operation=update`)
        
        const response = await res.json();
        if(response.status === "permitted"){
            
            // todoRef.current.value = "";
            setUpdatingState({id : todo_id});
            
        }
    } 

    async function saveChanges(todo_id , todo_value){
        const { error } = await supabase
            .from('TODOS')
            .update({ todo : todo_value})
            .eq('id', todo_id);


            console.log(error);
            if(!error){
            setUpdatingState({id : null});
            getTodoData();
            }
    }


    async function deleteTodo(todo_id){
        
        const res = await fetch(`http://localhost:4321/api/getPermissions.json?id=${$userData.id}&operation=delete`)
        
        const response = await res.json();
        if(response.status === "permitted"){
        
        const { error } = await supabase
        .from('TODOS')
        .delete()
        .eq('id', todo_id);


        console.log(error);
        if(!error){
          getTodoData();
        }
        }
    }

    console.log($todoList);
    console.log($session);
    console.log($userData);

    return (
    <section className='main-container'>
            <section className='header'>
                <span className='logo'>TODO ORG</span>
                {$session && $userData.email ? 
                  <section className='row '>
                    <span className='rounded email'>{$userData.email.slice(0, 2 )}</span>
                    <span className='auth-ops' onClick={() => {
                      logout();
                    }}>Logout</span>
                  </section>
                : 
                 <section className='auth' onClick={() => {window.location = "/auth"}}>
                    <span className='auth-ops'> sign up </span>
                </section>
                }
            </section>
            <section className='input-container'>
                <input  type='text' className='textbox' id="input" placeholder='ENTER TODO ITEM' ></input>
                <button className='create-btn' onClick={() => {
                  createTodo(document.getElementById("input").value);
                }}>+</button>
            </section>
            <section className='todoList'>
                {$todoList && $todoList.length !== 0 ? 
                $todoList.map((todo) => {

                  return  (
                    <section className='todo-container'>
                        <section className='todos'>
                          <section className='row'>
                              <span onClick={() => {markAsDone(todo.id)}}><input type="checkbox" checked={todo.isdone ? true : false}/></span>
                              <span className='todo-data' style={todo.isdone ? {textDecoration : "line-through"} : {}}>
                                {updatingState.id !== todo.id ? todo.todo : null }  
                              </span>
                              {updatingState.id === todo.id ? <span className='todo-data' ><input type="text" className="editor" id="editor" /> <button className='todo-ops' onClick={() => {
                                saveChanges(todo.id , document.getElementById('editor').value);
                              }}>done</button></span> : null}
                          </section>
                        
                        <section className='row-todo-ops'>
                          <span className='todo-date'>
                            {todo.created_at.slice(0 , 10)}
                          </span>
                          <section className='row '>
                              {!todo.isdone ? 
                              <span className='todo-ops' onClick={() => {
                                editTodo(todo.id)
                              }}>Edit</span> 
                              : 
                              null}
                              <span className='todo-ops' onClick={() => {deleteTodo(todo.id)}}>Delete</span>
                          </section>
                        </section>
                      </section>
                    </section>
                  )
                })
               : null}
            </section>
          </section>) 
}