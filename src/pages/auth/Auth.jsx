import {useContext, useEffect, useState} from "react"
import UserContext from "../context/UserContext";
import api from "../api";
import {useNavigate} from "react-router-dom";

export default function Auth(){

	// initialization of useNavigate and useContext

	// to be used for navigating
	const navigate = useNavigate(); // << 

	const user = useContext(UserContext); // <<
	//  token, setNewToken, clearToken, isAuthenticated

	 // Initialize the states
		// [state, setterFunction]
   	const [isRegister, setIsRegister] = useState(false)
   	const [form, setForm] = useState({
	       email: '',
       password: ''
   	})
   	const [error, setError] = useState('')


   	const submit = async () => {
       setError('')
       try {
         const route = isRegister ? 'register' : 'login'
									// removed the .value in the form state
         const res = await api.post(`/auth/${route}`, form)
        
         user.setNewToken(res.data.token)
      
         // Redirect to the home page when the user is logged in  
         navigate('/')
        
       } catch (err) {
         setError(err.response?.data?.error || 'Something went wrong')
         console.log(err)
       }
     }


     // We can also use useEffect as watchers by adding variables/states in the dependency array.
    // It will watch that value/values for changes and run the function when it/they changes.

     // track changes on state and creates effect based on the changes
    useEffect(() => {

    	// everytime we visit /login 
        if(user.token) {
            // Redirect to the home page when the user is already logged in
            navigate('/')
        }
    }, []) // empty dependency array



	return (
       // Reactjs uses objects to define styles
       <div className="container d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
           <div class="card p-4" style={{width: "100%", maxWidth: "400px"}}>
          
           <h4 className="mb-3 text-center">{ isRegister ? 'Register' : 'Login' }</h4>

           <form onSubmit = {(e) => {
           	e.preventDefault();
           	submit();
           }}>
               <input
                   type="email"
                   className="form-control mb-2"
                   placeholder="Email"
                   // two way data binding like the v-model in Vuejs but in React we use the value and onChange
                   value={form.email} // 1st bind
                   onChange={(e) => setForm({...form, email: e.target.value})} // 2nd bind
               />
               <input
                   type="password"
                   className="form-control mb-3"
                   placeholder="Password"
                   // two way data binding
                   value={form.password}
                   onChange={(e) => setForm({...form, password: e.target.value})}
               />
               <button className="btn btn-success w-100">{ isRegister ? 'Register' : 'Login' }</button>
           </form>


           <div className="mt-3 text-center">
               <button className="btn btn-link text-success" onClick={() => setIsRegister(!isRegister)}>
                   { isRegister ? 'Already have an account?' : 'Need an account?' }
               </button>
           </div>


           {/* Conditional Rendering like the v-if in Vue */}
           {/* There  are two ways to do conditional rendering in React */}
           {/* 1. Ternary Operator -  example: {isLoggedIn ? <h1>Hello user!</h1> : <h1>Please login first.</h1>} */}
           {/* 2. Logical Operator && - example: shown below */}


           { error && <p className="text-danger text-center">{ error }</p> }


           </div>
       </div>
   )
}