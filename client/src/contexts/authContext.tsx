import axios from "axios";
import { createContext, useReducer, useContext, useEffect } from "react";

interface User{
    username:string,
    email:string,
}

interface State{
    user:User,
    authenticated:boolean,
    loading:boolean
}

interface Action{
    type:string,
    payload:any
}

let StateContext = createContext(null)

let DispatchContext = createContext(null)

const reducer = (state:State,action:Action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state,user:action.payload, authenticated:true }
            break;
        case 'LOGOUT':
            return { ...state, authenticated:false }
            break;
        case 'STOP_LOADING':{
            return { ...state, loading:false }
            break;
        }
        default:
            break;
    }
}

export default function AuthProvider( { children } ){
    const initialState:State = {
        user:null,
        authenticated:false,
        loading:false
    }
    const [ state,defaultDispatch ] = useReducer(reducer,initialState)
    const dispatch = (type:string,payload?:any) => defaultDispatch({ type, payload })

    useEffect(() => {
        async function loadUser(){
            try {
                let res = await axios.get('/auth/me')
                console.log(res)
                dispatch('LOGIN',res.data)
            } catch (error) {
                console.log({...error})
            }finally{
                dispatch('STOP_LOADING')
            }
        }
        loadUser()
    }, [])
    return (
        <div className="">
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    { children }
                </DispatchContext.Provider>
            </StateContext.Provider>
        </div>
    )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)
