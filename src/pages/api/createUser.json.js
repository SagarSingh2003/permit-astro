import { Permit } from "permitio";


export const GET = ({ params, request }) => {
    return new Response(JSON.stringify({
        message: "This was a GET!"
      })
    )
  }
  
  

export const POST = async ({ request }) => {
    
    const permit = new Permit({
        // your API Key
        token: import.meta.env.PERMIT_TOKEN,
        pdp: "https://cloudpdp.api.permit.io",
  
    });

      
    if (request.headers.get("Content-Type") === "application/json") {
      const body = await request.json();
     
    const user = {
        key: body.key ,
        email: body.email ,
    }


    const assignedRole = JSON.stringify({
        role : "Employee",
        tenant : "todo-tenant",
        user : body.key
    })



    let response ;
    
        try{
            //sync the user
            await permit.api.syncUser(user);
            
            //assign the user a role 
            await permit.api.assignRole(assignedRole);
            
            
            response = {
                msg : "tenant with employee role created successfully"
            }

            return new Response(JSON.stringify(response), {status : 200})

        }catch(err){
            console.log(err);
            response = {
                error : err
            }


            return new Response(JSON.stringify(response), {status : 500})
        }
    }
    
    return new Response(JSON.stringify({message : "some error occured"}), { status: 400 });
}
