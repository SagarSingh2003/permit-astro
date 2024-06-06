import { createClient } from '@supabase/supabase-js';


export default function SignIn() {

  const supabase = createClient('https://asnvuyznngsplkniggui.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbnZ1eXpubmdzcGxrbmlnZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNzQwNzMsImV4cCI6MjAzMDc1MDA3M30.EJ_FkqZ0CqZpjhI6y5yUBbVe52VXNukS3lnMKXh_vSk')

  window.addEventListener("load" , (e) => {
      
      if(localStorage.getItem("session"))  window.location = "/";
  
  });


  const signin = async (email, password ) => {
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if(data.session) {
      
      localStorage.setItem("session" , data.session.access_token)
      window.location = "/";
    };
    
  }

    return (
        <>
     <section className='auth-container'>
          <section className='switch-auth'>
            <section className='sign-option'>
              <span className='sign-tab'>SignIn</span>
            </section>

            <section className='sign-box'>
                <input className='email-box' id="email" type="email" placeholder='email' required/>
                <input className="password-box" id="password" type="password" placeholder='password' required />
                <button className="submit-btn" type="submit" onClick={() => {
                  
                  const emailRef = document.getElementById("email");
                  const passwordRef = document.getElementById("password");

                   if(emailRef?.value && passwordRef?.value) signin(emailRef.value , passwordRef.value);
                   
                }}>
                  Sign in
                </button>
                <a className="sign-anchor" href="/auth/signup">already have an account? signup</a>
              </section>
              
          </section>
    </section>
   </>
    )
}