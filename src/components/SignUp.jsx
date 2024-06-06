import { createClient } from '@supabase/supabase-js'


export default function Signup(){
    
    window.addEventListener("load" , (e) => {
          
        if(localStorage.getItem("session"))  window.location = "/";

    });

    const supabase = createClient('https://asnvuyznngsplkniggui.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbnZ1eXpubmdzcGxrbmlnZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNzQwNzMsImV4cCI6MjAzMDc1MDA3M30.EJ_FkqZ0CqZpjhI6y5yUBbVe52VXNukS3lnMKXh_vSk')

    const signup = async (email , password) => {
    
        const { data, error } = await supabase.auth.signUp({
          email: email ,
          password: password ,
          options: {
            emailRedirectTo: 'http://localhost:4321/',
          },
        })

        console.log(data);
        if(data.session) {
         
          try{
    
            const res = await fetch("http://127.0.0.1:4321/api/createUser.json" , {
                    mode: "cors",
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                      }, 
                    body : JSON.stringify({            
                                key : data.user.id,
                                email : data.user.email 
                    })
            })
            
              
           
            
            const response = await res.json();
    
            if(res.status === 200){
                localStorage.setItem("session" , data.session.access_token)
                window.location = "/";
            }else{
              console.log(response.error);
            }
          }catch(err){
            console.log(err);
          }
          
        };
        
      }
    
    
    return (
        <>
           
         <section className='auth-container'>
            <section className='switch-auth'>
                <section className='sign-option'>
                <span className='sign-tab'>SignUp</span>
                </section>

                <section className='sign-box'>
                    <input className='email-box' id="email"  type="email" placeholder='email' required/>
                    <input className="password-box" id="password"  type="password" placeholder='password' required />
                    <button className="submit-btn"  type="submit" onClick={() => {
                        
                        const emailRef = document.getElementById("email");
                        const passwordRef = document.getElementById("password");

                        if(emailRef.value && passwordRef.value) signup(emailRef.value , passwordRef.value);
                    }}>
                    Sign up
                    </button>
                    <a className="sign-anchor" href="/auth/signin">already have an account ? signin</a>
                </section>
    
            </section>
        </section> 
        </>
    )
}